import crypto from 'crypto';

/**
 * Hash a user ID to generate account ID
 */
export const hashUserId = (userId: string): string => {
  return crypto.createHash('sha256').update(userId).digest('hex');
};

/**
 * Verify if a hash matches a user ID
 */
export const verifyUserIdHash = (hash: string, userId: string): boolean => {
  return hashUserId(userId) === hash;
};

/**
 * Generate account ID from user ID
 */
export const generateAccountId = (userId: string): string => {
  return hashUserId(userId);
}; 