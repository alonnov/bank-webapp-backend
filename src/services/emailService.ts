import nodemailer from 'nodemailer';
import { emailConfig } from '../config/config';

type CodeEntry = { code: string; expiresAt: Date; lastSentAt: Date };
const verificationCodes = new Map<string, CodeEntry>();
const RESEND_COOLDOWN_MS = 60_000;

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromAddress: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: emailConfig.service,
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });

    this.fromAddress = `"${emailConfig.appName}" <${emailConfig.fromAddress}>`;
  }

  canResend(email: string): boolean {
    const entry = verificationCodes.get(email);
    return !entry || Date.now() - entry.lastSentAt.getTime() >= RESEND_COOLDOWN_MS;
  }

  markResent(email: string): void {
    const entry = verificationCodes.get(email);
    if (entry) entry.lastSentAt = new Date();
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendVerificationEmailWithCode(email: string, code: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.fromAddress,
        to: email,
        subject: `Verify Your ${emailConfig.appName} Account`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Welcome to ${emailConfig.appName}!</h2>
            <p>Thank you for signing up. To complete your registration, please enter the verification code below:</p>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #3498db; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
            </div>
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #7f8c8d; font-size: 12px;">
              This is an automated message from ${emailConfig.appName}. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: this.fromAddress,
        to: email,
        subject: `Reset Your ${emailConfig.appName} Password`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </div>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #7f8c8d; font-size: 12px;">
              This is an automated message from ${emailConfig.appName}. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  storeVerificationCode(email: string, code: string): void {
    const expiresAt = new Date(Date.now() + emailConfig.verificationCodeExpireMs);
    verificationCodes.set(email, { code, expiresAt, lastSentAt: new Date() });
  }

  verifyCode(email: string, code: string): boolean {
    const stored = verificationCodes.get(email);
    if (!stored) return false;
    if (new Date() > stored.expiresAt) {
      verificationCodes.delete(email);
      return false;
    }
    if (stored.code === code) {
      verificationCodes.delete(email);
      return true;
    }
    return false;
  }

  hasValidCode(email: string): boolean {
    const stored = verificationCodes.get(email);
    if (!stored) return false;
    if (new Date() > stored.expiresAt) {
      verificationCodes.delete(email);
      return false;
    }
    return true;
  }

  async sendVerificationEmail(email: string): Promise<boolean> {
    const code = this.generateVerificationCode();
    this.storeVerificationCode(email, code);
    const ok = await this.sendVerificationEmailWithCode(email, code);

    if (ok) this.markResent(email); // <-- use 'this.'
    return ok;
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!this.canResend(email)) {  // <-- use 'this.'
      return { success: false, message: 'Please wait before requesting another code' };
    }
    const sent = await this.sendVerificationEmail(email);
    return sent 
      ? { success: true, message: 'Verification code resent successfully' }
      : { success: false, message: 'Failed to send verification email' };
  }

}

// Export singleton instance
export const emailService = new EmailService();
