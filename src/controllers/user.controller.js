import { cookieOptions } from "../constant.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


// generate Access and refresh tokens 
const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken =await user.generateAccessToken()
        const refreshToken =await user.generateRefreshToken()

         user.refreshToken = refreshToken
         await user.save({validateBeforeSave:false})

         return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"SomeThing Want Wrong while generating Tokens")
    }
}

// register user 
const registerUser = asyncHandler(async(req,res)=>{


    const {fullName, email,role,password} = req.body

    // console.log(req.body)
    if(!fullName || !email || !role || !password){
        throw new ApiError(400,"All fields are required")
    }

    const userExist = await User.findOne({email})

    if(userExist){
        throw new ApiError(400,"User with email already Exist")
    }

    const user = await User.create({
        fullName,email,role,password
    })

    if(!user){
        throw new ApiError(400, "user does not created")
    }
    
    const registeredUser = await User.findById(user._id).select("-password -refreshToken")
    return res.status(200).json(
        new ApiResponse(200,"User register successfull",registeredUser)
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password,confPassword} = req.body

    if(!email || !password || !confPassword){
        throw new ApiError(400, "All fields are required")
    }

    if(password !== confPassword){
        throw new ApiError(400,"Password and confirmPassword Should be same")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(400,"User does not Found")
    }
 
    const checkPassword =await user.isPasswordCorrect(password)

    if(!checkPassword){
        throw new ApiError(401,"unVailed Credentials")
    }

    const {accessToken,refreshToken} =await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-refreshToken -password")

    return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken , cookieOptions)
    .json(
        new ApiResponse(200 , "User logged in successfully" , loggedInUser)
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:""
            }
        },
        {
            new:true
        }
    )

    

    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200,"user logged out successfull")
    )
})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const upCommingRefreshToken = req?.cookies?.refreshToken || req?.body?.refreshToken

    if(!upCommingRefreshToken){
        throw new ApiError(400,"unauthrize Token")
    }

    const decodedToken = jwt.verify(upCommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id)

    if(!user){
        throw new ApiError(401,"Invalid Access token")
    }

    if(user.refreshToken !== upCommingRefreshToken){
        throw new ApiError(400, "Your refreshToken is expired or used")
    }

    const {accessToken , newrefreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    res.status(200)
    .cookie("accessToken",accessToken, cookieOptions)
    .cookie("refreshToken",newrefreshToken, cookieOptions)
    .json(
        new ApiResponse(200, "accessToken refreshed successfull",{accessToken})
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}