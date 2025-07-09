import { Router } from "express";
import { login, signup, refreshToken, verifyAuthToken, authPopulator } from "./auth.controller";
import { AuthGuardMiddleware, ServerGuardMiddleware } from "./auth.middleware";
const AuthRouter = Router()

AuthRouter.post('/signup', signup)
AuthRouter.post('/login', login)
// AuthRouter.post('/refresh-token', refreshToken)
AuthRouter.post('/refresh-token',AuthGuardMiddleware, refreshToken)

AuthRouter.post('/verify-token', verifyAuthToken)
AuthRouter.post('/populate',ServerGuardMiddleware ,authPopulator)


export default AuthRouter