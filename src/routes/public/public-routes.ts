import express from 'express';
import loginRoutes from './login-routes';
import signupRoutes from './signup-routes';
import emailVerificationRoutes from './email-verification-routes';

const router = express.Router();

router.use('/login', loginRoutes);
router.use('/signup', signupRoutes);
router.use('/verify', emailVerificationRoutes);

export default router;