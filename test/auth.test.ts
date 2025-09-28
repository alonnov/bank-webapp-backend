import request from 'supertest';
import { app } from '../src/index';

jest.mock('../src/services/emailService', () => ({
  emailService: {
    sendVerificationEmail: jest.fn(async () => true),
    verifyCode: jest.fn((email: string, code: string) => code === '123456'),
    hasValidCode: jest.fn(() => true),
    storeVerificationCode: jest.fn(),
  }
}));

describe('Auth flow: signup and login', () => {
  const unique = Date.now();
  const email = `user${unique}@example.com`;
  const password = 'StrongP@ssw0rd!';

  test('signup returns 201 and tokens', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        email,
        password,
        first_name: 'Test',
        last_name: 'User',
        birthday: '01.01.1990',
        phone: '1234567890'
      });

    // request a code
    await request(app)
      .post('/auth/verify/send')
      .send({ email })
      .expect(200);

    // verify with the known code
    await request(app)
      .post('/auth/verify/verify')
      .send({ email, code: '123456' })
      .expect(200);

    expect(res.status).toBe(201);
    expect(res.body?.success).toBe(true);
    expect(res.body?.data?.tokens?.accessToken).toBeTruthy();
    expect(res.body?.data?.tokens?.refreshToken).toBeTruthy();
  });

  test('login with wrong email returns 401', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@email.com', password });

    expect(res.status).toBe(401);
    expect(res.body?.success).toBe(false);
  });

  test('login with wrong password returns 401', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'WrongPassword123!' });

    expect(res.status).toBe(401);
    expect(res.body?.success).toBe(false);
  });

  test('login with correct credentials returns 200 and tokens', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body?.success).toBe(true);
    expect(res.body?.data?.tokens?.accessToken).toBeTruthy();
    expect(res.body?.data?.tokens?.refreshToken).toBeTruthy();
  });
});


