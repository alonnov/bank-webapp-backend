import express from 'express';
import { sendVerificationEmail, verifyEmail } from '../../controllers/auth/emailVerification-controllers';

const router = express.Router();

// Send verification email
router.post('/send', sendVerificationEmail);

// Verify email with code
router.post('/verify', verifyEmail);

export default router;