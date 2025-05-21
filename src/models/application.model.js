import mongoose, { Schema } from "mongoose";

const applicationShema = new Schema(
    {
        job:{
            type:Schema.Types.ObjectId,
            ref:"Job"
        },
        candidate:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        resume:{
            type:String,
            required:true
        },
        massage:{
            type:String
        }
    },
    {timestamps:true}
)



export const Application = mongoose.model("Application",applicationShema)