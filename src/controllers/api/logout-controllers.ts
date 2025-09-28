import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../types/responseTypes';
import { verifyAccessToken } from '../../utils/jwt';
import { logoutUser } from '../../services/authService';

/**
 * Controller for logout
 */
export const userLogout = async ( req: Request, res: Response, next: NextFunction): 
  Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json(new ApiResponse({
        success: false,
        message: 'Access token required',
      }));
      return; 
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    await logoutUser(decoded.id);

    res.status(200).json(new ApiResponse({
      success: true,
      message: 'Logout successful',
    }));
    return; 
  } catch (error) {
    next(error); 
  }
};
