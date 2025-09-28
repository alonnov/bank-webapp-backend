import express from 'express';
import { getInfo, editInfo } from '../../controllers/account/info-controllers';
import { validateUserInfoUpdate } from '../../middleware/validators/userInfoUpdateValidator';

const router = express.Router();

// Get user information
router.get('/', getInfo);

// Update user information
router.put('/', validateUserInfoUpdate, editInfo);

export default router;
