import { sendVerificationEmail, verifyEmail, checkVerificationStatus } from '../../../src/controllers/auth/emailVerification-controllers';
import { Request, Response } from 'express';
import { userService } from '../../../src/services/serviceContainer';
import { emailService } from '../../../src/services/emailService';

jest.mock('../../../src/services/serviceContainer', () => ({
  userService: {
    findByEmail: jest.fn(),
    updateUser: jest.fn(),
  },
}));

jest.mock('../../../src/services/emailService', () => ({
  emailService: {
    sendVerificationEmail: jest.fn(),
    verifyCode: jest.fn(),
    canResend: jest.fn(),
    markResent: jest.fn(),
  }
}));

jest.mock('../../../src/utils/jwt', () => ({
  verifyAccessToken: jest.fn(),
}));


describe('sendVerificationEmail', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    req = { body: {} };
    res = { status: jest.fn().mockReturnValue({ json: jsonMock }) };
  });

  test('returns 400 if email is invalid', async () => {
    req.body = { email: 'invalid-email' };
    await sendVerificationEmail(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('returns 404 if user not found', async () => {
    req.body = { email: 'user@example.com' };
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);

    await sendVerificationEmail(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'User not found' }));
  });

  test('returns 200 when email sent successfully', async () => {
    req.body = { email: 'user@example.com' };
    (userService.findByEmail as jest.Mock).mockResolvedValue({ id: 1, is_verified: false });
    (emailService.canResend as jest.Mock).mockReturnValue(true);
    (emailService.sendVerificationEmail as jest.Mock).mockResolvedValue(true);

    await sendVerificationEmail(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true, message: 'Verification email sent successfully' }));
    expect(emailService.markResent).toHaveBeenCalledWith('user@example.com');
  });

  test('returns 429 if cannot resend', async () => {
    req.body = { email: 'user@example.com' };
    (userService.findByEmail as jest.Mock).mockResolvedValue({ id: 1, is_verified: false });
    (emailService.canResend as jest.Mock).mockReturnValue(false);

    await sendVerificationEmail(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(429);
  });
});
