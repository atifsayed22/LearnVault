import { Router } from "express";
import { createLesson ,updateLesson  } from "../controllers/lessonController.js";
import { auth } from "../middlewares/auth.js";



const router = Router();

router.use(auth);

router.post('/:sectionId',createLesson)
router.put('/:lessonId',updateLesson)

export default router