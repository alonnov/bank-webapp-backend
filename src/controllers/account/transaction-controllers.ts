import { Request, Response } from 'express';
import { userService, accountService, transactionService } from '../../services/serviceContainer';
import { bankingConfig } from '../../config/config';
import { ApiResponse } from '../../types/responseTypes';

/**
 * Create a new transaction
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    // Validation is handled by middleware, data is available in req.validatedTransaction
    const { recipient, sum, message } = req.validatedTransaction!;
    const senderId = req.user!.id; // From auth middleware

    // Check if sender has sufficient balance
    const senderAccount = await accountService.findByUserId(senderId);
    if (!senderAccount) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'Sender account not found'
      }));
    }

    if (senderAccount.balance < sum) {
      return res.status(400).json(new ApiResponse({
        success: false,
        message: 'Insufficient funds'
      }));
    }

    // Check if recipient exists
    const recipientUser = await userService.findByEmail(recipient);
    if (!recipientUser) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'Recipient not found'
      }));
    }

    // Check if recipient has an account
    const recipientAccount = await accountService.findByUserId(recipientUser.id);
    if (!recipientAccount) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'Recipient account not found'
      }));
    }

    // Create transaction
    const transaction = await transactionService.createTransaction(
      senderId,
      recipientUser.id,
      sum,
      message
    );

    // Update account balances
    await accountService.subtractFromBalance(senderId, sum);
    await accountService.addToBalance(recipientUser.id, sum);

    return res.status(201).json(new ApiResponse({
      success: true,
      message: 'Transaction created successfully',
      data: transaction 
    }));

  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

/**
 * Get transaction by ID
 */
export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const transaction = await transactionService.findByAccountId(id);
    if (!transaction) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'Transaction not found'
      }));
    }

    // Check if user is involved in this transaction
    if (transaction.sender !== userId && transaction.recipient !== userId) {
      return res.status(403).json(new ApiResponse({
        success: false,
        message: 'Access denied'
      }));
    }

    return res.status(200).json(new ApiResponse({
      success: true,
      data: transaction
    }));

  } catch (error) {
    console.error('Error getting transaction:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

/**
 * Get transaction history with pagination
 */
export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    // Get user from JWT token (set by auth middleware)
    const user = req.user!;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || bankingConfig.transactionsPerPage;
    const offset = (page - 1) * limit;

    // Get all transactions for the user
    const allTransactions = await transactionService.getTransactionsForUser(user.id);
    
    // Sort by date (newest first)
    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Apply pagination
    const paginatedTransactions = sortedTransactions.slice(offset, offset + limit);
    
    const transactionsWithDirection = paginatedTransactions.map(transaction => ({
      ...transaction,
      isIncoming: transaction.recipient === user.id
    }));

    return res.status(200).json(new ApiResponse({
      success: true,
      data: {
        transactions: transactionsWithDirection,
        pagination: {
          page,
          limit,
          total: allTransactions.length,
          totalPages: Math.ceil(allTransactions.length / limit)
        }
      }
    }));

  } catch (error) {
    console.error('Transaction history error:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

