import Lesson from "../models/Lesson.js";
import Section from "../models/section.js";
import Course from "../models/course.js";

export const createLesson = async(req,res)=>{
    try{
        const {title,type, duration, content,order,videoUrl} = req.body;
        const sectionId = req.params.sectionId;
        if(!title){
            return res.status(400).json({message:"Title is required"})
        }
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({message:"Section not found"})
        }
        const course = await Course.findById(section.course)

        if(course.instructor.toString() !== req.user.id)
            return res.status(403).json({message:"Forbidden"})

        const newLesson = new Lesson({
            title,
            type,
            duration,
            content,
            order:typeof order === "number" ? order: section.lessons.length,
            videoUrl,
            section:section._id,
            course:course._id
        })
        await newLesson.save();
        section.lessons.push(newLesson._id);
        await section.save();
        return res.status(201).json({message:"Lesson created successfully", lesson:newLesson})

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }   
}

export const updateLesson = async (req,res)=>{
    const {lessonId} = req.params;
    const update = req.body
    try{
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            return res.status(404).json({message:"Lesson not found"})


        }
        const course = await Course.findById(lesson.course);
        if(course.instructor.toString() !== req.user.id)
            return res.status(403).json({message:"Forbidden"})

        Object.assign(lesson, update);
        await lesson.save();
        return res.status(200).json({message:"Lesson updated successfully", lesson})    

    }catch(err){

        return res.status(500).json({message:"Server error"})
    }
}