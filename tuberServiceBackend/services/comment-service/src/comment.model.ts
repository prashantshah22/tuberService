import mongoose, { Schema, model } from "mongoose";
import { CommentModelDocument } from "./comment.interface";

const commentSchema = new Schema<CommentModelDocument>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    videoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    comment: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }
}, {timestamps: true})

const CommentModel = model<CommentModelDocument>("Comment", commentSchema)
export default CommentModel