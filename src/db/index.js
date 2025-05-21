import mongoose  from "mongoose";
import { DB_NAME } from "../constant.js";

const MongoDBUrl = process.env.MONGODB_URI || "mongodb://localhost:27017"

const connectDB = async () =>{
    try {
        const conn =await mongoose.connect(`${MongoDBUrl}/${DB_NAME}`)
        console.log("Server is running on host ::",conn.connection.host)
    } catch (error) {
        console.log("Error while Connecting Db" , error)
        throw new error
        process.exit(1)
    }
}


export {connectDB}