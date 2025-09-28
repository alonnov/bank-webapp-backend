import { MongoClient, Db, Collection } from 'mongodb';
import { Transaction } from '../../types/types';
import crypto from 'crypto';

export class TransactionMongoService {
  private db: Db;
  private collection: Collection<Transaction>;

  constructor(mongoClient: MongoClient) {
    this.db = mongoClient.db('banking_app');
    this.collection = this.db.collection<Transaction>('transactions');
  }

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
    
    const result = await this.collection.insertOne(newTransaction);
    return newTransaction;
  }

  /**
   * Find transaction by ID
   */
  async findByAccountId(id: string): Promise<Transaction | null> {
    return await this.collection.findOne({ id });
  }

  /**
   * Get transactions for a user (as sender or recipient)
   */
  async getTransactionsForUser(userId: string, limit: number = 10): Promise<Transaction[]> {
    return await this.collection
      .find({
        $or: [
          { sender: userId },
          { recipient: userId }
        ]
      })
      .sort({ date: -1 })
      .limit(limit)
      .toArray();
  }


  /**
   * Get transaction statistics for a user
   */
  async getTransactionStats(userId: string): Promise<{
    totalSent: number;
    totalReceived: number;
    totalTransactions: number;
  }> {
    const pipeline = [
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalSent: {
            $sum: {
              $cond: [
                { $eq: ['$sender', userId] },
                '$sum',
                0
              ]
            }
          },
          totalReceived: {
            $sum: {
              $cond: [
                { $eq: ['$recipient', userId] },
                '$sum',
                0
              ]
            }
          },
          totalTransactions: { $sum: 1 }
        }
      }
    ];

    const result = await this.collection.aggregate(pipeline).toArray();
    const stats = result[0] || { totalSent: 0, totalReceived: 0, totalTransactions: 0 };

    return {
      totalSent: stats.totalSent,
      totalReceived: stats.totalReceived,
      totalTransactions: stats.totalTransactions,
    };
  }

  /**
   * Get all transactions (for development/testing)
   */
  async getAllTransactions(): Promise<Transaction[]> {
    return await this.collection.find({}).toArray();
  }
} 