import { Request } from "express";
import { Document } from "mongoose";

export interface AuthModelInterface extends Document {
    channelName: string;
    fullname: string;
    refreshToken: string;
    expiredAt: Date;
    email: string;
    password: string
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

export interface ServerInterface extends Request {
    auth?: {
        fullname: string;
        channelName: string;
        id: string
    }
} 