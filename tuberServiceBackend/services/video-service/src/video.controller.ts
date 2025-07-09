import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { CreateVideoDto, CreateViewsDto, UpdateVideoDto } from "./video.dto";
import { validate } from "class-validator";
import { AuthInterface, ErrorStatus } from "./video.interface";
import * as VideoService from './video.service'

export const createVideo = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(CreateVideoDto, req.body)
        const error = await validate(dto)
        if (error.length) {
            const flatErrors = error.flatMap(error =>
                Object.values(error.constraints || {})
            );
            const err: ErrorStatus = new Error("Dto validation failed");
            err.status = 400;
            err.payload = flatErrors;
            throw err;
        }
        const video = await VideoService.createVideo(dto, req)
        res.json(video)
    }
    catch (err: any) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.payload || null
        });
    }
};

export const fetchVideos = async (req: Request, res: Response) => {
    try {
        const videos = await VideoService.fetchVideos()
        res.json(videos)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

export const fetchVideosAdmin = async (req: AuthInterface, res: Response) => {
    try {
        const userId = req?.auth?.id;
        if (!userId) {
            const err: ErrorStatus = new Error("Unauthorized");
            err.status = 401;
            throw err;
        }
        const videos = await VideoService.fetchVideosAdmin(userId)
        res.json(videos)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export const fetchVideoById = async (req: Request, res: Response) => {
    try {
        const video = await VideoService.fetchVideoById(req.params.id) 
        res.json(video)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

export const updateVideo = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(UpdateVideoDto, req.body)
        const error = await validate(dto)
        if (error.length) {
            const flatErrors = error.flatMap(error =>
                Object.values(error.constraints || {})
            );
            const err: ErrorStatus = new Error("Dto validation failed");
            err.status = 400;
            err.payload = flatErrors;
            throw err;
        }
        const video = await VideoService.updateVideo(req.params.id, dto)
        res.json(video)
    }
    catch (err: any) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.payload || null
        });
    }
};

export const deleteVideo = async (req: AuthInterface, res: Response) => {
    try {
        const userId = req?.auth?.id;
        if (!userId) {
            const err: ErrorStatus = new Error("Unauthorized");
            err.status = 401;
            throw err;
        }

        const video = await VideoService.deleteVideo(req.params.id, userId)
        res.json(video)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

export const createViews = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(CreateViewsDto, req.body)
        const error = await validate(dto)

        if (error.length) {
            const flatErrors = error.flatMap(error =>
                Object.values(error.constraints || {})
            );

            const err: ErrorStatus = new Error("Dto validation failed");
            err.status = 400;
            err.payload = flatErrors;

            throw err;
        }

        const views = await VideoService.createViews(dto)
        res.json(views)
    }
    catch (err: any) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.payload || null
        });
    }
}

export const videoWebhook = async (req: Request, res: Response) => {
    try {
        const webhook = await VideoService.VideoWebhook(req.body)
        res.json(webhook)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
};


export const createThumbnail = async (req: AuthInterface, res: Response) => {
    try {
        const userId = req?.auth?.id;
        if (!userId) {
            const err: ErrorStatus = new Error("Unauthorized");
            err.status = 401;
            throw err;
        }
        const webhook = await VideoService.createThumbnail(req.body, userId);
        res.json(webhook)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

export const recomendedVideo = async (req: Request, res: Response) => {
    try {
        const video = await VideoService.recomendedVideo() 
        console.log("*******1****",video)
        res.json(video)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
}