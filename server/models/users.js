import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String,
        enum:['student','instructor','admin'],
        default:'student',
        required:true
    },
    // Instructor verification fields
    isVerified: {
        type: Boolean,
        default: false  // Admin must approve
    },
    documents: {
        type: String  // Cloudinary URL of the PDF they submitted
    },
    appliedAsInstructor: {
        type: Boolean,
        default: false  // Track if they applied as instructor
    },
    applicationDate: {
        type: Date  // When they applied
    },
    documentStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'  // Admin review status
    },
    rejectionReason: {
        type: String  // Why admin rejected (if rejected)
    }
}, { timestamps: true })

export default mongoose.model('User', userSchema);