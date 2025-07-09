import { Router } from "express";
import { countLikeDislike, createLikeDislike } from "./like.controller";
import { LikeGuardMiddleware } from "./like.middleware";
const LikeRouter = Router()

LikeRouter.post("/", LikeGuardMiddleware, createLikeDislike)
LikeRouter.get("/:videoId", countLikeDislike)

export default LikeRouter