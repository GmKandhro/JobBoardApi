import { Router } from "express";
import { createApplication } from "../controllers/application.controller.js";
import { candidateRole } from "../middlewares/candidateRole.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const applicationRouter = Router()



applicationRouter.route("/createApplication/:jobId").post(
    candidateRole,
    upload.single("resume"),
    createApplication
)



export {applicationRouter}


