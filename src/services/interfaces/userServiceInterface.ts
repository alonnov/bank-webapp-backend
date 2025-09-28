import { User } from '../../types/types';

/**
 * Interface defining the contract for user data operations
 */
export interface IUserService {
  createUser(userData: Omit<User, 'id'>): Promise<User>;
  findByAccountId(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  userExists(email: string): Promise<boolean>;
  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
} 