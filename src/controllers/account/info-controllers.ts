import { Request, Response } from 'express';
import { userService } from '../../services/serviceContainer';
import { ApiResponse, UserInfoData } from '../../types/responseTypes';
/**
 * Get user information
 */
export const getInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id; // From auth middleware

    const user = await userService.findByAccountId(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'User not found'
      }));
    }

    // Return user info without sensitive data
    const userInfoData: UserInfoData = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday,
      phone: user.phone,
      is_verified: user.is_verified,
      last_updated: new Date(),
    }
    return res.status(200).json(new ApiResponse({
      success: true,
      data: userInfoData
    }));

  } catch (error) {
    console.error('Error getting user info:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

/**
 * Edit basic user information (name, birthday, phone)
 */
export const editInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    // Validation is handled by middleware, data is available in req.validatedUserInfo
    const updates = req.validatedUserInfo!;

    // Explicitly reject ID, email, password and created_at changes
    if ('id' in req.body || 'email' in req.body || 'password' in req.body || 'created at' in req.body) {
      return res.status(400).json(new ApiResponse({
        success: false,
        message: 'ID, email, and password cannot be changed through this endpoint'
      }));
    }

    // Check if user exists
    const existingUser = await userService.findByAccountId(userId);
    if (!existingUser) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'User not found'
      }));
    }

    // Update user information (only basic profile fields)
    const updatedUser = await userService.updateUser(userId, updates);
    if (!updatedUser) {
      return res.status(500).json(new ApiResponse({
        success: false,
        message: 'Failed to update user information'
      }));
    }

    const updatedUserInfo: UserInfoData = { 
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      birthday: updatedUser.birthday,
      phone: updatedUser.phone,
      last_updated: updatedUser.last_update
    }

    return res.status(200).json(new ApiResponse({
      success: true,
      message: 'User information updated successfully',
      data: updatedUserInfo
      }));

  } catch (error) {
    console.error('Error updating user info:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};

