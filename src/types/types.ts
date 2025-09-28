export interface User {
  email: string;
  password: string;
  id: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  phone: string;
  created_at: Date;
  last_update: Date;
  is_verified: boolean;
  refreshToken?: string | null;
}

export interface Account {
  id: string;         // hashed from user id
  balance: number;
  created: Date;
  last_update: Date;
  status: string;
}

export interface Transaction {
  id: string;
  sender: string;     // id of the sender
  recipient: string;  // id of the recipient
  sum: number; 
  date: Date;
  message?: string;   // optional message with limited characters
}


export interface AuthenticatedUser {
  id: string;
  email: string;
}