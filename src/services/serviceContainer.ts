import { dbConfig } from '../config/config';

// DB Interfaces
import { IUserService } from './interfaces/userServiceInterface';
import { IAccountService } from './interfaces/accountServiceInterface';
import { ITransactionService } from './interfaces/transactionServiceInterface';

// Local
import { UserLocalService } from './local/userLocalService';
import { AccountLocalService } from './local/accountLocalService';
import { TransactionLocalService } from './local/transactionLocalService';

// MongoDB
import { UserMongoService } from './mongoDB/userMongoService';
import { AccountMongoService } from './mongoDB/accountMongoService';
import { TransactionMongoService } from './mongoDB/transactionMongoService';
import { MongoClient } from 'mongodb';

let mongoClient: MongoClient | null = null;

const USER_DB = process.env.USER_DB || 'local';
const ACCOUNT_DB = process.env.ACCOUNT_DB || 'local';
const TRANSACTION_DB = process.env.TRANSACTION_DB || 'local';

function getMongoClient(): MongoClient {
  if (!mongoClient) {
    if ([USER_DB, ACCOUNT_DB, TRANSACTION_DB].includes('mongo')) {
      const connectionString =
        process.env.MONGO_URI || `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

      mongoClient = new MongoClient(connectionString, {
        maxPoolSize: dbConfig.pool.max,
        minPoolSize: dbConfig.pool.min,
        maxIdleTimeMS: dbConfig.pool.idle,
        serverSelectionTimeoutMS: dbConfig.pool.acquire,
      });
    } else {
      throw new Error('MongoDB client requested but no service configured for mongo');
    }
  }
  return mongoClient;
}

type UserServiceFactory = Record<string, () => IUserService>;
type AccountServiceFactory = Record<string, () => IAccountService>;
type TransactionServiceFactory = Record<string, () => ITransactionService>;

// Create singleton instances
const localUserService = new UserLocalService();
const localAccountService = new AccountLocalService();
const localTransactionService = new TransactionLocalService();

// Update factories
const userServiceFactories: UserServiceFactory = {
  local: () => localUserService,
  mongo: () => new UserMongoService(getMongoClient()),
};

const accountServiceFactories: AccountServiceFactory = {
  local: () => localAccountService,
  mongo: () => new AccountMongoService(getMongoClient()),
};

const transactionServiceFactories: TransactionServiceFactory = {
  local: () => localTransactionService,
  mongo: () => new TransactionMongoService(getMongoClient()),
};

export const userService = userServiceFactories[USER_DB]();
export const accountService = accountServiceFactories[ACCOUNT_DB]();
export const transactionService = transactionServiceFactories[TRANSACTION_DB]();