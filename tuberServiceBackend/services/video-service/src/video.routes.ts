import { Router } from "express";
import { 
    fetchVideos, 
    fetchVideoById, 
    createVideo, 
    updateVideo, 
    deleteVideo, 
    createViews,
    videoWebhook,
    createThumbnail,
    fetchVideosAdmin,
    recomendedVideo
} from "./video.controller";
import { videoGuardMiddleware } from "./video.middleware";


const VideoRouter = Router();

VideoRouter.get("/", fetchVideos);
VideoRouter.get("/recommended", recomendedVideo);
VideoRouter.get("/admin",videoGuardMiddleware, fetchVideosAdmin);
VideoRouter.get("/:id", fetchVideoById);
VideoRouter.post("/", videoGuardMiddleware, createVideo);
VideoRouter.post("/thumbnail", videoGuardMiddleware, createThumbnail);
VideoRouter.put("/:id",videoGuardMiddleware, updateVideo);
VideoRouter.delete("/:id",videoGuardMiddleware, deleteVideo);
VideoRouter.post("/count/views", createViews)
VideoRouter.post("/webhook", videoWebhook)

export default VideoRouter;