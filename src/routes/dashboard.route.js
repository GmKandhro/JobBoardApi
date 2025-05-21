import { Router } from "express";
import {
    getAllUsersJobsApplications,
    deleteJob,
    deleteUser,
    toggleBlockUser
} from "../controllers/dashboard.controller.js"
import { adminRole } from "../middlewares/adminRole.middleware.js";

const dashboardRouter = Router()

dashboardRouter.use(adminRole)


dashboardRouter.route("/getStats").get(getAllUsersJobsApplications)
dashboardRouter.route("/deleteJob/:jobId").delete(deleteJob)
dashboardRouter.route("/deleteUser/:userId").delete(deleteUser)
dashboardRouter.route("/toggleBlock/:userId").patch(toggleBlockUser)


export {dashboardRouter}