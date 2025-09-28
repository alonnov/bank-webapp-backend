import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types/responseTypes';
import { refreshAccessTokenIfNeeded } from '../services/authService';

export const tokenErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  // Access token expired
  if (err instanceof jwt.TokenExpiredError) {
    try {
      const userId = req.user?.id; // maybe from a short-lived payload or cookie
      if (!userId) throw new Error('UserId required for token refresh');

      // Use refresh token to generate a new access token
      const tokens = await refreshAccessTokenIfNeeded(userId);
      // Optionally attach new access token to headers
      res.setHeader('x-access-token', tokens.accessToken);

      // Proceed to the route with refreshed token info
      return next();
    } catch {
      return res.status(401).json(new ApiResponse({ 
        success: false, 
        message: 'Invalid or missing refresh token' 
      }));
    }
  }

  // Invalid access token
  if (err instanceof jwt.JsonWebTokenError || err.message === 'Access token required') {
    return res.status(401).json(new ApiResponse({ 
      success: false, 
      message: 'Invalid access token' 
    }));
  }

  // Other errors
  console.error(err);
  return res.status(500).json(new ApiResponse({ 
    success: false, 
    message: 'Internal server error' 
  }));
};
