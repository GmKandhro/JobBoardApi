import mongoose, { Schema }  from "mongoose";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
         type:String,
        required:true,
        uniqe:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","employer","candidate"],
        required:true
    },
    refreshToken : {
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


userSchema.pre("save" ,async function (next) {
    if(!this.isModified("password")) return next()
    this.password =  await bcrypt.hash(this.password , 10)
    return next()
});


userSchema.methods.isPasswordCorrect = async function (password) {
    console.log(password);
    
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id:this._id,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id:this._id,
            role:this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}





export const User = mongoose.model("User",userSchema)