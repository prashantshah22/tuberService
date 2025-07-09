import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uniqueId } from 'uuid'
import { NextFunction, Response } from 'express'
import axios from 'axios'
import { AuthInterface } from './video.interface'
axios.defaults.baseURL = process.env.HOST

const s3 = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    }
})

export const uploadMiddleware = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME as string,
        key: (req, file, next)=>{
            const ext = file.originalname.split(".").pop()
            next(null, `videos/${uniqueId()}.${ext}`)
        }
    })
})

export const videoGuardMiddleware  = async (req: AuthInterface, res: Response, next: NextFunction)=>{
    try {
        const options = {
            headers: {
                'X-Auth-Token': req.headers['x-auth-token']
            }
        }
        const {data} = await axios.post('/auth/verify-token', {}, options)
        console.log("middleware",data)
        req.auth = data
        next()
    }
    catch(err: any)
    {
       res.status(401).json({message: 'Unauthorized'})
    }
}

