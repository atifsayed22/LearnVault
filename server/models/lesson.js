import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title:{type:String, required:true},
    type:{type:String, enum:["video","text"], default:"video"},
    videoUrl:{type:String},
    content:{type:String},
    duration:{type:Number},
    course:{type:mongoose.Schema.Types.ObjectId,ref:"Course"},
    section:{type:mongoose.Schema.Types.ObjectId,ref:"Section"}
},{timestamps:true})
export default mongoose.model("Lesson", lessonSchema)