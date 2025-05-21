import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/jod.model.js";

const createApplication = asyncHandler(async(req,res)=>{
    const {message} = req.body 
    const {jobId} = req.params

    if(req?.user?.isBlocked === true){
        throw new ApiError(400,"You can not apply for job. you are bloacked by admin")
    }

    if(!jobId || !isValidObjectId(jobId)){
        throw new ApiError(400,"Job id is missing")
    }
    if(!message){
        throw new ApiError(400,"All fields are required")
    }

    const alreadyExists = await Application.findOne({job:jobId, candidate:req.user._id})

    if(alreadyExists){
        throw new ApiError(400,"you have already applyed for this job")
    }
    const resume = req?.file?.path

    if(!resume){
        throw new ApiError(400,"Resume is required")
    }

    const uploadedResueme = await uploadOnCloudinary(resume)

    // console.log(uploadedResueme)
    if(!uploadedResueme){
        throw new ApiError(400,"SomeThing went wrong while uploading resume")
    }

    const application = await Application.create({
        message,resume:uploadedResueme?.url , candidate: req.user._id, job:jobId
    })

    const job = await Job.findById(jobId)

    job.applications.push(application._id)
    await job.save()

    return res.status(200).json(
        new ApiResponse(200,"Application created successful",application)
    )
})


export {createApplication}


