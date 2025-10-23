import { MongoClient, Db, Collection } from 'mongodb';
import { Account } from '../../types/types';
import { generateAccountId } from '../../utils/IdHash';
import { bankingConfig } from '../../config/config';


export class AccountMongoService {
  private db: Db;
  private collection: Collection<Account>;

  constructor(mongoClient: MongoClient) {
    this.db = mongoClient.db('banking_app');
    this.collection = this.db.collection<Account>('accounts');
  }

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
    
    const result = await this.collection.insertOne(newAccount);
    return newAccount;
  }

  /**
   * Find account by user ID
   */
  async findByUserId(userId: string): Promise<Account | null> {
    const accountId = generateAccountId(userId);
    return await this.collection.findOne({ id: accountId });
  }

  /**
   * Find account by account ID
   */
  async findByAccountId(accountId: string): Promise<Account | null> {
    return await this.collection.findOne({ id: accountId });
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
    await this.collection.updateOne(
      { id: accountId },
      { 
        $set: { 
          balance: newBalance, 
          last_update: new Date() 
        } 
      }
    );
    
    return await this.findByUserId(userId);
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
    await this.collection.updateOne(
      { id: accountId },
      { 
        $set: { 
          status, 
          last_update: new Date() 
        } 
      }
    );
    
    return await this.findByUserId(userId);
  }

  /**
   * Get all accounts (for development/testing)
   */
  async getAllAccounts(): Promise<Account[]> {
    return await this.collection.find({}).toArray();
  }
} 