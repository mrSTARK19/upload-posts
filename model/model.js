import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    username : {type:String,unique:true},
    password : {type:String}
})

const imageSchema = mongoose.Schema({
    url : {type:String},
    user: {type: mongoose.Schema.Types.ObjectId,ref:register}
})

const register = mongoose.model("register",authSchema)
const imageData = mongoose.model("imageData",imageSchema)

export default {register , imageData};
