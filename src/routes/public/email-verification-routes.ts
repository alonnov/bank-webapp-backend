import express from 'express';
import { 
  sendVerificationEmail, 
  verifyEmail, 
  checkVerificationStatus 
} from '../../controllers/auth/emailVerification-controllers';


const router = express.Router();

// Send verification email (for new signups)
router.post('/send', sendVerificationEmail);

// Verify email with code
router.post('/verify', verifyEmail);

// Check verification status (public)
router.get('/status', checkVerificationStatus);

export default router; 