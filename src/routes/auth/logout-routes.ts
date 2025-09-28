import express from 'express';
import { userLogout } from '../../controllers/api/logout-controllers';

const router = express.Router();

// Logout (requires authentication)
router.post('/', userLogout);

export default router;
