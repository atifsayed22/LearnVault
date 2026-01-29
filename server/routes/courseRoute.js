import { Router } from "express";

import {
  createCourse,
  publishCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCurriculum,
  getInstructorCourses,
  getEditCourseData,
} from "../controllers/courseController.js";
import { auth } from "../middlewares/auth.js";
import { isInstructor } from "../middlewares/isInstructor.js";
import { isVerifiedInstructor } from "../middlewares/isVerifiedInstructor.js";

const router = Router();
router.use(auth);

// Public routes (no verification needed)
router.get("/", getAllCourses);
router.get("/:courseId", getCourseById);
router.get("/:courseId/curriculum", getCurriculum);

// Protected routes - Instructor only AND must be verified
router.post("/create-course", isVerifiedInstructor, createCourse);
router.patch("/publish-course/:courseId", isVerifiedInstructor, publishCourse);
router.put("/update-course/:courseId", isVerifiedInstructor, updateCourse);
router.delete("/delete-course/:courseId", isVerifiedInstructor, deleteCourse);
router.get("/instructor/my-courses", isInstructor, getInstructorCourses);
router.get('/edit-data/:courseId', getEditCourseData);

export default router;
