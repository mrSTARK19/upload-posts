import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    username : {type:String,unique:true},
    password : {type:String}
})

const register = mongoose.model("register",authSchema)

export default register;
