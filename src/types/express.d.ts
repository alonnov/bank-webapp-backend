import { AuthenticatedUser } from './types';
import { 
  TransactionRequest,
  UserInfoUpdateRequest,
  EmailChangeRequest,
  PasswordChangeRequest,
  LoginRequestBody,
  SignupRequest
} from './requestTypes';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      
      isVerified?: boolean;
      validatedUserInfo?: UserInfoUpdateRequest;
      validatedEmailChange?: EmailChangeRequest;
      validatedPasswordChange?: PasswordChangeRequest;
      validatedTransaction?: TransactionRequest;
      validatedLogin?: LoginRequestBody;
      validatedSignup?: SignupRequest;
    }
  }
} 