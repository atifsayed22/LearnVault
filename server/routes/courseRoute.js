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
router.use(auth, isInstructor);
router.post("/create-course", createCourse);
router.patch("/publish-course/:courseId", publishCourse);
router.put("/update-course/:courseId", updateCourse);
router.delete("/delete-course/:courseId", deleteCourse);
router.get(
  "/instructor/my-courses",
  getInstructorCourses
);
router.get('/edit-data/:courseId', getEditCourseData);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/:courseId/curriculum", getCurriculum);
export default router;
