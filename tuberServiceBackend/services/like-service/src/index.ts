import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose";
mongoose.connect(process.env.DB as string)

const port = process.env.PORT

import express, {Request, Response} from "express";
import LikeRouter from "./like.routes";
const app = express()

app.listen(port,()=>console.log(`Server running on ${port}`))

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(LikeRouter)
