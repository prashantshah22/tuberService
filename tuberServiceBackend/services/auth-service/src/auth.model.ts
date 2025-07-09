import { Schema, model } from "mongoose";
import { AuthModelInterface } from "./auth.interface";
import {v4 as uuid} from 'uuid'
import moment from "moment";
import bcrypt from 'bcrypt'

const authSchema = new Schema<AuthModelInterface>({
    channelName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: true
    },
    fullname: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        unique: true,
        index: true,
        default:()=> uuid()
    },
    expiredAt: {
        type: Date,
        default:()=> moment().add('30', 'days')
    }
}, {timestamps: true})

authSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password.toString(), 12)
    next()
})

const AuthModel = model<AuthModelInterface>('Auth', authSchema)
export default AuthModel