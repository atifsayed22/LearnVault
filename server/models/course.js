import mongoose from 'mongoose'
const courseSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    category:{type:String},
    thumbnail:{type:String},
    instructor:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    published:{type:Boolean, default:false},
    students: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }
],

    sections: [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ]
}, { timestamps: true })


export default mongoose.model('Course', courseSchema)