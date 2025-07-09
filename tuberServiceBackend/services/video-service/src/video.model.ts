import mongoose, { Schema, model } from 'mongoose'
import { VideoModelDocument } from './video.interface'
import { VideoStatusEnum } from './video.enum'

const VideoSchema = new Schema<VideoModelDocument>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Auth'
    },
    title: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    thumbnail: {
        type: String,
    },
    duration: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        trim: true,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: VideoStatusEnum,
        default: VideoStatusEnum.private
    }
}, { timestamps: true })

const VideoModel = model<VideoModelDocument>("Video", VideoSchema)
export default VideoModel