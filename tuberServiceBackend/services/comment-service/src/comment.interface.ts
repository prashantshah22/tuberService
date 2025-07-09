import mongoose, { Document } from "mongoose"
import { Request } from "express";
import { Schema } from "mongoose";
import { CreateCommentDto } from "./comment.dto";

export interface CommentModelDocument extends Document {
    user: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
    comment: string
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

export interface InjectUser extends CreateCommentDto {
    user?: string
}