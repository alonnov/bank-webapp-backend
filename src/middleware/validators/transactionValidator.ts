import { Request, Response, NextFunction } from 'express';
import { z } from '../../lib/zod-to-openapi';
import { emailValidator } from './validatorTypes';
import { TransactionRequest } from '../../types/requestTypes';
import { ApiResponse } from '../../types/responseTypes';


export const transactionSchema = z.object({
  recipient: emailValidator,
  sum: z.number().min(1, 'Amount must be at least 1'), 
  message: z.string().max(100, 'Message cannot exceed 100 characters').optional(),
});


export const validateTransaction = (req: Request, res: Response, next: NextFunction): void | Response => {
  const result = transactionSchema.safeParse(req.body as TransactionRequest);
  
  if (!result.success) {
    res.status(400).json(new ApiResponse({
      success: false,
      errors: z.prettifyError(result.error)
    }));
  }
  
  req.validatedTransaction = result.data;
  next();
};