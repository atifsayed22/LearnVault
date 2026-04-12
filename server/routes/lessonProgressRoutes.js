import express from "express";
import {
	updateLessonProgress,
	getCourseProgress,
	getCourseCertificate,
} from "../controllers/lessonProgressController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();
router.use(auth);
router.post("/update", updateLessonProgress);
router.get("/course/:courseId",  getCourseProgress);
router.get("/course/:courseId/certificate", getCourseCertificate);

export default router;
