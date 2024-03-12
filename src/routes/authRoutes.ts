import express from 'express';
import { signUp, signIn, changePassword, verifyOtp, resetPassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';



const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/change-password', protect, changePassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);




export default router;
