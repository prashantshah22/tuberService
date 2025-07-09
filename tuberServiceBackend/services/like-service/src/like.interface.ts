import mongoose, { Document } from "mongoose"
import { Request } from "express";
import { Schema } from "mongoose";
import { LikeStatusEnum } from "./like.enum";
import { CreateLikeDto } from "./like.dto";


export interface LikeModelDocument extends Document {
    user: Schema.Types.ObjectId
    videoId: Schema.Types.ObjectId
    status: LikeStatusEnum
}

export interface ErrorStatus extends Error {
    status?: number;
    payload?:any
}

export interface MessageInterface {
    message: string
}

export interface AuthInterface extends Request {
    auth?: {
        fullname: string;
        email: string;
        channelName: string;
        id: string
    }
} 

export interface InjectUser extends CreateLikeDto {
    user?: string
}