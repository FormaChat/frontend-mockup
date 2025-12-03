/**
 * ========================================
 * API CONFIGURATION
 * ========================================
 * 
 * Centralized configuration for all microservice endpoints.
 * 
 * Services:
 * - Auth Service: User authentication, registration, token management
 * - Business Service: Business CRUD operations
 * - Chat Service: Chat sessions, messages, leads, analytics
 * 
 * Environment:
 * - Production: Uses deployed Render URLs
 * - Development: Can override with localhost (future)
 */

// Base URLs for each microservice
export const API_BASE_URLS = {
  AUTH: 'https://formachat-app-backend.onrender.com/api/v1/auth',
  BUSINESS: 'https://formachat-business.onrender.com/api/v1',
  CHAT: 'https://formachat-chat.onrender.com/api/chat',
} as const;

/**
 * Auth Service Endpoints
 */
export const AUTH_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URLS.AUTH}/register`,
  LOGIN: `${API_BASE_URLS.AUTH}/login`,
  LOGOUT: `${API_BASE_URLS.AUTH}/logout`,
  ME: `${API_BASE_URLS.AUTH}/me`,
  
  // Email Verification
  VERIFY_EMAIL: `${API_BASE_URLS.AUTH}/verify-email`,
  
  // OTP
  OTP_GENERATE: `${API_BASE_URLS.AUTH}/otp/generate`,
  OTP_VERIFY: `${API_BASE_URLS.AUTH}/otp/verify`,
  OTP_RESEND: `${API_BASE_URLS.AUTH}/otp/resend`,
  
  // Password Management
  PASSWORD_CHANGE: `${API_BASE_URLS.AUTH}/password/change`,
  PASSWORD_RESET: `${API_BASE_URLS.AUTH}/password/reset`,
  PASSWORD_RESET_CONFIRM: `${API_BASE_URLS.AUTH}/password/reset/confirm`,
  PASSWORD_VALIDATE: `${API_BASE_URLS.AUTH}/password/validate`,
  
  // Token Management
  TOKEN_REFRESH: `${API_BASE_URLS.AUTH}/token/refresh`,
  TOKEN_REVOKE_OTHERS: `${API_BASE_URLS.AUTH}/token/revoke-others`,
  
  // User Profile
  PROFILE: `${API_BASE_URLS.AUTH}/profile`,
  SESSIONS: `${API_BASE_URLS.AUTH}/sessions`,
  
  // Health
  HEALTH: `${API_BASE_URLS.AUTH}/health`,
} as const;

/**
 * Business Service Endpoints
 */
export const BUSINESS_ENDPOINTS = {
  // Business CRUD
  CREATE: `${API_BASE_URLS.BUSINESS}/businesses`,
  LIST: `${API_BASE_URLS.BUSINESS}/businesses`,
  DETAILS: (id: string) => `${API_BASE_URLS.BUSINESS}/businesses/${id}`,
  UPDATE: (id: string) => `${API_BASE_URLS.BUSINESS}/businesses/${id}`,
  DELETE: (id: string) => `${API_BASE_URLS.BUSINESS}/businesses/${id}`,
  
  // Admin (if needed in future)
  ADMIN_LIST: `${API_BASE_URLS.BUSINESS}/admin/businesses`,
  ADMIN_DETAILS: (id: string) => `${API_BASE_URLS.BUSINESS}/admin/businesses/${id}`,
  ADMIN_STATUS: (id: string) => `${API_BASE_URLS.BUSINESS}/admin/businesses/${id}/status`,
  ADMIN_ANALYTICS: `${API_BASE_URLS.BUSINESS}/admin/analytics`,
  ADMIN_FROZEN: `${API_BASE_URLS.BUSINESS}/admin/frozen-businesses`,
} as const;

/**
 * Chat Service Endpoints
 */
export const CHAT_ENDPOINTS = {
  // Public Chat (for end users - widget)
  SESSION_CREATE: `${API_BASE_URLS.CHAT}/session/create`,
  SESSION_GET: (sessionId: string) => `${API_BASE_URLS.CHAT}/session/${sessionId}`,
  SESSION_MESSAGE: (sessionId: string) => `${API_BASE_URLS.CHAT}/session/${sessionId}/message`,
  SESSION_MESSAGES: (sessionId: string) => `${API_BASE_URLS.CHAT}/session/${sessionId}/messages`,
  SESSION_END: (sessionId: string) => `${API_BASE_URLS.CHAT}/session/${sessionId}/end`,
  
  // Business Owner Dashboard
  BUSINESS_SESSIONS: (businessId: string) => `${API_BASE_URLS.CHAT}/business/${businessId}/sessions`,
  BUSINESS_LEADS: (businessId: string) => `${API_BASE_URLS.CHAT}/business/${businessId}/leads`,
  BUSINESS_SESSION_DETAILS: (businessId: string, sessionId: string) => 
    `${API_BASE_URLS.CHAT}/business/${businessId}/session/${sessionId}`,
  
  // Health
  HEALTH: `${API_BASE_URLS.CHAT}/health`,
} as const;

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

/**
 * Request timeout (30 seconds)
 */
export const REQUEST_TIMEOUT = 30000;

/**
 * API Response Types
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Helper to check if response is error
 */
export const isApiError = (response: ApiResponse): response is ApiErrorResponse => {
  return !response.success;
};

/**
 * Helper to check if response is success
 */
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> => {
  return response.success === true;
};