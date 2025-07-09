import { NextFunction, Response } from "express"
import { AuthInterface } from "./like.interface"
import axios from 'axios'
axios.defaults.baseURL = process.env.HOST

export const LikeGuardMiddleware  = async (req: AuthInterface, res: Response, next: NextFunction)=>{
    try {
        const options = {
            headers: {
                'X-Auth-Token': req.headers['x-auth-token']
            }
        }
        const {data} = await axios.post('/auth/verify-token', {}, options)
        req.auth = data
        next()
    }
    catch(err: any)
    {
       res.status(401).json({message: 'Unauthorized'})
    }
}