import { Request, Response } from "express";
import * as AuthService from './auth.service'
import { plainToInstance } from "class-transformer";
import { LoginDto, RefreshTokenDto, SignupDto } from "./auth.dto";
import { validate } from "class-validator";
import { AuthInterface, ErrorStatus } from "./auth.interface";

export const signup = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(SignupDto, req.body)
        const errors = await validate(dto)

        if (errors.length) {

            const err: ErrorStatus = new Error("Dto validation failed")
            err.status = 400
            throw err
        }

        const user = await AuthService.signup(dto)
        res.json(user)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(LoginDto, req.body)
        const errors = await validate(dto)

        if (errors.length) {

            const err: ErrorStatus = new Error("Dto validation failed")
            err.status = 400
            throw err
        }

        const user = await AuthService.login(dto)
        res.json(user)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(RefreshTokenDto, req.body)
        const errors = await validate(dto)

        if (errors.length) {
            const err: ErrorStatus = new Error("Dto validation failed")
            err.status = 400
            throw err
        }

        const token = await AuthService.refreshToken(dto)
        res.json(token)
    }
    catch (err: any) {
        res.status(err.status || 500).json({ message: err.message })
    }
}

export const verifyAuthToken = async (req: Request, res: Response) => {
    try {
        const payload = await AuthService.verifyAuthToken(req)
        res.json(payload)
    }
    catch (err: any) {
        console.log(err)
        res.status(err.status || 500).json({ message: 'Invalid token' })
    }
}

export const authPopulator = async (req: AuthInterface, res: Response) => {
    try {
        const payload = await AuthService.authPopulator(req)
        res.json(payload)
    }
    catch (err: any) {
        console.log(err)
        res.status(err.status || 500).json({ message: 'Invalid token' })
    }
}