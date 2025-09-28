import { MongoClient, Db, Collection } from 'mongodb';
import { User } from '../../types/types';
import crypto from 'crypto';

export class UserMongoService {
  private db: Db;
  private collection: Collection<User>;

  constructor(mongoClient: MongoClient) {
    this.db = mongoClient.db('banking_app');
    this.collection = this.db.collection<User>('users');
  }

  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      created_at: new Date(),
      last_update: new Date(),
    };
    
    const result = await this.collection.insertOne(newUser);
    return newUser;
  }

  /**
   * Find user by ID
   */
  async findByAccountId(id: string): Promise<User | null> {
    return await this.collection.findOne({ id });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
  }

  /**
   * Check if user exists by email
   */
  async userExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Update user
   */
  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'password' |'created_at'>>): Promise<User | null> {
    await this.collection.updateOne(
      { id },
      { 
        $set: { 
          ...updates, 
          last_update: new Date() 
        } 
      }
    );
    
    return await this.findByAccountId(id);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  /**
   * Get all users (for development/testing)
   */
  async getAllUsers(): Promise<User[]> {
    return await this.collection.find({}).toArray();
  }
} 