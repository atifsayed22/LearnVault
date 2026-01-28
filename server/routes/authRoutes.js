import { Router } from 'express';
import {login, register, registerInstructor, getCurrentUser} from '../controllers/authContorller.js'
import { auth } from '../middlewares/auth.js';
const router = Router();

router.post('/login', login)
router.post('/register', register)
router.post('/register-instructor', registerInstructor)  // New route for instructor registration with documents
router.get('/me', auth, getCurrentUser)  // Get current authenticated user data
export default router
