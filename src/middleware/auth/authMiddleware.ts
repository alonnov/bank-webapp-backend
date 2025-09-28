import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../utils/jwt';

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    // Throw an Error to be caught by global error handler
    throw new Error('Access token required');
  }

  const token = authHeader.substring(7);

  // verifyAccessToken can throw TokenExpiredError or JsonWebTokenError
  const payload = verifyAccessToken(token);

  req.user = payload; // attach user info
  next();
};

