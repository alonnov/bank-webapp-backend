import jwt, { SignOptions, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { jwtConfig } from '../config/config';
import { JWTPayload, JWTResponse } from '../types/responseTypes';

// Utility to generate token
const signToken = (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: SignOptions['expiresIn']
): string => {
  const options: SignOptions = {
    expiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };
  return jwt.sign(payload, jwtConfig.secret, options);
};


// Generate access token
export const generateAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return signToken(payload, jwtConfig.expiresIn || '1h');
};

// Generate refresh token
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return signToken(payload, jwtConfig.refreshExpiresIn || '7d');
};

// Generate both access and refresh tokens
export const generateTokens = (payload: Omit<JWTPayload, 'iat' | 'exp'>): JWTResponse => {
  return { 
    accessToken: generateAccessToken(payload), 
    refreshToken: generateRefreshToken(payload) 
  };
};

// Generic verifier
const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, jwtConfig.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) throw new Error('Token has expired');
    if (error instanceof JsonWebTokenError) throw new Error('Invalid token');
    throw error;
  }
};

// Verify access token
export const verifyAccessToken = (token: string): JWTPayload => verifyToken(token);

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => verifyToken(token);

// Refresh access token using a valid refresh token
export const refreshAccessToken = (refreshToken: string): JWTResponse => {
  const decoded = verifyRefreshToken(refreshToken);

  const newAccessToken = generateAccessToken({
    id: decoded.id,
    email: decoded.email,
  });

  return {
    accessToken: newAccessToken,
    refreshToken, // keep the same refresh token
  };
};

// Decode token without verification
export const decodeToken = (token: string): any => jwt.decode(token);
