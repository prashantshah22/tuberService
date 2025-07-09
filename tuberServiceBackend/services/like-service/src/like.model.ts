import mongoose, {Schema, model} from 'mongoose'
import { LikeStatusEnum } from './like.enum'
import { LikeModelDocument } from './like.interface'

const likeSchema = new Schema<LikeModelDocument>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    videoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Video'
    },
    status: {
        type: String,
        enum: LikeStatusEnum,
        required: true
    }
}, {timestamps: true})

const LikeModel = model<LikeModelDocument>("Like", likeSchema)
export default LikeModel