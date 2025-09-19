import express from "express"
import dotenv from "dotenv"


dotenv.config({path : ["./.env"]})
const app=express()





app.listen(process.env.PORT,()=>{
    console.log(`Server is listening to the connections at http://localhost:${process.env.PORT} ✔✔`);
})