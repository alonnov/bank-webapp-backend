import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userService } from '../../services/serviceContainer'
import { emailService } from '../../services/emailService';
import { createPW } from '../../utils/password';
import { ApiResponse, EmailResponse } from '../../types/responseTypes';

/**
 * Change user email address
 */
export const changeEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newEmail } = req.validatedEmailChange!;

    // Get current user
    const user = await userService.findByAccountId(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'User not found'
      }));
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(new ApiResponse({
        success: false,
        message: 'Current password is incorrect'
      }));
    }

    // Check if new email is different from current
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      return res.status(400).json(new ApiResponse({
        success: false,
        message: 'New email must be different from current email'
      }));
    }

    // Check if new email already exists
    const emailExists = await userService.userExists(newEmail);
    if (emailExists) {
      return res.status(400).json(new ApiResponse({
        success: false,
        message: 'Email already associated with another account'
      }));
    }

    // Send verification email to new address
    await emailService.sendVerificationEmail(newEmail);
    
    const emailResponse: EmailResponse = {
      email: newEmail,
    }
    
    return res.status(200).json(new ApiResponse({
      success: true,
      message: 'Verification email sent to new address. Please verify before email change takes effect.',
      data: emailResponse,
    }));

  } catch (error) {
    console.error('Error changing email:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

/**
 * Confirm email change with verification code
 */
export const confirmEmailChange = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { newEmail, verificationCode } = req.body;

    // Get current user
    const user = await userService.findByAccountId(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'User not found'
      }));
    }

    // Verify the code (you'll need to implement this in emailService)
    const isCodeValid = await emailService.verifyCode(newEmail, verificationCode);
    if (!isCodeValid) {
      return res.status(400).json(new ApiResponse({
        success: false,
        message: 'Invalid verification code'
      }));
    }

    // Update email
    const updatedUser = await userService.updateUser(userId, {
      email: newEmail
    });

    if (!updatedUser) {
      return res.status(500).json(new ApiResponse({
        success: false,
        message: 'Failed to update email'
      }));
    }

    const emailResponse: EmailResponse = {
      email: newEmail,
    }

    return res.status(200).json(new ApiResponse({
      success: true,
      message: 'Email changed successfully',
      data: emailResponse
    }));

  } catch (error) {
    console.error('Error confirming email change:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.validatedPasswordChange!;

    // Get current user
    const user = await userService.findByAccountId(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'User not found'
      }));
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(new ApiResponse({
        success: false,
        message: 'Current password is incorrect'
      }));
    }

    // Hash new password
    const hashedNewPassword = await createPW(newPassword);

    // Update password
    const updatedUser = await userService.updateUser(userId, {
      password: hashedNewPassword
    });

    if (!updatedUser) {
      return res.status(500).json(new ApiResponse({
        success: false,
        message: 'Failed to update password'
      }));
    }

    return res.status(200).json(new ApiResponse({
      success: true,
      message: 'Password changed successfully'
    }));

  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
}; 