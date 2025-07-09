import { NextFunction, Request, Response } from "express";
import { AuthInterface, ErrorStatus, ServerInterface } from "./auth.interface";
import jwt from 'jsonwebtoken'
import AuthModel from "./auth.model";

export const AuthGuardMiddleware = async (req: AuthInterface, res: Response, next: NextFunction) => {
    try {
        const accessToken = Array.isArray(req.headers['x-auth-token'])
            ? req.headers['x-auth-token'][0]
            : req.headers['x-auth-token'];

        if (!accessToken) {
            const err: ErrorStatus = new Error("Invalid request")
            err.status = 401
            throw err
        }

        const payload: any = await jwt.verify(accessToken, process.env.AUTH_SECRET as string)

        req.auth = {
            channelName: payload.channelName,
            fullname: payload.fullname,
            email: payload.email,
            id: payload.id
        }

        next()
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: 'Invalid request' })
    }
}

export const ServerGuardMiddleware = async (req: ServerInterface, res: Response, next: NextFunction) => {
    try {
        const serverToken = Array.isArray(req.headers['x-server-secret'])
            ? req.headers['x-server-secret'][0]
            : req.headers['x-server-secret'];
        if (!serverToken) {
            const err: ErrorStatus = new Error("Invalid request")
            err.status = 401
            throw err
        }
        if (serverToken !== process.env.SERVER_SECRET) {
            const err: ErrorStatus = new Error("Invalid request")
            err.status = 401
            throw err
        }

        const payload = await AuthModel.findById(req.body.id, { fullname: 1, email: 1, channelName: 1 })
        if (!payload) {
            const err: ErrorStatus = new Error("Invalid request")
            err.status = 401
            throw err
        }

        req.auth = {
            channelName: payload.channelName,
            fullname: payload.fullname,
            id: payload.id
        }

        next()
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: 'Invalid request' })
    }
}
