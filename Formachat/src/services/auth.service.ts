/**
 * ========================================
 * AUTH SERVICE
 * ========================================
 * 
 * Wraps all authentication API calls.
 * 
 * Functions:
 * - login() - Login user, return tokens + user
 * - register() - Register new user
 * - verifyEmail() - Verify email with OTP
 * - logout() - Logout user (no token refresh on failure)
 * - getCurrentUser() - Get current user info
 * - resendOTP() - Resend verification OTP
 */

import { apiPost, apiGet } from '../utils/api.utils';
import { AUTH_ENDPOINTS } from '../config/api';
import { getRefreshToken, logout as clearLocalAuth } from '../utils/auth.utils';
import type { ApiResponse } from '../config/api';
import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type VerifyEmailRequest,
  type User,
  OTPType,
} from '../types/auth';

/**
 * Login user
 * POST /auth/login
 */
export const login = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  console.log('[AuthService] Logging in user:', credentials.email);

  return await apiPost<LoginResponse>(
    AUTH_ENDPOINTS.LOGIN,
    credentials,
    { skipAuth: true } // Public endpoint
  );
};

/**
 * Register new user
 * POST /auth/register
 */
export const register = async (userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
  console.log('[AuthService] Registering user:', userData.email);

  return await apiPost<RegisterResponse>(
    AUTH_ENDPOINTS.REGISTER,
    userData,
    { skipAuth: true } // Public endpoint
  );
};

/**
 * Verify email with OTP
 * POST /auth/verify-email
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<ApiResponse<any>> => {
  console.log('[AuthService] Verifying email:', data.email);

  return await apiPost(
    AUTH_ENDPOINTS.VERIFY_EMAIL,
    data,
    { skipAuth: true } // Public endpoint
  );
};

/**
 * Logout user
 * POST /auth/logout
 * 
 * IMPORTANT: This function handles logout gracefully:
 * 1. Gets refresh token
 * 2. Makes direct fetch call (bypassing token refresh interceptor)
 * 3. Clears local storage AFTER successful API call
 * 4. If API fails, still clears local storage (can't stay logged in)
 */
export const logout = async (): Promise<ApiResponse<any>> => {
  console.log('[AuthService] Logging out user');

  const refreshToken = getRefreshToken();

  // Try to call backend logout (best effort)
  // Don't use apiPost here to avoid token refresh interceptor
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    // Try to parse response, but don't fail if it errors
    try {
      const data = await response.json();
      console.log('[AuthService] Logout API response:', data);
    } catch (parseError) {
      console.warn('[AuthService] Could not parse logout response (not critical)');
    }
  } catch (error) {
    console.warn('[AuthService] Logout API call failed (not critical):', error);
  }

  // Always clear local auth after attempting API call
  clearLocalAuth();

  // Always return success - logout is complete once local storage is cleared
  return {
    success: true,
    data: {},
    message: 'Logged out successfully',
  };
};

/**
 * Get current user info
 * GET /auth/me
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  console.log('[AuthService] Fetching current user');

  return await apiGet<User>(AUTH_ENDPOINTS.ME);
};

/**
 * Resend OTP
 * POST /auth/otp/resend
 */
export const resendOTP = async (email: string): Promise<ApiResponse<any>> => {
  console.log('[AuthService] Resending OTP to:', email);

  return await apiPost(
    AUTH_ENDPOINTS.OTP_RESEND,
    { email, type: OTPType.EMAIL_VERIFICATION },
    { skipAuth: true }
  );
};