import { Request, Response } from 'express'
import * as LikeService from './like.service'
import { AuthInterface, ErrorStatus } from './like.interface'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateLikeDto } from './like.dto'

export const createLikeDislike = async (req: AuthInterface, res: Response) => {
    try {
        const dto = plainToInstance(CreateLikeDto, req.body)
        const error = await validate(dto)

        console.log("Dto Validation failed - ", error)

        if (error.length) {
            const flatErrors = error.flatMap(error =>
                Object.values(error.constraints || {})
            );

            const err: ErrorStatus = new Error("Dto validation failed");
            err.status = 400;
            err.payload = flatErrors;

            throw err;
        }

        const like = await LikeService.createLikeDislike(dto, req)
        res.json(like)
    }
    catch (err: any) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.payload || null
        });
    }
}

export const countLikeDislike = async (req: Request, res: Response) => {
    try {
        const like = await LikeService.countLikeAndDislike(req.params.videoId)
        res.json(like)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

