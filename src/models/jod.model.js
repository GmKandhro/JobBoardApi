import mongoose, { Schema }  from "mongoose";



const jobSchema  = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    salary:{
        type:String
    },
    tags:{
        type:Array
    },
    deadLine:{
        type:Date
    },
    applications:[
        {
            type: Schema.Types.ObjectId,
            ref:"Application"
        }
    ],
    employer:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Job = mongoose.model("Job",jobSchema)