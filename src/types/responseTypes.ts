import { Transaction } from "./types";

export class ApiResponse{
      success: boolean;
      message?: string;
      errors?: string;
      data?: LoginAccountPageData | AccountPageData | UserInfoData | TransactionsPage | EmailResponse | Transaction;

      constructor(params: {
        success: boolean;
        message?: string;
        errors?: string;
        data?: LoginAccountPageData | AccountPageData | UserInfoData | TransactionsPage | EmailResponse | Transaction;
      }) {
        this.success = params.success;
        this.message = params.message;
        this.errors = params.errors;
        this.data = params.data;
      }
    }


// Interface for account page response
export interface AccountPageData {
    user: {
      first_name: string;
    }

    account: {
      balance: number;
      status: string;
    }
    
    recentTransactions: Array<{
      id: string;
      sender: string;
      recipient: string;
      sum: number;
      date: Date;
      message?: string;
      isIncoming: boolean; // true if user is recipient, false if sender
    }>
}

// Interface for account page response after login
export interface LoginAccountPageData extends AccountPageData{
    tokens: JWTResponse;
}

// Interface for user info response
export interface UserInfoData {
    email: string;
    first_name: string;
    last_name: string;
    birthday: Date;
    phone: string;
    last_updated: Date;
    is_verified?: boolean;
}

export interface UserTransaction extends Transaction {
  isIncoming: boolean;
}

export interface TransactionsPage {
  transactions: Transaction[];
  pagination: Pagination;
}

interface Pagination {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        }


export interface EmailResponse {
    email: string;
}

// JWT payload interface
export interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// JWT response interface
export interface JWTResponse {
  accessToken: string;
  refreshToken: string;
}