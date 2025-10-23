import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SignOptions } from "jsonwebtoken";

export interface AppConfig {
  name: string;
  version: string;
  port: number;
  environment: string;
  frontendUrl: string;
}

export interface DbConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  dialect: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

export interface SecurityConfig {
  bcryptRounds: number;
  passwordMinLength: number;
  passwordMaxLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  rateLimit: {
    windowMs: number;
    max: number;
  };
  cors: {
    origin: string[];
    credentials: boolean;
  };
}

export interface JwtConfig {
  secret: string;
  expiresIn: SignOptions["expiresIn"];
  refreshExpiresIn: SignOptions["expiresIn"];
  issuer: string;
  audience: string;
}

export interface EmailConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  appName: string;
  fromAddress: string;
  verificationCodeExpireMs: number;
  verificationCodeLength: number;
}

export interface BankingConfig {
  defaultBalance: number;
  minTransactionAmount: number;
  maxTransactionAmount: number;
  accountNumberLength: number;
  transactionsPerPage: number;
}

export interface ServiceSelectionConfig {
  userDb: string;
  accountDb: string;
  transactionDb: string;
  mongoUri?: string;
}

export interface Config {
  app: AppConfig;
  database: DbConfig;
  jwt: JwtConfig;
  security: SecurityConfig;
  email: EmailConfig;
  banking: BankingConfig;
  services: ServiceSelectionConfig; // New field
}


function loadConfig(): Config {
  const environment = process.env.NODE_ENV || 'development';
  const configPath = join(__dirname, '../../config', `${environment}.yaml`);
  
  try {
    const configFile = readFileSync(configPath, 'utf8');
    const config = parse(configFile) as Config;
    
    // Override app config with environment variables
    config.app = {
      ...config.app,
      frontendUrl: process.env.FRONTEND_URL || config.app.frontendUrl || 'http://localhost:3000',
    };

    // Override with environment variables
    config.database = {
      ...config.database,
      host: process.env.MONGO_HOST || config.database.host,
      port: Number(process.env.MONGO_PORT) || config.database.port,
      name: process.env.MONGO_DB || config.database.name,
      user: process.env.MONGO_USER || config.database.user,
      password: process.env.MONGO_PASS || config.database.password,
      pool: {
        ...config.database.pool,
        max: Number(process.env.MONGO_POOL_MAX) || config.database.pool.max,
        min: Number(process.env.MONGO_POOL_MIN) || config.database.pool.min,
        acquire: Number(process.env.MONGO_POOL_ACQUIRE) || config.database.pool.acquire,
        idle: Number(process.env.MONGO_POOL_IDLE) || config.database.pool.idle,
      },
    };

    config.email = {
      ...config.email,
      service: process.env.EMAIL_SERVICE || config.email.service,
      host: process.env.EMAIL_HOST || config.email.host,
      port: Number(process.env.EMAIL_PORT) || config.email.port,
      secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : config.email.secure,
      auth: {
        ...config.email.auth,
        user: process.env.USER_EMAIL || config.email.auth.user,
        pass: process.env.EMAIL_PASSKEY || config.email.auth.pass,
      },
      appName: process.env.APP_NAME || config.email.appName,
      fromAddress: process.env.EMAIL_FROM_ADDRESS || config.email.fromAddress,
    };

    // Override banking config with environment variables
    config.banking = {
      ...config.banking,
      defaultBalance: Number(process.env.INITIAL_ACCOUNT_BALANCE) || config.banking.defaultBalance,
    };

    // Ensure config.services exists, even if not in YAML
    config.services = config.services || {};

    // New service selection overrides
    config.services = {
      userDb: process.env.USER_DB || config.services.userDb || 'local',
      accountDb: process.env.ACCOUNT_DB || config.services.accountDb || 'local',
      transactionDb: process.env.TRANSACTION_DB || config.services.transactionDb || 'local',
      mongoUri: process.env.MONGO_URI || config.services.mongoUri,
    };

    return config;
  } catch (error) {
    console.error(`Failed to load config from ${configPath}:`, error);
    throw new Error(`Configuration file not found: ${configPath}`);
  }
}

export const config = loadConfig();

export const appConfig = config.app;
export const dbConfig = config.database;
export const jwtConfig = config.jwt;
export const emailConfig = config.email;
export const securityConfig = config.security;
export const bankingConfig = config.banking;
export const servicesConfig = config.services; // New export
