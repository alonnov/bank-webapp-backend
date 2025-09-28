import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { userService } from '../../services/serviceContainer';
import { ApiResponse } from '../../types/responseTypes';
import { loginUser } from '../../services/authService';

export const userLogin = async ( req: Request, res: Response, next: NextFunction): 
  Promise<void> => { 
  try {
    const { email, password } = req.validatedLogin!;

    const user = await userService.findByEmail(email);
    if (!user) {
      res.status(401).json(new ApiResponse({ success: false, message: 'Wrong email and/or password' }));
      return;
    }

    if (!user.is_verified) {
      res.status(403).json(new ApiResponse({ success: false, message: 'Please verify your email before logging in' }));
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json(new ApiResponse({ success: false, message: 'Wrong email and/or password' }));
      return;
    }

    const loginAccountPageData = await loginUser(user);

    res.status(200).json(new ApiResponse({
      success: true,
      message: 'Login successful',
      data: loginAccountPageData,
    }));

  } catch (error) {
    next(error); // centralized error handling
  }
};
