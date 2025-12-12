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

const router = Router();
router.use(auth);
router.post("/create-course", createCourse);
router.patch("/publish-course/:courseId", publishCourse, isInstructor);
router.put("/update-course/:courseId", updateCourse, isInstructor);
router.delete("/delete-course/:courseId", deleteCourse, isInstructor);
router.get(
  "/instructor/my-courses",
  getInstructorCourses
);
router.get('/edit-data/:courseId', getEditCourseData, isInstructor);
router.get("/", getAllCourses);
router.get("/:courseId", getCourseById);
router.get("/:courseId/curriculum", getCurriculum);
export default router;
