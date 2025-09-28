import { Request, Response } from 'express';
import { userService, accountService } from '../../services/serviceContainer';
import { AccountPageData, ApiResponse } from '../../types/responseTypes';
import { createAccountPageData } from '../../utils/accountUtils'

// Get account page data (user info, balance, recent transactions)
export const getAccount = async (req: Request, res: Response) => {
  try {
    // Get user from JWT(set by auth middleware)
    const user = req.user!;

    // Get user information
    const userData = await userService.findByAccountId(user.id);
    if (!userData) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'User not found'
      }));
    }

    // Get account information
    const account = await accountService.findByUserId(user.id);
    if (!account) {
      return res.status(404).json(new ApiResponse({
        success: false,
        message: 'Account not found'
      }));
    }

    const accountPageData: AccountPageData = await createAccountPageData(user.id);

    return res.status(200).json(new ApiResponse({
      success: true,
      data: accountPageData
    }));

  } catch (error) {
    console.error('Account page error:', error);
    return res.status(500).json(new ApiResponse({
      success: false,
      message: 'Internal server error'
    }));
  }
};
