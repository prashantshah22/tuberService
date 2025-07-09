import dotenv from "dotenv"
dotenv.config()

const port = process.env.PORT

import cors from 'cors'
import { createProxyMiddleware } from "http-proxy-middleware";
import express, {Request, Response} from "express";
const app = express()

app.listen(port,()=>console.log(`Server running on ${port}`))

app.use(cors({
    origin:[process.env.CLIENT!,"https://devui.rohitshahi.info.np/"],
   credentials:true
}))

app.use('/video', createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true
}))

app.use('/auth', createProxyMiddleware({
    target: 'http://localhost:4001',
    changeOrigin: true
}))

app.use('/like', createProxyMiddleware({
    target: 'http://localhost:4002',
    changeOrigin: true
}))

app.use('/comment', createProxyMiddleware({
    target: 'http://localhost:4003',
    changeOrigin: true
}))