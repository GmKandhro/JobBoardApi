import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json({limit:"15kb"}))
app.use(express.urlencoded({limit:"10kb"}))
app.use(express.static("./public"))

app.use(cookieParser())

// routes

import { userRouter } from "./routes/user.route.js"
import { jobRouter } from "./routes/job.route.js"
import { applicationRouter } from "./routes/application.route.js"
import { dashboardRouter } from "./routes/dashboard.route.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/jobs",jobRouter)
app.use("/api/v1/applications",applicationRouter)
app.use("/api/v1/dashboard",dashboardRouter)


export {app}