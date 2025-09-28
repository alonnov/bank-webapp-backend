import { Request, Response, NextFunction } from 'express';
import { z } from '../../lib/zod-to-openapi';
import { LoginRequestBody } from '../../types/requestTypes';
import { ApiResponse } from '../../types/responseTypes';

declare module 'express-serve-static-core' {
  interface Request {
    validatedLogin?: LoginRequestBody;
  }
}

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});


export const validateLogin = (req: Request, res: Response, next: NextFunction): void | Response => {
  const result = loginSchema.safeParse(req.body as LoginRequestBody);
  
  if (!result.success) {
    return res.status(400).json(new ApiResponse({
      success: false,
      errors: z.prettifyError(result.error)
    }));
  }
  
  req.validatedLogin = result.data;
  next();
};