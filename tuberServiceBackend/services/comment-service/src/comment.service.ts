import axios from "axios";
axios.defaults.baseURL = process.env.HOST
import { UpdateCommentDto } from "./comment.dto";
import { AuthInterface, CommentModelDocument, ErrorStatus, InjectUser } from "./comment.interface";
import CommentModel from "./comment.model";

export const createComment = async (body: InjectUser, req: AuthInterface): Promise<CommentModelDocument> => {
    if (!req.auth) {
        const err: ErrorStatus = new Error("Unauthorized")
        err.status = 401
        throw err
    }

    body.user = req.auth.id
    const comment = await CommentModel.create(body)
    return comment
}

export const fetchComment = async (videoId: string): Promise<any> => {
    const comments = await CommentModel.find({ videoId })
    const modifiedComment = await Promise.all(
        comments.map(async (comment) => {
            const options = {
                headers: {
                    'x-server-secret': process.env.SERVER_SECRET
                }
            }
            const id = comment.user
            const { data } = await axios.post('/auth/populate', { id }, options)
            const modified = comment.toObject();
            modified.user = data;
            return modified
        })
    )
    return modifiedComment
}

export const updateComment = async (id: string, body: UpdateCommentDto): Promise<CommentModelDocument> => {
    const comment = await CommentModel.findByIdAndUpdate(id, body, { new: true })

    if (!comment) {
        const err: ErrorStatus = new Error("Comment not found")
        err.status = 404
        throw err
    }

    return comment
}