import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SignOptions } from "jsonwebtoken";

export interface AppConfig {
  name: string;
  version: string;
  port: number;
  environment: string;
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

export interface Config {
  app: AppConfig;
  database: DbConfig;
  jwt: JwtConfig;
  security: SecurityConfig;
  email: EmailConfig;
  banking: BankingConfig;
}


function loadConfig(): Config {
  const environment = process.env.NODE_ENV || 'development';
  const configPath = join(__dirname, '../../config', `${environment}.yaml`);
  
  try {
    const configFile = readFileSync(configPath, 'utf8');
    const config = parse(configFile) as Config;

    config.database = {
      host: process.env.MONGO_HOST || config.database.host || 'localhost',
      port: Number(process.env.MONGO_PORT) || config.database.port || 27017,
      name: process.env.MONGO_DB || config.database.name || 'banking_db',
      user: process.env.MONGO_USER || config.database.user || '', // empty if no auth
      password: process.env.MONGO_PASS || config.database.password || '',
      dialect: config.database.dialect || 'mongo',
      pool: {
        max: Number(process.env.MONGO_POOL_MAX) || config.database.pool.max || 10,
        min: Number(process.env.MONGO_POOL_MIN) || config.database.pool.min || 0,
        acquire: Number(process.env.MONGO_POOL_ACQUIRE) || config.database.pool.acquire || 30000,
        idle: Number(process.env.MONGO_POOL_IDLE) || config.database.pool.idle || 10000,
      },
    };

    config.email = {
      service: config.email?.service || 'gmail',
      host: config.email?.host || 'smtp.gmail.com',
      port: Number(config.email?.port) || 587,
      secure: config.email?.secure || false,
      auth: {
        user: process.env.USER_EMAIL || config.email?.auth?.user || '',
        pass: process.env.EMAIL_PASSKEY || config.email?.auth?.pass || '',
      },
      appName: process.env.APP_NAME || config.email?.appName || 'Bank App',
      fromAddress: process.env.EMAIL_FROM_ADDRESS || config.email?.appName || 'Bank App',
      verificationCodeExpireMs: config.email?.verificationCodeExpireMs || 10 * 60 * 1000,
      verificationCodeLength: config.email?.verificationCodeLength || 6,
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


