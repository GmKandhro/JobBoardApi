import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Job } from "../models/jod.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { application } from "express";


const createJob = asyncHandler(async(req,res)=>{

    if(req?.user?.isBlocked === true){
        throw new ApiError(400,"You can not create job. you are bloacked by admin")
    }

    const {title, description,salary,tags,deadLine,location} = req.body

    if(!title || !description || !salary || !tags || !deadLine || !location){
        throw new ApiError(400,"All fields are required")
    }

    const job = await Job.create({
        title,description,salary,tags,deadLine,location,employer:req.user._id
    })

    return res.status(200).json(
        new ApiResponse(200,"Job created successfully",job)
    )
    
})

const updateJob = asyncHandler(async(req,res)=>{
   if(req.user.isBlocked === true){
        throw new ApiError(400,"You can not upload job. you are bloacked by admin")
    }

    
    const {title, description,salary,tags,deadline,location} = req.body 
    const {jobId} = req.params


    if(!title || !description || !salary || !tags || !deadline || !location){
        throw new ApiError(400,"All fields are required")
    }
   if(!jobId || !isValidObjectId(jobId)){
        throw new ApiError(400,"Job id is missing")
    }

    const job = await Job.findById(jobId)

    if(req.user._id !== job.employer ){
        throw new ApiError(400,"You can not update this job")
    }
   

    const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
            $set:{
                title, description,salary,tags,deadline,location
            }
        },{
            new:true
        }
    )


    if(!updatedJob){
        throw new ApiError(400,"job does not updated, maybe deleted")
    }

    return res.status(200).json(
        new ApiResponse(200,"The job is updated " , updatedJob)
    )

})

const deleteJob = asyncHandler(async(req,res)=>{
    if(req.user.isBlocked === true){
        throw new ApiError(400,"You can not delete job. you are bloacked by admin")
    }
    const {jobId} = req.params
    
    if(!jobId || !isValidObjectId(jobId)){
        throw new ApiError(400,"Job id is missing")
    }

    const job = await Job.findById(jobId)

    if(req.user._id !== job?.employer){
        throw new ApiError(400,"You can not delete this job")
    }
    
    await Job.findByIdAndDelete(jobId)

    res.status(200).json(
        new ApiResponse(200,"Job deleted successful")
    )
})

const getJobById  = asyncHandler(async(req,res)=>{
    const {jobId} = req.params
    
    if(!jobId || !isValidObjectId(jobId)){
            throw new ApiError(400,"Job id is missing")
    }
    
    

    const job =  await Job.aggregate([
    {
        $match: { _id: new mongoose.Types.ObjectId(jobId) }
    },
    {
        $lookup: {
        from: "applications",
        localField: "applications",
        foreignField: "_id",
        as: "applications",
        pipeline:[
            {
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"candidate",
                    as:"candidate",
                    pipeline:[
                        {
                            $project:{
                                fullName:1,
                                email:1,
                            }
                        }
                    ]
                }
            }
        ]
        }
    },
    {
        $lookup:{
            from:"users",
            foreignField:"_id",
            localField:"employer",
            as:"employer",
            pipeline:[
                {
                    $project:{
                        fullName:1,
                        email:1
                    }
                }
            ]
        }
    },
    {
        $addFields:{
            employer:{
                $first: "$employer"
            },
        }
    }
    ])

    if(!job){
        throw new ApiError(400,"Job does not found")
    }

    return res.status(200).json(
        new ApiResponse(200,"Job fetched successful",job)
    )
})

const getJobApplications = asyncHandler(async(req,res)=>{

    if(req?.user?.isBlocked === true){
            throw new ApiError(400,"You can not get job. you are bloacked by admin")
        }

    const {jobId} = req.params 
    if(!jobId || !isValidObjectId(jobId)){
        throw new ApiError(400 , "jobid is missing")
    }
    


    const job = await Job.findById(jobId)

    if(req.user._id !== job.employer ){
        throw new ApiError(400,"You can not get this job's applications")
    }

    const jobApplications = await Job.aggregate([
    {
        $match: { _id: new mongoose.Types.ObjectId(jobId) }
    },
    {
        $lookup: {
        from: "applications",
        localField: "applications",
        foreignField: "_id",
        as: "applications",
        pipeline:[
            {
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"candidate",
                    as:"candidate",
                    pipeline:[
                        {
                            $project:{
                                fullName:1,
                                email:1,
                            }
                        }
                    ]
                }
            }
        ]
        }
    }
    ])

   if(!jobApplications){
        throw new ApiError(400,"Job application does not found")
   }

   return res.status(200).json(
    new ApiResponse(200 , "job applications fetched successful" , jobApplications[0].applications)
   )

})


export {
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobApplications
}