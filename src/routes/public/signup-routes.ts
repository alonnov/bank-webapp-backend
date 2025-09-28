import express from 'express';
import { userSignup } from '../../controllers/api/signup-controllers';
import { validateSignup } from '../../middleware/validators/signupValidator';

const router = express.Router();

// User signup
router.post('/', validateSignup, userSignup);

export default router;