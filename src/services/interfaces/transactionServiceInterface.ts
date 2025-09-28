import { Transaction } from '../../types/types';

/**
 * Interface defining the contract for transaction data operations
 */
export interface ITransactionService {
  createTransaction(senderId: string, recipientId: string, sum: number, message?: string): Promise<Transaction>;
  findByAccountId(id: string): Promise<Transaction | null>;
  getTransactionsForUser(userId: string, limit?: number): Promise<Transaction[]>;
  getTransactionStats(userId: string): Promise<{ totalSent: number; totalReceived: number; totalTransactions: number }>;
  getAllTransactions(): Promise<Transaction[]>;
} 