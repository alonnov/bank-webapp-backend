import { Account } from '../../types/types';

/**
 * Interface defining the contract for account data operations
 */
export interface IAccountService {
  createAccount(userId: string): Promise<Account>;
  findByUserId(userId: string): Promise<Account | null>;
  findByAccountId(accountId: string): Promise<Account | null>;
  accountExists(userId: string): Promise<boolean>;
  updateBalance(userId: string, newBalance: number): Promise<Account | null>;
  addToBalance(userId: string, amount: number): Promise<Account | null>;
  subtractFromBalance(userId: string, amount: number): Promise<Account | null>;
  updateStatus(userId: string, status: string): Promise<Account | null>;
  getAllAccounts(): Promise<Account[]>;
} 