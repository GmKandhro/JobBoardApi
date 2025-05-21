import dotenv from "dotenv"
import { connectDB } from "./db/index.js"
import {app} from "./app.js"
dotenv.config({
    path:"/.env"
})

const port = process.env.PORT || 3000

connectDB().then((res)=>{
    app.listen(port,()=>{
        console.log(`The Server is running on Port : ${port}`);
    })

}).catch((err)=>{
    throw err
    console.log("MongoDB connection fialed ", err);
})