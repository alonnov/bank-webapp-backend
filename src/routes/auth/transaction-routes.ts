import express from 'express';
import { createTransaction, getTransaction, getTransactionHistory } from '../../controllers/account/transaction-controllers';
import { validateTransaction } from '../../middleware/validators/transactionValidator';

const router = express.Router();

// Create new transaction
router.post('/', validateTransaction, createTransaction);

// Get transaction history with pagination
router.get('/history', getTransactionHistory);

// Get transaction by ID
router.get('/:id', getTransaction);

export default router;