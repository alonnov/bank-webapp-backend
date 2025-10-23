import { IAccountService } from '../interfaces/accountServiceInterface';
import { Account } from '../../types/types';
import { generateAccountId } from '../../utils/IdHash';
import { bankingConfig } from '../../config/config';

export class AccountLocalService implements IAccountService {
  private accounts: Account[] = [];

  /**
   * Create a new account
   */
  async createAccount(userId: string): Promise<Account> {
    const accountId = generateAccountId(userId);
    const newAccount: Account = {
      id: accountId,
      balance: bankingConfig.defaultBalance,
      created: new Date(),
      last_update: new Date(),
      status: 'active',
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  /**
   * Find account by user ID
   */
async findByUserId(userId: string): Promise<Account | null> {
  return this.findByAccountId(generateAccountId(userId));
}

  /**
   * Find account by account ID
   */
  async findByAccountId(accountId: string): Promise<Account | null> {
    return this.accounts.find(account => account.id === accountId) || null;
  }

  /**
   * Check if account exists
   */
  async accountExists(userId: string): Promise<boolean> {
    const account = await this.findByUserId(userId);
    return account !== null;
  }

  /**
   * Update account balance
   */
  async updateBalance(userId: string, newBalance: number): Promise<Account | null> {
    const accountId = generateAccountId(userId);
    const accountIndex = this.accounts.findIndex(account => account.id === accountId);
    
    if (accountIndex === -1) return null;

    this.accounts[accountIndex] = {
      ...this.accounts[accountIndex],
      balance: newBalance,
      last_update: new Date(),
    };

    return this.accounts[accountIndex];
  }

  /**
   * Add to account balance
   */
  async addToBalance(userId: string, amount: number): Promise<Account | null> {
    const account = await this.findByUserId(userId);
    if (!account) return null;

    return await this.updateBalance(userId, account.balance + amount);
  }

  /**
   * Subtract from account balance
   */
  async subtractFromBalance(userId: string, amount: number): Promise<Account | null> {
    const account = await this.findByUserId(userId);
    if (!account) return null;

    return await this.updateBalance(userId, account.balance - amount);
  }

  /**
   * Update account status
   */
  async updateStatus(userId: string, status: string): Promise<Account | null> {
    const accountId = generateAccountId(userId);
    const accountIndex = this.accounts.findIndex(account => account.id === accountId);
    
    if (accountIndex === -1) return null;

    this.accounts[accountIndex] = {
      ...this.accounts[accountIndex],
      status,
      last_update: new Date(),
    };

    return this.accounts[accountIndex];
  }

  /**
   * Get all accounts (for development/testing)
   */
  async getAllAccounts(): Promise<Account[]> {
    return [...this.accounts];
  }
} 