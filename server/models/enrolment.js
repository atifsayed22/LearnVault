import mongoose from "mongoose";

const enrolmentSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User" , required:true},
    course:{type:mongoose.Schema.Types.ObjectId,ref:"Course", required:true},
    status :{type:String, enum:["free","paid"], default:"free"},
    amountPaid:{type:Number},
    paymentId:{type:String},
    orderId:{type:String},
    platformFees:{type:Number},
    instructorEarnings:{type:Number},
    enrolledAt:{type:Date, default:Date.now}
},{timestamps:true
})

export default mongoose.model("Enrolment", enrolmentSchema)