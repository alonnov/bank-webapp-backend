import { Request, Response, NextFunction } from 'express';
import { z } from '../../lib/zod-to-openapi';
import { EditInfoRequest } from '../../types/requestTypes';
import { ApiResponse } from '../../types/responseTypes';
import { birthdateValidator } from './validatorTypes';

// User info update schema (basic profile fields only)
export const userInfoUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  birthday: birthdateValidator.optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
});


export const validateUserInfoUpdate = (req: Request, res: Response, next: NextFunction): void | Response => {
  const result = userInfoUpdateSchema.safeParse(req.body as EditInfoRequest);
  
  if (!result.success) {
    res.status(400).json(new ApiResponse({
      success: false,
      errors: z.prettifyError(result.error)
    }));
  }
  
  req.validatedUserInfo = result.data;
  next();
}; 