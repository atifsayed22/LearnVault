import { Router } from "express";
import { createLesson ,updateLesson ,deleteLesson } from "../controllers/lessonController.js";
import { auth } from "../middlewares/auth.js";



const router = Router();

router.use(auth);

router.post('/:sectionId',createLesson)
router.put('/:lessonId',updateLesson)
router.delete('/:lessonId',deleteLesson)

export default router