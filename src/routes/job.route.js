import { Router } from "express";
import {
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobApplications
} from "../controllers/job.controller.js"

import { employerRole } from "../middlewares/employerRole.middleware.js";


const jobRouter = Router()



jobRouter.route("/createJob").
post(employerRole,createJob)

jobRouter.route("/:jobId").
patch(employerRole,updateJob).
delete(employerRole,deleteJob).
get(getJobById)

jobRouter.route("/applications/:jobId").get(employerRole,getJobApplications)

export {jobRouter}