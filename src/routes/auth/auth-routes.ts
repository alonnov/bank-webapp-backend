import express from 'express';
import { getAccount } from '../../controllers/account/account-controllers';
import { authenticateToken } from '../../middleware/auth/authMiddleware';
import infoRoutes from './info-routes';
import securityRoutes from './security-routes';
import transactionRoutes from './transaction-routes';
import logoutRoutes from './logout-routes';
import { tokenErrorHandler } from '../../middleware/tokenErrorHandler';

const router = express.Router();

// Require authentication for all account routes
router.use(authenticateToken);

// Centralized error handling for tokens
router.use(tokenErrorHandler);

// Get account page data (user info, balance, recent transactions)
router.get('/', getAccount);

router.use('/info', infoRoutes);
router.use('/transactions', transactionRoutes);
router.use('/security', securityRoutes);
router.use('/logout', logoutRoutes);

export default router;
