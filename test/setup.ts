import { config } from 'dotenv';
// Load environment variables for testing
config({ path: '.env.test' });

import request from 'supertest';
import { app } from '../src/index';
import { userService, accountService } from '../src/services/serviceContainer';

export async function createVerifiedUser(email: string, password: string) {
  await request(app)
    .post('/auth/signup')
    .send({ email, password, first_name: 'Test', last_name: 'User', birthday: '01.01.1990' });

  await request(app)
    .post('/auth/verify/send')
    .send({ email });

  await request(app)
    .post('/auth/verify/verify')
    .send({ email, code: '123456' });
}

/// <reference types="jest" />
jest.mock('nodemailer', () => ({
  createTransport: () => ({ sendMail: jest.fn().mockResolvedValue(true) })
}));

afterEach(() => {
  jest.clearAllTimers();
});

export async function createTestAccount(userId?: string) {
  // 1. Create or mock user
  const user = await userService.createUser({
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  password: 'StrongP@ssw0rd!',
  birthday: new Date('1990-01-01'),
  phone: '1234567890', 
  is_verified: true,
  created_at: new Date(),   
  last_update: new Date(),
});

  // 2. Create or mock account
  const account = await accountService.createAccount({
    user_id: user.id,
    balance: 1000,
  });

  // 3. Add some transactions if needed
  await accountService.addTransaction(account.id, {
    type: 'deposit',
    amount: 500,
    description: 'Initial deposit',
  });
  await accountService.addTransaction(account.id, {
    type: 'withdrawal',
    amount: 200,
    description: 'Test withdrawal',
  });

  return { user, account };
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 