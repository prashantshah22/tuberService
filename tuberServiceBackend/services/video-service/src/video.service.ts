import { RedisClient } from ".";
import { CreateViewsDto, UpdateVideoDto } from "./video.dto";
import { AuthInterface, ErrorStatus, MessageInterface, PathInterface, VideoModelDocument } from "./video.interface";
import VideoModel from "./video.model";
import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uniqueId } from 'uuid'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs'
import axios from "axios";

const s3 = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    }
})

const ONE_DAY = 86400

export const createVideo = async (body: PathInterface, req: AuthInterface): Promise<{ signedUrl: string }> => {
    if (!req.auth) {
        const err: ErrorStatus = new Error("Unauthorized")
        err.status = 401
        throw err
    }

    const filename = uniqueId()
    const input = `videos/${filename}.mp4`
    const output = `stream/${filename}/${filename}.m3u8`

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: input,
        ContentType: 'video/mp4'
    })

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 })
    body.path = output
    body.user = req.auth.id
    await VideoModel.create(body)
    return { signedUrl: signedUrl }
}

export const fetchVideos = async (): Promise<VideoModelDocument[]> => {
    const cachedVideo = await RedisClient.get('videos')
    if (cachedVideo)
        return JSON.parse(cachedVideo)
    const videos = await VideoModel.find({ status: "public" }).sort({ createdAt: -1 }).lean()
    await RedisClient.setEx("videos", ONE_DAY, JSON.stringify(videos))
    return videos
}
export const fetchVideosAdmin = async (userId: string): Promise<VideoModelDocument[]> => {
    const cachedVideo = await RedisClient.get(userId)
    if (cachedVideo)
        return JSON.parse(cachedVideo)
    const videos = await VideoModel.find({ user: userId }).sort({ createdAt: -1 }).lean()
    if (videos.length == 0) {
        return videos
    }
    await RedisClient.setEx(userId, ONE_DAY, JSON.stringify(videos))
    return videos
}

export const fetchVideoById = async (id: string): Promise<VideoModelDocument> => {
    const cachedVideo = await RedisClient.get(id)
    if (cachedVideo)
        return JSON.parse(cachedVideo)
    const video = await VideoModel.findById(id).lean()
    if (!video) {
        const err: ErrorStatus = new Error("Video not found")
        err.status = 404
        throw err
    }
    const { data } = await axios.get(`/like/${video._id}`)
    const options = {
        headers: {
            'x-server-secret': process.env.SERVER_SECRET
        }
    }
    const { data: videoOwner } = await axios.post("/auth/populate", { id: video.user }, options)
    const modified = {
        ...video,
        ...data,
        videoOwner: videoOwner
    }
    await RedisClient.setEx(id, ONE_DAY, JSON.stringify(modified))
    return modified
}

export const updateVideo = async (id: string, body: UpdateVideoDto): Promise<VideoModelDocument> => {
    const video = await VideoModel.findByIdAndUpdate(id, body, { new: true })

    if (!video) {
        const err: ErrorStatus = new Error("Video not found")
        err.status = 404
        throw err
    }
    await RedisClient.del("videos")
    return video
}

export const deleteVideo = async (id: string, userId: string) => {
    const video = await VideoModel.findOne(
        { _id: id, user: userId },
        { path: 1, status: 1 }
    );

    if (!video) {
        const err: ErrorStatus = new Error("Video not found");
        err.status = 404;
        throw err;
    }
    if (video.status !== "public") {
        const err: ErrorStatus = new Error("Try again after one day.");
        err.status = 423;
        throw err;
    }
    if (!video.path || !video.path.includes("/")) {
        const err: ErrorStatus = new Error("Invalid video path");
        err.status = 422;
        throw err;
    }

    const bucket = process.env.S3_BUCKET_NAME;
    if (!bucket) {
        const err: ErrorStatus = new Error("S3 bucket name is not configured");
        err.status = 500;
        throw err;
    }

    const parts = video.path.split("/");
    const filename = parts[1];

    if (!filename) {
        const err: ErrorStatus = new Error("Invalid S3 filename derived from video path");
        err.status = 422;
        throw err;
    }
    const inputKey = `videos/${filename}.mp4`;
    const deleteOriginal = await s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: inputKey
    }));

    if (deleteOriginal.$metadata.httpStatusCode !== 204 && deleteOriginal.$metadata.httpStatusCode !== 200) {
        const err: ErrorStatus = new Error("Failed to delete original video from S3");
        err.status = 502;
        throw err;
    }

    const list = await s3.send(new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `stream/${filename}/`
    }));

    const chunkFiles = list.Contents?.map(obj => ({ Key: obj.Key! })) || [];

    if (chunkFiles.length > 0) {
        const deleteChunks = await s3.send(new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: { Objects: chunkFiles }
        }));

        if (deleteChunks.$metadata.httpStatusCode !== 200) {
            const err: ErrorStatus = new Error("Failed to delete stream chunks from S3");
            err.status = 502;
            throw err;
        }
    }
    await RedisClient.del("videos")
    await VideoModel.deleteOne({ _id: id, user: userId });

    return video;
};

export const createViews = async (body: CreateViewsDto): Promise<MessageInterface> => {
    const key = `video-${body.videoId}-views`
    await RedisClient.incr(key)
    const views = Number(await RedisClient.get(key))

    if (views > 5) {
        await VideoModel.findByIdAndUpdate(body.videoId, { $inc: { views: views } }, { new: true })
        await RedisClient.del(key)
    }

    return { message: "View added" }
}

export const VideoWebhook = async (body: any) => {
    const path = body.outputGroupDetails[0].playlistFilePaths[0]
    const filename = path.split("/").pop()
    await VideoModel.updateOne(
        {
            path: {
                $regex: new RegExp(filename, 'i')
            }
        },
        { status: "public" }
    )
    await RedisClient.del("videos")
    return { message: 'success' }
}


export const createThumbnail = async (body: any, userId: string): Promise<{ signedUrl: string, path: string }> => {
    if (!userId) {
        const err: ErrorStatus = new Error("Unauthorized")
        err.status = 401
        throw err
    }
    const videoCount = await VideoModel.countDocuments({ user: userId });
    if (videoCount === 0) {
        const err: ErrorStatus = new Error("No videos found for this user");
        err.status = 403;
        throw err;
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(body?.type)) {
        const err: ErrorStatus = new Error("Invalid image type. Only PNG and JPEG are allowed.");
        err.status = 400;
        throw err;
    }
    const path = `thumbnails/${uniqueId()}.png`;
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: path,
        ContentType: body.type,
        ACL: "public-read"
    })

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 })
    return { signedUrl, path }
}

export const recomendedVideo = async ()=>{
    const videos = await VideoModel.aggregate([
        {$sample: {size: 5}}
    ])
 
    const modifiedVideos = await Promise.all(
        videos.map(async (video)=>{
            const options = {
                headers: {
                    'x-server-secret': process.env.SERVER_SECRET
                }
            }
            const {data} = await axios.post('/auth/populate', {id: video.user}, options)
            video.user = data
            return video
        })
    )

    return modifiedVideos
}