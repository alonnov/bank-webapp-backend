import { userService } from './serviceContainer';
import { generateTokens, generateAccessToken } from '../utils/jwt';
import { createAccountPageData } from '../utils/accountUtils';
import { LoginAccountPageData } from '../types/responseTypes';
import { User } from '../types/types';

/**
 * Logs in a user: generates tokens and prepares full account page data
 */
export const loginUser = async (user: User): Promise<LoginAccountPageData> => {
  // Get account page data (user info, balance, transactions)
  const accountPageData = await createAccountPageData(user.id);

  // Generate both access + refresh tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
  });

  // Store refresh token in DB
  await userService.updateUser(user.id, { refreshToken: tokens.refreshToken });

  return {
    ...accountPageData,
    tokens,
  };
};

/**
 * Refresh access token for a user using the stored refresh token
 */
export const refreshAccessTokenIfNeeded = async (userId: string): Promise<{ accessToken: string }> => {
  const user = await userService.findByAccountId(userId);
  if (!user?.refreshToken) {
    throw new Error('No refresh token available');
  }

  const newAccessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });

  return { accessToken: newAccessToken };
};

/**
 * Logs out a user by clearing their refresh token
 */
export const logoutUser = async (userId: string): Promise<void> => {
  await userService.updateUser(userId, { refreshToken: null });
};
