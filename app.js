import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import imagekit from "./service.js";
import connetDB from "./config/db.js";
import register from "./model/model.js"
import jwt from "jsonwebtoken"



const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

const app = express()
app.use(express.json())
connetDB();

app.post("/send", upload.single('img'), async (req, res) => {
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

app.post("/signin", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
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
          return  res.json({message:"user not found"})
        }
        if (result.password != password){
          return  res.json({message:"password is incorrect!"})
        }
        let token = jwt.sign({id :result._id },process.env.JWT_SECRET,{ expiresIn: "1h" })
            res.cookie("token", token, {
            httpOnly: true,
            secure: false,       
            maxAge: 60 * 60 * 1000
        });
        return res.status(200).json({
            message: "Login successful",token
        });


    } catch (error) {
       return res.send(error)
    }

})

app.listen(3000, () => {
    console.log("app is running")
}) 