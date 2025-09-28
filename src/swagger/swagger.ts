import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { loginSchema } from "../middleware/validators/loginValidator";
import { userInfoSchema } from "../middleware/validators/userInfoValidator";
import { userInfoUpdateSchema } from "../middleware/validators/userInfoUpdateValidator";
import { emailChangeSchema, passwordChangeSchema } from '../middleware/validators/securityValidator';
import { transactionSchema } from '../middleware/validators/transactionValidator';
import { emailValidator } from '../middleware/validators/validatorTypes';
import { z } from '../lib/zod-to-openapi';

export const registry = new OpenAPIRegistry();

// Register all schemas
registry.register("Login", loginSchema);
registry.register("User Info", userInfoSchema);
registry.register("User Info Update", userInfoUpdateSchema);
registry.register("Email Change", emailChangeSchema);
registry.register("PW Change", passwordChangeSchema);
registry.register("Transaction", transactionSchema);

// Email request schema
const emailRequestSchema = z.object({ email: emailValidator });
registry.register("Email Request", emailRequestSchema);

// Email verification schema
const emailVerifyRequestSchema = emailRequestSchema.extend({ code: z.string().length(6) });
registry.register("Email Verify Request", emailVerifyRequestSchema);

// Global bearerAuth
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
});

/**
 * --- PUBLIC ---
 */
registry.registerPath({
  method: 'post',
  path: '/signup',
  description: 'Create a new account',
  tags: ['Public'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'user@example.com' },
              password: { type: 'string', example: 'Password123!' },
              first_name: { type: 'string', example: 'John' },
              last_name: { type: 'string', example: 'Doe' },
              birthday: { 
                type: 'string', 
                example: '20.05.2001', 
                description: 'Date in DD.MM.YYYY format; user must be over 18' 
              },
              phone: { type: 'string', example: '+1234567890' }
            },
            required: ['email', 'password','first_name','last_name','birthday','phone']
          }
        }
      }
    }
  },
  responses: {
    201: { description: 'Signup successful' },
    400: { description: 'Email already exists or invalid data' },
    500: { description: 'Internal server error' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/login',
  description: 'Authenticate user and return JWT + account info',
  tags: ['Public'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'user@example.com' },
              password: { type: 'string', example: 'Password123!' }
            },
            required: ['email','password']
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  first_name: { type: 'string', example: 'John' },
                  last_name: { type: 'string', example: 'Doe' },
                  phone: { type: 'string', example: '+1234567890' },
                  birthday: { type: 'string', example: '20.05.2001' }
                },
                required: ['first_name','last_name','phone','birthday']
              },
              account: {
                type: 'object',
                properties: {
                  balance: { type:'number', example: 1000 },
                  status: { type:'string', example:'active' }
                },
                required: ['balance','status']
              },
              recentTransactions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'txn_123456' },
                    sender: { type: 'string', example: 'user@example.com' },
                    recipient: { type: 'string', example: 'recipient@example.com' },
                    sum: { type: 'number', example: 50 },
                    date: { type: 'string', example: '2025-09-11T14:00:00Z' },
                    message: { type: 'string', example: 'Payment for lunch' },
                    isIncoming: { type: 'boolean', example: true }
                  },
                  required: ['id','sender','recipient','sum','date','isIncoming']
                }
              },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  expiresIn: { type: 'number', example: 3600 }
                },
                required: ['accessToken','refreshToken','expiresIn']
              }
            },
            required: ['user','account','recentTransactions','tokens']
          }
        }
      }
    },
    401: { description: 'Invalid credentials' },
    403: { description: 'Unverified email' },
    500: { description: 'Internal server error' }
  }
});

/**
 * --- EMAIL VERIFICATION ---
 */
registry.registerPath({
  method: 'post',
  path: '/public/verify/send',
  description: 'Send verification email',
  tags: ['Public'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { email: { type: 'string', example: 'user@example.com' } },
            required: ['email']
          }
        }
      }
    }
  },
  responses: {
    200: { description:'Email sent successfully' },
    400: { description:'Invalid email or user not found' },
    429: { description:'Too many requests' },
    500: { description:'Internal server error' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/public/verify/verify',
  description: 'Verify email with code',
  tags: ['Public'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'user@example.com' },
              code: { type: 'string', example: '123456' }
            },
            required: ['email','code']
          }
        }
      }
    }
  },
  responses: {
    200: { description:'Email verified successfully' },
    400: { description:'Invalid or expired code' },
    404: { description:'User not found' },
    500: { description:'Internal server error' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/public/verify/status',
  description: 'Check email verification status',
  tags: ['Public'],
  responses: {
    200: { 
      description:'Verification status', 
      content: { 
        'application/json': { 
          schema: { 
            type:'object', 
            properties: { email:{ type:'string', example:'user@example.com' } }, 
            required:['email'] 
          } 
        } 
      } 
    },
    401: { description:'Unauthorized' }
  }
});

/**
 * --- ACCOUNT ---
 */
registry.registerPath({
  method: 'get',
  path: '/auth/info',
  description: 'Get user info',
  tags: ['Auth'],
  responses: {
    200: {
      description:'User info retrieved',
      content:{
        'application/json':{
          schema:{
            type: 'object',
            properties: {
              first_name: { type: 'string', example: 'John' },
              last_name: { type: 'string', example: 'Doe' },
              phone: { type: 'string', example: '+1234567890' },
              birthday: { type: 'string', example: '20.05.2001' }
            },
            required: ['first_name','last_name','phone','birthday']
          }
        }
      }
    },
    401:{description:'Unauthorized'}
  }
});

registry.registerPath({
  method: 'put',
  path: '/auth/info',
  description: 'Update user info',
  tags: ['Auth'],
  request: {
    body: {
      content:{
        'application/json':{
          schema: {
            type: 'object',
            properties: {
              first_name: { type: 'string', example: 'John' },
              last_name: { type: 'string', example: 'Doe' },
              phone: { type: 'string', example: '+1234567890' },
              birthday: { type: 'string', example: '20.05.2001' }
            },
            required:['first_name','last_name','phone','birthday']
          }
        }
      }
    }
  },
  responses: { 200:{ description:'User info updated'}, 400:{ description:'Invalid data'}, 401:{ description:'Unauthorized'} }
});

registry.registerPath({
  method:'post',
  path:'/auth/security/change-email',
  description:'Change user email',
  tags: ['Auth'],
  request:{
    body:{
      content:{
        'application/json':{
          schema:{
            type: 'object',
            properties: {
              email: { type: 'string', example: 'new@example.com' },
              password: { type: 'string', example: 'Password123!' }
            },
            required: ['email','password']
          }
        }
      }
    }
  },
  responses:{ 200:{ description:'Email changed successfully'}, 400:{ description:'Invalid data or password mismatch'}, 401:{ description:'Unauthorized'} }
});

registry.registerPath({
  method:'post',
  path:'/auth/security/change-password',
  description:'Change user password',
  tags: ['Auth'],
  request:{
    body:{
      content:{
        'application/json':{
          schema:{
            type: 'object',
            properties: {
              oldPassword: { type: 'string', example: 'Password123!' },
              newPassword: { type: 'string', example: 'NewPassword456!' }
            },
            required: ['oldPassword','newPassword']
          }
        }
      }
    }
  },
  responses:{ 200:{ description:'Password changed successfully'}, 400:{ description:'Invalid data or password mismatch'}, 401:{ description:'Unauthorized'} }
});

// Logout
registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  description: 'Logout the current user',
  tags: ['Auth'],
  responses: { 200: { description:'Logout successful'}, 401:{ description:'Unauthorized'} }
});

/**
 * --- TRANSACTIONS ---
 */
registry.registerPath({
  method:'post',
  path:'/auth/transactions',
  description:'Create transaction',
  tags: ['Auth'],
  request:{
    body:{
      content:{
        'application/json':{
          schema:{
            type: 'object',
            properties: {
              recipient: { type: 'string', example: 'recipient@example.com' },
              sum: { type: 'number', example: 50 },
              message: { type: 'string', example: 'Payment for lunch' }
            },
            required:['recipient','sum']
          }
        }
      }
    }
  },
  responses:{ 201:{ description:'Transaction created'}, 400:{ description:'Invalid transaction'}, 401:{ description:'Unauthorized'} }
});

registry.registerPath({
  method:'get',
  path:'/auth/transactions/history',
  description:'Transaction history',
  tags: ['Auth'],
  responses:{
    200:{
      description:'History retrieved',
      content:{
        'application/json':{
          schema:{
            type:'array',
            items:{
              type: 'object',
              properties: {
                id: { type:'string', example: 'txn_123456' },
                sender: { type:'string', example: 'user@example.com' },
                recipient: { type:'string', example: 'recipient@example.com' },
                sum: { type:'number', example: 50 },
                date: { type:'string', example: '2025-09-11T14:00:00Z' },
                message: { type:'string', example: 'Payment for lunch' },
                isIncoming: { type:'boolean', example: true }
              },
              required:['id','sender','recipient','sum','date','isIncoming']
            }
          }
        }
      }
    },
    401:{ description:'Unauthorized' }
  }
});

registry.registerPath({
  method:'get',
  path:'/auth/transactions/{id}',
  description:'Get transaction by ID',
  tags: ['Auth'],
  responses:{
    200:{
      description:'Transaction retrieved',
      content:{
        'application/json':{
          schema:{
            type:'object',
            properties: {
              id: { type:'string', example: 'txn_123456' },
              sender: { type:'string', example: 'user@example.com' },
              recipient: { type:'string', example: 'recipient@example.com' },
              sum: { type:'number', example: 50 },
              date: { type:'string', example: '2025-09-11T14:00:00Z' },
              message: { type:'string', example: 'Payment for lunch' },
              isIncoming: { type:'boolean', example: true }
            },
            required:['id','sender','recipient','sum','date','isIncoming']
          }
        }
      }
    },
    401:{ description:'Unauthorized' },
    404:{ description:'Not found' }
  }
});

// Generate spec
export function getOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: { title:'Banking App API', version:'1.0.0' },
    security:[{ bearerAuth: [] }]
  });
}
