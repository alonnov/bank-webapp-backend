import request from 'supertest';
import { app } from '../../../src/index';

jest.mock('../../../src/services/emailService', () => ({
  emailService: {
    sendVerificationEmail: jest.fn(async () => true),
    verifyCode: jest.fn((email: string, code: string) => code === '123456'),
    hasValidCode: jest.fn(() => true),
    storeVerificationCode: jest.fn(),
  }
}));

describe('Signup', () => {
  const unique = Date.now();
  const email = `user${unique}@example.com`;
  const password = 'StrongP@ssw0rd!';

  test('successful signup returns tokens', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email, password, first_name: 'Test', last_name: 'User', birthday: '01.01.1990', phone: '1234567890' });

    await request(app).post('/auth/verify/send').send({ email }).expect(200);
    await request(app).post('/auth/verify/verify').send({ email, code: '123456' }).expect(200);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeTruthy();
    expect(res.body.data.tokens.refreshToken).toBeTruthy();
  });

  test('missing email returns 400', async () => {
    const res = await request(app).post('/auth/signup').send({ password, first_name: 'Test', last_name: 'User' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('invalid email format returns 400', async () => {
    const res = await request(app).post('/auth/signup').send({ email: 'invalid', password, first_name: 'Test', last_name: 'User' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('weak password returns 400', async () => {
    const res = await request(app).post('/auth/signup').send({ email: `weak${unique}@example.com`, password: '123', first_name: 'Test', last_name: 'User' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('duplicate email returns 409', async () => {
    await request(app).post('/auth/signup').send({ email, password, first_name: 'Test', last_name: 'User' });
    const res = await request(app).post('/auth/signup').send({ email, password, first_name: 'Test', last_name: 'User' });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
