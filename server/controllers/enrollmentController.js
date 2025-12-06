import Course from "../models/course.js";
import Enrolment from "../models/enrolment.js";

export const enrollCourse = async(req,res)=>{
    try{
        const User = req.user.id;
        const {courseId} = req.params;

        // check if course exists

        const   course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message:"Course not found"});
        }

        // check if already enrolled or not 

        const existing = await Enrolment.findOne({
            user:User,
            course:courseId
        })

        if(existing) return res.status(400).json({message:"Already enrolled in this course"})
        
        const enrolment = new Enrolment({
            user:User,
            course:courseId,
            status: course.price > 0 ? "paid":"free"
        })

        await enrolment.save();

        // add student to course's student list
        course.students.push(User);

        await course.save()

        return res.status(201).json({message:"Enrolled successfully", enrolment})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }       

}

export const getMyCourses = async (req,res)=>{
    try{
        const userId = req.user.id;
        const enrollments = await Enrolment.find({user:userId}).populate(   { path: "course",
                select: "title description thumbnail instructor"});

        const courses = enrollments.map(enrollment => enrollment.course);
        return res.json({courses});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }
}