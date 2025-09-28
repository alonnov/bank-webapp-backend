import request from 'supertest';
import { app } from '../../../src/index';
import { createVerifiedUser } from '../../setup';

describe('Login', () => {
  const unique = Date.now();
  const email = `loginUser${unique}@example.com`;
  const password = 'StrongP@ssw0rd!';

  // Create a verified user once for login tests
  beforeAll(async () => {
    await createVerifiedUser(email, password);
  });

  test('login with correct credentials returns 200 and tokens', async () => {
    const res = await request(app).post('/auth/login').send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeTruthy();
    expect(res.body.data.tokens.refreshToken).toBeTruthy();
  });

  test('login with invalid passwords returns 400', async () => {
    const invalidPasswords = ['', '12394316', 'abc']; // empty, too short, weak

    for (const pwd of invalidPasswords) {
      const res = await request(app).post('/auth/login').send({ email, password: pwd });
      expect(res.status).toBe(400); // or 401 if your API prefers Unauthorized
      expect(res.body.success).toBe(false);
    }
  });

  test('login with wrong email returns 401', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'wrong@email.com', password });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
