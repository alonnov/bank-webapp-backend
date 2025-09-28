import express from 'express';
import { userLogin } from '../../controllers/api/login-controllers';
import { validateLogin } from '../../middleware/validators/loginValidator';

const router = express.Router();

// Login
router.post('/', validateLogin, userLogin);

export default router;
