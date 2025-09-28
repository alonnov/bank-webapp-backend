import request from 'supertest';
import { app } from '../../../../src/index';
import { createTestAccount } from '../../../setup';

describe('Account page actions', () => {
  let user: any;
  let account: any;

  beforeAll(async () => {
    const result = await createTestAccount();
    user = result.user;
    account = result.account;
  });

  test('view account page', async () => {
    const res = await request(app)
      .get('/account')
      .set('Authorization', `Bearer ${user.token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.balance).toBe(account.balance);
  });

  test('edit account info', async () => {
    const res = await request(app)
      .put('/account')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ first_name: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.first_name).toBe('Updated');
  });

  test('view transactions', async () => {
    const res = await request(app)
      .get('/account/transactions')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
