import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import imagekit from "./service.js";
import connetDB from "./config/db.js";
import register from "./model/model.js"


const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

const app = express()
connetDB();

app.post("/send",upload.single('img'),async (req,res)=>{
   try {
        const result = await imagekit.upload({
            file: req.file.buffer, 
            fileName: req.file.originalname
        });

        res.json({
            message: "Upload successful",
            url: result.url
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.listen(3000,()=>{
    console.log("app is running")
}) 