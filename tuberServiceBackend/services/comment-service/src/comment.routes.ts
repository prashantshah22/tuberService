import { Router } from "express";
import { CommentGuardMiddleware } from "./comment.middleware";
import { createComment, fetchComment, updateComment } from "./comment.controller";
const CommentRouter = Router()

CommentRouter.post("/", CommentGuardMiddleware, createComment)
CommentRouter.get("/:videoId", fetchComment)
CommentRouter.put('/:id', CommentGuardMiddleware, updateComment)

export default CommentRouter