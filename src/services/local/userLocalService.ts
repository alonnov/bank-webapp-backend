import { User } from '../../types/types';
import { IUserService } from '../interfaces/userServiceInterface';
import crypto from 'crypto';

export class UserLocalService implements IUserService {
  private users: User[] = [];

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
    
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Find user by ID
   */
  async findByAccountId(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    ) || null;
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
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      last_update: new Date(),
    };

    return this.users[userIndex];
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Get all users (for development/testing)
   */
  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }
} 