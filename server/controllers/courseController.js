import Course from "../models/course.js";
import Section from "../models/section.js";
import Lesson from "../models/lesson.js";
import Enrollment from "../models/enrolment.js";

import { s3 } from "../utils/S3Client.js";
import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, thumbnail } = req.body;
    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newCourse = new Course({
      title,
      description,
      price,
      thumbnail,
      category,
      instructor: req.user.id,
    });
    await newCourse.save();
    return res
      .status(201)
      .json({ message: "course created successfully", course: newCourse });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const publishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    course.published = true;
    await course.save();
    return res
      .status(200)
      .json({ message: "Course published successfully", course });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(course, req.body);
    await course.save();
    return res
      .status(200)
      .json({ message: "Course updated successfully", course });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId).populate("sections");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 1️⃣ Fetch all lessons belonging to this course
    const lessons = await Lesson.find({ course: courseId });

    // 2️⃣ Delete all S3 videos
    const filesToDelete = lessons
      .filter((l) => l.video?.key)
      .map((l) => ({ Key: l.video.key }));

    if (filesToDelete.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Delete: { Objects: filesToDelete },
        })
      );
    }

    // 3️⃣ Delete lessons from DB
    await Lesson.deleteMany({ course: courseId });

    // 4️⃣ Delete sections
    await Section.deleteMany({ course: courseId });

    // 5️⃣ Delete course itself
    await Course.findByIdAndDelete(courseId);

    // 6️⃣ Remove enrollments
    await Enrollment.deleteMany({ course: courseId });

    return res.json({ message: "Course and all related data deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error while deleting course" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true }).populate(
      "instructor",
      "name email"
    );
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    return res.status(200).json({ courses });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "instructor",
      "name email"
    );
    if (!course || !course.published) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({ course });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCurriculum = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId)
      .populate({
        path: "sections",
        options: { sort: { order: 1 } },
        populate: {
          path: "lessons",
          options: { sort: { order: 1 } },
        },
      })
      .select("title description sections published instructor");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const userId = req.user?.id;
    const isOwner = course.instructor.toString() === userId;
    const isAdmin = req.user?.role === "admin";

    // If course is unpublished, only owner or admin can view it
    if (!course.published && !isOwner && !isAdmin) {
      return res.status(403).json({ message: "Course not published" });
    }

    return res.status(200).json({ course });

  } catch (err) {
    console.log("Error in getCurriculum:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const page = parseInt(req.query.page) || 1;  // current page
    const limit = parseInt(req.query.limit) || 6; // items per page
    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments({ instructor: instructorId });

    const courses = await Course.find({ instructor: instructorId })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      courses,
      total: totalCourses,
      page,
      pages: Math.ceil(totalCourses / limit),
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

