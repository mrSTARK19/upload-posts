import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import imagekit from "./service.js";
import connetDB from "./config/db.js";
import {register,imageData} from "./model/model.js"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import cors from "cors"

import authMID from "./middlewares/authMiddleware.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }) 

const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
connetDB();




app.get("/verify", (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.json({ status: "unauthorized" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ status: "success", user: decoded })
  } catch (err) {
    res.json({ status: "invalid" })
  }
})

app.post("/send", upload.single('img'), authMID ,async (req, res) => {
    try {
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname
        });
            let uurl = result.url
            let uuid = req.user.id
            let uuname = req.user.name
            //console.log(uurl,uuid,uuname)
        let data = await imageData({url:uurl,user:uuid,username:uuname})
        await data.save()

        res.json({
            message: "Upload successful",
            data : data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/signin", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        const existingUser = await register.findOne({ username })
        if (existingUser) {
                return res.json({
                    status: "failure",
                    message: "user already exists!"
                })
                }

        const result = await register({ username, password })
        await result.save()
        res.json({ status: "success", message: "user registered successfully!" })
    } catch (err) {
        res.json({ status: "failure", message: "user already exists!" })
    }

})

app.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body;
        let result = await register.findOne({ username })
        if (!result) {
            return res.json({ message: "user not found" })
        }
        if (result.password != password) {
            return res.json({ message: "password is incorrect!" })
        }
        let token = jwt.sign({ id: result._id , name:result.username}, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000
        });
        return res.status(200).json({
            message: "Login successful"
        });


    } catch (error) {
        return res.send(error)
    }

})

app.get("/images",authMID,async (req,res)=>{

    try{
            let data = await imageData.find()
            if (data.length === 0){
                return res.json({message:"uploaded images here"})
                           }
            res.json(data)
    }catch(error){res.status(404).json({message:"error occured!"})}
})

app.get("/my-images",authMID,async (req,res)=>{
    try {
        let id = req.user.id
        let result = await imageData.find({user:id}).select("_id url")
        if (result.length === 0){
                return res.json({message:"uploaded images here"})
                           }
        res.json(result)
    } catch (error) {
        res.send("error occured")
    }
})

app.delete("/delete-image/:id", authMID, async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.user.id;

    // Find the image belonging to the logged-in user
    const image = await imageData.findOne({
      _id: imageId,
      user: userId,
    });

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    // Delete the image document from MongoDB
    await imageData.findByIdAndDelete(imageId);

    return res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(3000, () => {
    console.log("app is running")
}) 