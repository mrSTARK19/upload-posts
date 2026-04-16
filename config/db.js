import mongoose from "mongoose";


const connetDB = async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/uploadPOST");
        console.log("db connected")
    }catch(err){
        console.log(err)
    }

    

}

export default connetDB;