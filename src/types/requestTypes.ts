export interface LoginRequestBody {
    email: string;
    password: string;
  }

export interface EmailChangeRequest {
    currentPassword: string;
    newEmail: string;
  }

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

export interface EditInfoRequest {
    first_name: string;
    last_name: string;
    birthday: Date;
    phone: string;
  }
  
export interface SignupRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    birthday: Date;
    phone: string;
  }

export interface TransactionRequest {
    recipient: string;
    sum: number;
    message?: string;
  }



