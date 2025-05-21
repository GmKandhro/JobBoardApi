import { isValidObjectId } from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/jod.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAllUsersJobsApplications = asyncHandler(async(req,res)=>{
    const users =await User.find().select("-password -refreshToken")


    const jobs = await Job.aggregate([
        {
            $lookup: {
            from: "applications",
            localField: "applications",
            foreignField: "_id",
            as: "Application",
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




    const applications = await Application.aggregate([
        {
            $lookup:{
                from:"users",
                foreignField:"_id",
                localField:"candidate",
                as:"candidate",
                pipeline:[
                    {
                        $project:{
                            fullName:1 ,
                            email:1
                        }
                    }
                ]
            }
        }
    ])


    const usersCount =await User.find().countDocuments()
    const jobsCount = await Job.find().countDocuments()
    const applicationsCount = await Application.find().countDocuments()

    const dashboardData = {
        users,
       jobs :  jobs[0].Application,
        applications : applications[0],
        usersCount,
        jobsCount,
        applicationsCount
    }

    if(!dashboardData){
        throw new ApiError(400,"Dashboard data is missing")
    }

    return res.status(200).json(
        new ApiResponse(200,"dashboard Data is fetched successfully",dashboardData)
    )


})


const toggleBlockUser = asyncHandler(async(req ,res)=>{
    const {userId} = req.params 

    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "user id is missing")
    }

    const user = await User.findById(userId)

     const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                isBlocked : !user?.isBlocked
            }
        },{
            new:true
        }
    )

    return res.status(200).json(
        new ApiResponse(200,`${updatedUser.isBlocked ? "user blocked" : "user unblocked"}` , updatedUser.isBlocked)
    )
})

const deleteUser = asyncHandler(async(req ,res)=>{
    const {userId} = req.params 

    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "user id is missing")
    }

    await User.findByIdAndDelete(userId)

    return res.status(200).json(
        new ApiResponse(200,"user deleted successful")
    )
})

const deleteJob = asyncHandler(async(req,res)=>{
    const {jobId} = req.params 

    if(!jobId || !isValidObjectId(jobId)){
        throw new ApiError(400, "job id is missing")
    }

    await Job.findByIdAndDelete(jobId)

    return res.status(200).json(
        new ApiResponse(200,"job deleted successful")
    )
})

export {getAllUsersJobsApplications,deleteJob,deleteUser,toggleBlockUser}