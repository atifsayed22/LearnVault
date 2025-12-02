import Course from "../models/course.js";
import Section from "../models/section.js";

export const createSection = async(req,res)=>{
    try{
        const {title,order} = req.body;
        const courseId= req.params.courseId;
        console.log(courseId);
        if(!title){
            return res.status(400).json({message:"Title is required"})
        }       
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }   
        console.log("hello ")
        console.log(course.instructor.toString());
        if(course.instructor.toString() !== req.user.id){
            return res.status(403).json({message:"Forbidden"})
        }
        const newSectin = new Section({
            title,
             order: typeof order === "number" ? order : course.sections.length,
             course: course._id
        })
        await newSectin.save();
        course.sections.push(newSectin._id);
        await course.save();
        return res.status(201).json({message:"Section created successfully", section:newSectin})
    }   
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }
}

export const deleteSection = async(req,res)=>{
    try{
        const sectionId = req.params.sectionId;
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({message:"Section not found"})
        }
        const course = await Course.findById(section.course);
        if(course.instructor.toString() !== req.user.id){
            return res.status(403).json({message:"Forbidden"})
        }
        await Section.findByIdAndDelete(sectionId);
        course.sections = course.sections.filter(secId => secId.toString() !== sectionId);
        await course.save();
        return res.status(200).json({message:"Section deleted successfully"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }
}