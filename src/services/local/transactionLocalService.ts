import { ITransactionService } from '../interfaces/transactionServiceInterface';
import { Transaction } from '../../types/types';
import crypto from 'crypto';

export class TransactionLocalService implements ITransactionService {
  private transactions: Transaction[] = [];

  /**
   * Create a new transaction
   */
  async createTransaction(
    senderId: string,
    recipientId: string,
    sum: number,
    message?: string
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      sender: senderId,
      recipient: recipientId,
      sum,
      date: new Date(),
      message,
    };
    
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  /**
   * Find transaction by ID
   */
  async findByAccountId(id: string): Promise<Transaction | null> {
    return this.transactions.find(transaction => transaction.id === id) || null;
  }

  /**
   * Get transactions for a user (as sender or recipient)
   */
  async getTransactionsForUser(userId: string, limit: number = 10): Promise<Transaction[]> {
    return this.transactions
      .filter(transaction => 
        transaction.sender === userId || transaction.recipient === userId
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  /**
   * Get transaction statistics for a user
   */
  async getTransactionStats(userId: string): Promise<{
    totalSent: number;
    totalReceived: number;
    totalTransactions: number;
  }> {
    const userTransactions = this.transactions.filter(transaction => 
      transaction.sender === userId || transaction.recipient === userId
    );

    const totalSent = userTransactions
      .filter(t => t.sender === userId)
      .reduce((sum, t) => sum + t.sum, 0);

    const totalReceived = userTransactions
      .filter(t => t.recipient === userId)
      .reduce((sum, t) => sum + t.sum, 0);

    return {
      totalSent,
      totalReceived,
      totalTransactions: userTransactions.length,
    };
  }

  /**
   * Get all transactions (for development/testing)
   */
  async getAllTransactions(): Promise<Transaction[]> {
    return [...this.transactions];
  }
} 