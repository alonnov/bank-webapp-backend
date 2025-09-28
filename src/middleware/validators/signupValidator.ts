import { Request, Response, NextFunction } from 'express';
import { z } from '../../lib/zod-to-openapi';
import { userInfoSchema } from './userInfoValidator';
import { SignupRequest } from '../../types/requestTypes';
import { ApiResponse } from '../../types/responseTypes';

export const validateSignup = (req: Request, res: Response, next: NextFunction): void | Response => {
  const result = userInfoSchema.safeParse(req.body as SignupRequest);
  
  if (!result.success) {
    return res.status(400).json(new ApiResponse({
      success: false,
      errors: z.prettifyError(result.error)
    }));
  }
  req.validatedSignup = result.data;
  next();
}; 