import { Request, Response, NextFunction } from 'express';
import { z } from '../../lib/zod-to-openapi';
import { emailValidator, passwordValidator } from './validatorTypes';
import { EmailChangeRequest, PasswordChangeRequest } from '../../types/requestTypes';
import { ApiResponse } from '../../types/responseTypes';

export const emailChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newEmail: emailValidator
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordValidator,
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const validateEmailChange = (req: Request, res: Response, next: NextFunction): void | Response => {
  const result = emailChangeSchema.safeParse(req.body as EmailChangeRequest);
  
  if (!result.success) {
    return res.status(400).json(new ApiResponse({
      success: false,
      errors: z.prettifyError(result.error)
    }));
  }
  
  req.validatedEmailChange = result.data;
  next();
};

export const validatePasswordChange = (req: Request, res: Response, next: NextFunction): void | Response => {
  const result = passwordChangeSchema.safeParse(req.body as PasswordChangeRequest);
  
  if (!result.success) {
    return res.status(400).json(new ApiResponse({
      success: false,
      errors: z.prettifyError(result.error)
    }));
  }
  
  req.validatedPasswordChange = result.data;
  next();
}; 