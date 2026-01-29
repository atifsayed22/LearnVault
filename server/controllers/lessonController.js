import Lesson from "../models/lesson.js";
import Section from "../models/section.js";
import Course from "../models/course.js";
import { s3 } from "../utils/S3Client.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

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

        if(course.instructor.toString() !== req.user.id.toString())
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
        if(course.instructor.toString() !== req.user.id.toString())
            return res.status(403).json({message:"Forbidden"})

        Object.assign(lesson, update);
        await lesson.save();
        return res.status(200).json({message:"Lesson updated successfully", lesson})    

    }catch(err){

        return res.status(500).json({message:"Server error"})
    }
}

export const deleteLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const course = await Course.findById(lesson.course);
    if (!course || course.instructor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 1️⃣ DELETE VIDEO FROM S3 IF EXISTS
    if (lesson.video && lesson.video.key) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: lesson.video.key,
          })
        );
        console.log("Deleted S3 video:", lesson.video.key);
      } catch (s3Err) {
        console.log("Failed to delete S3 video:", s3Err);
      }
    }

    // 2️⃣ DELETE LESSON FROM DB
    await Lesson.findByIdAndDelete(lessonId);

    // 3️⃣ REMOVE LESSON FROM SECTION ARRAY
    const section = await Section.findById(lesson.section);
    if (section) {
      section.lessons = section.lessons.filter(
        (id) => id.toString() !== lessonId
      );
      await section.save();
    }

    return res.status(200).json({ message: "Lesson deleted successfully" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
