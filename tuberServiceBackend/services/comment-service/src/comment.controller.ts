import { Request, Response } from 'express'
import { AuthInterface, ErrorStatus } from './comment.interface'
import * as CommentService from './comment.service'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateCommentDto, UpdateCommentDto } from './comment.dto'

export const createComment = async (req: AuthInterface, res: Response) => {
    try {
        const dto = plainToInstance(CreateCommentDto, req.body)
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

        const comment = await CommentService.createComment(dto, req)
        res.json(comment)
    }
    catch (err: any) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.payload || null
        });
    }
}

export const fetchComment = async (req: Request, res: Response) => {
    try {
        const comments = await CommentService.fetchComment(req.params.videoId)
        res.json(comments)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message })
    }
}

export const updateComment = async (req: AuthInterface, res: Response) => {
    try {
        const dto = plainToInstance(UpdateCommentDto, req.body)
        const error = await validate(dto)

       
        if (error.length > 0) {
            const flatErrors = error.flatMap(error =>
                Object.values(error.constraints || {})
            );

            const err: ErrorStatus = new Error("Dto validation failed");
            err.status = 400;
            err.payload = flatErrors;

            throw err;
        }

        const comments = await CommentService.updateComment(req.params.id, dto)
        res.json(comments)
    }
    catch (err: any) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.payload || null
        });
    }
}