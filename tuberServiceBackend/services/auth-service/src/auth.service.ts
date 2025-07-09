import moment from "moment"
import { LoginDto, RefreshTokenDto, SignupDto } from "./auth.dto"
import { AuthInterface, AuthModelInterface, ErrorStatus, MessageInterface } from "./auth.interface"
import AuthModel from "./auth.model"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { Request } from "express"

const AUTH_EXPIRY = '15m'

export const signup = async (body: SignupDto): Promise<MessageInterface> => {
    const userExist = await AuthModel.countDocuments({ email: body.email })
    if (userExist) {
        const err: ErrorStatus = new Error("User with this email already exists");
        err.status = 409;
        throw err;
    }
    await AuthModel.create(body)
    return { message: 'Signup success' }
}

export const login = async (body: LoginDto) => {
    const user = await AuthModel.findOne({ email: body.email })

    if (!user) {
        const err: ErrorStatus = new Error("User doesn`t exists")
        err.status = 404
        throw err
    }

    const isLogin = await bcrypt.compare(body.password, user.password)

    if (!isLogin) {
        const err: ErrorStatus = new Error("Email or password incorrect")
        err.status = 401
        throw err
    }

    return {
        message: 'login success',
        accessToken: await getToken(user),
        refreshToken: user.refreshToken
    }
}

export const refreshToken = async (body: RefreshTokenDto) => {
    const user = await AuthModel.findOne({ refreshToken: body.refreshToken })

    if (!user || new Date() > user.expiredAt) {
        const err: ErrorStatus = new Error("Invalid token")
        err.status = 401
        throw err
    }

    const newRefreshToken = uuid()
    const expiredAt = moment().add('30', 'days').toDate()
    await AuthModel.updateOne(
        { _id: user._id },
        {
            $set: {
                refreshToken: newRefreshToken,
                expiredAt
            }
        }
    )

    return {
        message: 'Token refreshed',
        accessToken: await getToken(user),
        refreshToken: newRefreshToken
    }
}

const getToken = async (user: AuthModelInterface) => {
    const payload = {
        id: user._id,
        fullname: user.fullname,
        channelName: user.channelName,
        email: user.email
    }

    const token = await jwt.sign(payload, process.env.AUTH_SECRET as string, { expiresIn: AUTH_EXPIRY })
    return token
}

export const verifyAuthToken = async (req: Request) => {
    const accessToken = Array.isArray(req.headers['x-auth-token'])
        ? req.headers['x-auth-token'][0]
        : req.headers['x-auth-token'];

    if (!accessToken) {
        const err: ErrorStatus = new Error("Invalid request")
        err.status = 401
        throw err
    }

    const payload: any = await jwt.verify(accessToken, process.env.AUTH_SECRET as string)

    return {
        channelName: payload.channelName,
        fullname: payload.fullname,
        email: payload.email,
        id: payload.id
    }
}

export const authPopulator = (req: AuthInterface) => {
    if (!req.auth) {
        const err: ErrorStatus = new Error("Invalid request")
        err.status = 401
        throw err
    }
    return req.auth;

}