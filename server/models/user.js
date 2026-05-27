import mongoose from "mongoose";

const schema = new mongoose.schema({
name : {type: String, reqiured:true,trim:true},
email: {type: String, reqiured:true,trim:true,unique:true,lowercase:"true"},
password:{type: String, reqiured:true},
plan:{type:String,enum:["free","pro"],default:"free"},
analysiscount:{type:Number,default:0},
lastanalysisdate:{type:Date,default:"null"},

},{timestamp:"true"})

const User = mongoose.model("User",userSchema)

export default user;