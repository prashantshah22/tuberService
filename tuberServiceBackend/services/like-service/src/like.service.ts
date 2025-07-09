import mongoose from "mongoose";
import { AuthInterface, ErrorStatus, InjectUser, LikeModelDocument } from "./like.interface";
import LikeModel from "./like.model";
import { CreateLikeDto } from "./like.dto";

export const createLikeDislike = async (body: InjectUser, req: AuthInterface): Promise<LikeModelDocument> =>{
    if(!req.auth)
    {
        const err: ErrorStatus = new Error("Unauthorized")
        err.status = 401
        throw err
    }
    body.user = req.auth.id

    let like: any = await LikeModel.findOne({user: req.auth.id, videoId: body.videoId})

    if(!like)
    {
        like = await LikeModel.create(body)
        return like
    }

    if(like.status === body.status)
    {
        const error: ErrorStatus = new Error("Invalid request")
        error.status = 400
        throw error
    }

    like.status = body.status
    await like.save()
    return like
}

export const countLikeAndDislike = async (videoId: string): Promise<{like: number, dislike: number}> =>{
    const data = await LikeModel.aggregate([
        {$match: {videoId: new mongoose.Types.ObjectId(videoId)}},
        {
            $group: {
                _id: "$status",
                count: {$sum: 1}
            }
        }
    ])
    
    const like = data.find((item)=>item._id === "like")?.count || 0
    const dislike = data.find((item)=>item._id === "dislike")?.count || 0
    return {like, dislike}
}