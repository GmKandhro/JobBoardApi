import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"



export const employerRole = asyncHandler(async(req,_ , next)=>{
    const token = req?.cookies?.accessToken || req?.header("Authorization")?.replace("Bearer ","")
       
    if(!token){
        throw new ApiError(409,"Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id)

    if(user.role !== "employer"){
        throw new ApiError(400,"Only employer can perform oprations on jobs")
    }
    req.user = user
    return next()
})