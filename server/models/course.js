import mongoose from 'mongoose'
const courseSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    thumbnail:{type:String},
    instructor:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    published:{type:Boolean, default:false},
    sections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ]
}, { timestamps: true })


export default mongoose.model('Course', courseSchema)