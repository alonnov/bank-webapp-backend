import express from 'express';
import { changeEmail, changePassword, confirmEmailChange } from '../../controllers/account/security-controllers';
import { validateEmailChange, validatePasswordChange } from '../../middleware/validators/securityValidator';

const router = express.Router();

// Change email address
router.post('/change-email', validateEmailChange, changeEmail);

// Confirm email change with verification code
router.post('/confirm-email-change', confirmEmailChange);

// Change password
router.post('/change-password', validatePasswordChange, changePassword);

export default router; 