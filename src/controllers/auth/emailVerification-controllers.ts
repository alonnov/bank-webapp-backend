import { Request, Response } from 'express';
import { z } from '../../lib/zod-to-openapi';
import { emailService } from '../../services/emailService';
import { userService } from '../../services/serviceContainer';
import { verifyAccessToken } from '../../utils/jwt';
import { emailConfig } from '../../config/config';
import { ApiResponse, EmailResponse } from '../../types/responseTypes';

// Validation schemas
const emailSchema = z.object({ email: z.email('Invalid email address') });
const verifyCodeSchema = emailSchema.extend({
  code: z.string().length(emailConfig.verificationCodeLength, `Verification code must be ${emailConfig.verificationCodeLength} digits`),
});

/**
 * Common validation and user checks for email verification
 */
const validateEmailAndUser = async (email: string): Promise<{ error: string; status: number } | { user: any }> => {
  // Check if user exists
  const user = await userService.findByEmail(email);
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  // Check if already verified
  if (user.is_verified) {
    return { error: 'Email is already verified', status: 400 };
  }

  return { user };
};

/**
 * Send verification email (for new signups)
 */
export const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const result = emailSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(new ApiResponse({
        success: false,
        errors: z.prettifyError(result.error)
      }));
    }

    const { email } = result.data;

    // Common validation
    const validation = await validateEmailAndUser(email);
    if ('error' in validation) {
      return res.status(validation.status).json(new ApiResponse({
        success: false,
        message: validation.error
      }));
    }

    if (!emailService.canResend(email)) {
      return res.status(429).json(new ApiResponse({ 
        success: false, 
        message: 'Please wait before requesting another code' 
      }));
    }
  
    return res.status(200).json(new ApiResponse({ 
      success: true, 
      message: 'Verification email sent successfully' 
    }));


  } catch (error) {
    console.error('Send verification email error:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

/**
 * Verify email with code
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const result = verifyCodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(new ApiResponse({
        success: false,
        errors: z.prettifyError(result.error)
      }));
    }

    const { email, code } = result.data;

    // Common validation
    const validation = await validateEmailAndUser(email);
    if ('error' in validation) {
      return res.status(validation.status).json(new ApiResponse({
        success: false,
        message: validation.error
      }));
    }

    // Verify the code
    const isValid = emailService.verifyCode(email, code);
    
    if (!isValid) {
      return res.status(400).json(new ApiResponse({
        success: false,
        message: 'Invalid or expired verification code'
      }));
    }

    // Update user verification status
    const updatedUser = await userService.updateUser(validation.user.id, { is_verified: true });
    
    if (!updatedUser) {
      return res.status(500).json(new ApiResponse({
        success: false,
        message: 'Failed to update user verification status'
      }));
    }

    const verificationResponse: EmailResponse = {
        email: updatedUser.email,
    }

    return res.status(200).json(new ApiResponse({
      success: true,
      message: 'Email verified successfully',
      data: verificationResponse 
    }));

  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

/**
 * Check verification status (requires authentication)
 */
export const checkVerificationStatus = async (req: Request, res: Response) => {
  try {
    // Get user email from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(new ApiResponse({
        success: false,
        message: 'Access token required'
      }));
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    const userEmail = decoded.email;

    // Get user information
    const user = await userService.findByEmail(userEmail);
    if (!user) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'User not found'
      }));
    }

    const verificationResponse: EmailResponse = {
        email: userEmail,
    }

    return res.status(200).json(new ApiResponse({
      success: true,
      data: verificationResponse
    }));

  } catch (error) {
    console.error('Check verification status error:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
}; 