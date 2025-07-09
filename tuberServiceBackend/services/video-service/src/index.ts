import dotenv from "dotenv"
dotenv.config()

import { createClient } from "redis";
export const RedisClient = createClient()
RedisClient.connect().catch(()=>{
    console.log({message: 'Failed to connect with redis'})
    process.exit(1)
})

import mongoose from "mongoose";
mongoose.connect(process.env.DB as string)

const port = process.env.PORT || 4000

import morgan from 'morgan'
import express from "express";
import bodyParser from "body-parser";
import VideoRouter from "./video.routes";
import Redis from "ioredis";
const app = express()

app.listen(port,()=>console.log(`Server running on ${port}`))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(VideoRouter)