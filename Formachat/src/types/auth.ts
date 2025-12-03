/**
 * ========================================
 * AUTH TYPE DEFINITIONS
 * ========================================
 * 
 * TypeScript interfaces for authentication-related data structures.
 * Matches the Auth Service API responses.
 */

/**
 * User object (returned from API)
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  source?: string;
}

/**
 * Auth tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Register request body
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Register response
 */
export interface RegisterResponse {
  user: User;
  requiresVerification: boolean;
}

/**
 * Token refresh request
 */
export interface TokenRefreshRequest {
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Email verification request
 */
export interface VerifyEmailRequest {
  email: string;
  otp: string;
  type: OTPType;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation request
 */
export interface PasswordResetConfirmRequest {
  email: string;
  otp: string;
  newPassword: string;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * User profile update request
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

/**
 * Session info
 */
export interface SessionInfo {
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActive: Date;
  createdAt: Date;
}

/**
 * JWT Payload (decoded from access token)
 */
export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * OTP Types
 */
export enum OTPType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  TWO_FACTOR = '2fa',
}

/**
 * OTP request
 */
export interface GenerateOTPRequest {
  email: string;
  type: OTPType;
}

/**
 * OTP verification request
 */
export interface VerifyOTPRequest {
  email: string;
  otp: string;
  type: OTPType;
}