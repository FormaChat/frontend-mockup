/**
 * ========================================
 * AUTH UTILITIES
 * ========================================
 * 
 * Handles JWT token storage, retrieval, and validation.
 * 
 * Storage Strategy:
 * - Uses localStorage for persistence
 * - Stores both access and refresh tokens
 * - Provides helpers to check authentication status
 * 
 * Token Structure:
 * {
 *   accessToken: "eyJhbGc...",
 *   refreshToken: "eyJhbGc..."
 * }
 */

import type { AuthTokens, User } from '../types/auth';

// LocalStorage keys
const TOKEN_KEY = 'formachat_tokens';
const USER_KEY = 'formachat_user';

/**
 * Save auth tokens to localStorage
 */
export const saveTokens = (tokens: AuthTokens): void => {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    console.log('[Auth] Tokens saved');
  } catch (error) {
    console.error('[Auth] Failed to save tokens:', error);
  }
};

/**
 * Get auth tokens from localStorage
 */
export const getTokens = (): AuthTokens | null => {
  try {
    const tokensJson = localStorage.getItem(TOKEN_KEY);
    if (!tokensJson) return null;
    
    return JSON.parse(tokensJson) as AuthTokens;
  } catch (error) {
    console.error('[Auth] Failed to get tokens:', error);
    return null;
  }
};

/**
 * Get access token only
 */
export const getAccessToken = (): string | null => {
  const tokens = getTokens();
  return tokens?.accessToken || null;
};

/**
 * Get refresh token only
 */
export const getRefreshToken = (): string | null => {
  const tokens = getTokens();
  return tokens?.refreshToken || null;
};

/**
 * Delete tokens from localStorage
 */
export const deleteTokens = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log('[Auth] Tokens deleted');
  } catch (error) {
    console.error('[Auth] Failed to delete tokens:', error);
  }
};

/**
 * Save user data to localStorage
 */
export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log('[Auth] User saved');
  } catch (error) {
    console.error('[Auth] Failed to save user:', error);
  }
};

/**
 * Get user data from localStorage
 */
export const getUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('[Auth] Failed to get user:', error);
    return null;
  }
};

/**
 * Delete user data from localStorage
 */
export const deleteUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
    console.log('[Auth] User deleted');
  } catch (error) {
    console.error('[Auth] Failed to delete user:', error);
  }
};

/**
 * Check if user is authenticated
 * (has valid tokens in localStorage)
 */
export const isAuthenticated = (): boolean => {
  const tokens = getTokens();
  return tokens !== null && !!tokens.accessToken;
};

/**
 * Logout user (clear all auth data)
 */
export const logout = (): void => {
  deleteTokens();
  deleteUser();
  console.log('[Auth] User logged out');
};

/**
 * Decode JWT token (without verification)
 * Used to extract userId, email, exp from token
 */
export const decodeToken = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[Auth] Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if access token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const now = Date.now() / 1000;
  return decoded.exp < now;
};

/**
 * Get user ID from access token
 */
export const getUserIdFromToken = (): string | null => {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  const decoded = decodeToken(accessToken);
  return decoded?.userId || null;
};

/**
 * Get user email from access token
 */
export const getUserEmailFromToken = (): string | null => {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  const decoded = decodeToken(accessToken);
  return decoded?.email || null;
};