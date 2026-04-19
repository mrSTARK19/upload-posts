import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    username : {type:String,unique:true},
    password : {type:String}
})
export const register = mongoose.model("register",authSchema)

const imageSchema = mongoose.Schema({
    url : {type:String},
    user: {type: mongoose.Schema.Types.ObjectId,ref:register},
    username : {type:String}
})
export const imageData = mongoose.model("imageData",imageSchema)


