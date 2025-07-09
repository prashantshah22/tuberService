import mongoose, { Document } from "mongoose"
import { VideoStatusEnum } from "./video.enum";
import { CreateVideoDto } from "./video.dto";
import { Request } from "express";
import { Schema } from "mongoose";

export interface VideoModelDocument extends Document {
    user: Schema.Types.ObjectId,
    title: string;
    description: string;
    duration: number;
    size: number;
    path: string;
    status: VideoStatusEnum;
    views: number
    thumbnail:string
}

export interface ErrorStatus extends Error {
    status?: number
    payload?:any
}

export interface MessageInterface {
    message: string
}

export interface PathInterface extends CreateVideoDto {
    path?: string,
    user?: string
}

export interface AuthInterface extends Request {
    auth?: {
        fullname: string;
        email: string;
        channelName: string;
        id: string
    }
} 