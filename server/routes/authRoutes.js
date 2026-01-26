import { Router } from 'express';
import {login, register, registerInstructor} from '../controllers/authContorller.js'
const router = Router();

router.post('/login', login)
router.post('/register', register)
router.post('/register-instructor', registerInstructor)  // New route for instructor registration with documents

export default router
