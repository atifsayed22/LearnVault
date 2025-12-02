import Course from '../models/course.js';
export const createCourse = async (req,res)=>{
   try{
    const{title, description , price , category ,thumbnail} = req.body;
    if(!title || !description || !price || !category){
        return res.status(400).json({message:"All fields are required"})
    }
    const newCourse = new Course({
        title, description,
        price,
        thumbnail,
        category,
        instructor: req.user.id
    })
    await newCourse.save();
    return res.status(201).json({message:"course created successfully",course:newCourse})
   }   
   catch(err){
    return res.status(500).json({message:"Server error"})
   }
}

export const publishCourse = async (req,res)=>{
    try{
        const course = await Course.findById(req.params.courseId);
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        if(course.instructor.toString()!==req.user.id ){
            return res.status(403).json({message:"Forbidden"})
        }

        course.published = true;
        await course.save();
        return res.status(200).json({message:"Course published successfully", course})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }
}
export const updateCourse = async (req,res)=>{
    try{
        const course = await Course.findById(req.params.courseId);
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        if(course.instructor.toString()!==req.user.id ){
            return res.status(403).json({message:"Forbidden"})
        }
        
        Object.assign(course, req.body);
        await course.save();
        return res.status(200).json({message:"Course updated successfully", course})


    }    catch(err){
        return res.status(500).json({message:"Server error"})
    }   
}
export const deleteCourse = async (req,res)=>{
    try{
        const course = await Course.findByIdAndDelete(req.params.courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        if(course.instructor.toString()!==req.user.id ){
            return res.status(403).json({message:"Forbidden"})
        } ;
      
        return res.status(200).json({message:"Course deleted successfully"})
    }    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }       
}

export const getAllCourses = async (req,res)=>{
    try{
        const courses = await Course.find({published:true}).populate('instructor','name email');
        if(courses.length ===0){
            return res.status(404).json({message:"No courses found"})
        }
        return res.status(200).json({courses})
    }    catch(err){
        return res.status(500).json({message:"Server error"})
    }   
}
export const getCourseById = async (req,res)=>{
    try{
        const course = await Course.findById(req.params.courseId).populate('instructor','name email');  
        if(!course || !course.published){
            return res.status(404).json({message:"Course not found"})
        }   
        return res.status(200).json({course})
    }    catch(err){
        return res.status(500).json({message:"Server error"})
    }
}

export const getCurriculum = async (req,res)=>{

    const courseId = req.params.courseId;
    try{
        const course = await Course.findByIdAndUpdate(courseId)
          .populate({
        path: "sections",
        model: "Section",
        options: { sort: { order: 1 } },
        populate: {
          path: "lessons",
          model: "Lesson",
          options: { sort: { order: 1 } },
        },
      })
      .select("title description sections published");
      console.log(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
         if (!course.published) {
      const userId = req.user?.id;
      const isOwner = course.instructor && course.instructor.toString() === userId;
      if (!isOwner && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Course not published" });
      }
    }

    return res.json({ course });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"})
    }

}
