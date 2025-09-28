import request from 'supertest';
import { app } from '../../../src/index';

jest.mock('../src/services/emailService', () => ({
  emailService: {
    sendVerificationEmail: jest.fn(async () => true),
    verifyCode: jest.fn((email: string, code: string) => code === '123456'),
    hasValidCode: jest.fn(() => true),
    storeVerificationCode: jest.fn(),
  }
}));

describe('Full Auth Flow', () => {
  const unique = Date.now();
  const email = `fullflowUser${unique}@example.com`;
  const password = 'StrongP@ssw0rd!';

  test('user can signup, verify, and login successfully', async () => {
    // --- Signup ---
    const signupRes = await request(app)
      .post('/auth/signup')
      .send({ email, password, first_name: 'Flow', last_name: 'User', birthday: '01.01.1990' });

    expect(signupRes.status).toBe(201);
    expect(signupRes.body.success).toBe(true);
    expect(signupRes.body.data.tokens.accessToken).toBeTruthy();
    expect(signupRes.body.data.tokens.refreshToken).toBeTruthy();

    // --- Send verification code ---
    await request(app).post('/auth/verify/send').send({ email }).expect(200);

    // --- Verify code ---
    await request(app).post('/auth/verify/verify').send({ email, code: '123456' }).expect(200);

    // --- Login ---
    const loginRes = await request(app).post('/auth/login').send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.tokens.accessToken).toBeTruthy();
    expect(loginRes.body.data.tokens.refreshToken).toBeTruthy();
  });

  test('cannot login before verification', async () => {
    const tempEmail = `unverified${unique}@example.com`;
    const tempPassword = 'StrongP@ssw0rd!';

    // Signup but do NOT verify
    await request(app).post('/auth/signup').send({ email: tempEmail, password: tempPassword, first_name: 'Temp', last_name: 'User', birthday: '01.01.1990' });

    // Attempt login
    const loginRes = await request(app).post('/auth/login').send({ email: tempEmail, password: tempPassword });

    expect(loginRes.status).toBe(401); // login blocked
    expect(loginRes.body.success).toBe(false);
  });

  test('verification fails with wrong code', async () => {
    const tempEmail = `wrongcode${unique}@example.com`;
    const tempPassword = 'StrongP@ssw0rd!';

    await request(app).post('/auth/signup').send({ email: tempEmail, password: tempPassword, first_name: 'Temp', last_name: 'User', birthday: '01.01.1990' });
    await request(app).post('/auth/verify/send').send({ email: tempEmail });

    const verifyRes = await request(app).post('/auth/verify/verify').send({ email: tempEmail, code: '000000' });
    expect(verifyRes.status).toBe(400);
    expect(verifyRes.body.success).toBe(false);
  });
});
