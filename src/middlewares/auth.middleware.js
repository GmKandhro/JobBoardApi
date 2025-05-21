import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
         const token = req?.cookies?.accessToken || req?.header("Authorization")?.replace("Bearer ","")

        //  console.log(req.cookies.accessToken)
    
        if(!token){
            throw new ApiError(409,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)

        if(!user){
            throw new ApiError(401,"Invalid Access token")
        }

        req.user = user 

        return next()
    
    } catch (error) {
        throw new ApiError(400, error.message || "Something want wrong")
    }
})