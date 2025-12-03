/**
 * ========================================
 * API FETCH WRAPPER
 * ========================================
 * 
 * Centralized fetch wrapper that:
 * - Automatically adds JWT token to requests
 * - Handles token refresh on 401 errors
 * - Provides consistent error handling
 * - Supports all HTTP methods
 * 
 * Usage:
 * const response = await apiFetch('/api/businesses', { method: 'GET' });
 * 
 * Auto-refresh logic:
 * 1. Request fails with 401
 * 2. Automatically call /token/refresh
 * 3. Retry original request with new token
 * 4. If refresh fails, logout and redirect to login
 */

import { getAccessToken, getRefreshToken, saveTokens, logout } from './auth.utils';
import { AUTH_ENDPOINTS } from '../config/api';
import type { ApiResponse } from '../config/api';
import { generateUniqueIdempotencyKey } from './idempotency';

/**
 * Fetch options with automatic auth header
 */
interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean; // Set true for public endpoints (login, register)
  skipIdempotency?: boolean; // Set true for GET requests (don't need idempotency)
}

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.warn('[API] No refresh token available');
      return false;
    }

    console.log('[API] Refreshing access token...');

    const response = await fetch(AUTH_ENDPOINTS.TOKEN_REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    let data: ApiResponse;
    try {
      data = await response.json();
    } catch {
      console.error('[API] Invalid JSON from token refresh');
      return false;
    }

    if (!data.success) {
      console.error('[API] Token refresh failed:', data.error);
      return false;
    }

    // Save new tokens
    saveTokens({
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken || refreshToken,
    });

    console.log('[API] Access token refreshed successfully');
    return true;
  } catch (error) {
    console.error('[API] Token refresh error:', error);
    return false;
  }
};

/**
 * Main fetch wrapper
 */
export const apiFetch = async <T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> => {
  const { skipAuth = false, skipIdempotency = false, ...fetchOptions } = options;

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers
  if (fetchOptions.headers) {
    Object.entries(fetchOptions.headers as Record<string, string>).forEach(([key, value]) => {
      headers[key] = value;
    });
  }

  // Add Authorization header if not skipped
  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  // Add Idempotency-Key for POST/PUT/PATCH/DELETE requests
  const method = (fetchOptions.method || 'GET').toUpperCase();
  const needsIdempotency = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  
  if (needsIdempotency && !skipIdempotency) {
    const idempotencyKey = generateUniqueIdempotencyKey();
    // Send with X- prefix to match backend expectation
    headers['X-Idempotency-Key'] = idempotencyKey;
    console.log('[API] Added X-Idempotency-Key:', idempotencyKey);
  }

  try {
    // Log the request for debugging
    console.log('[API] Making request:', {
      url,
      method: fetchOptions.method || 'GET',
      headers: { ...headers }, // Log all headers
      hasBody: !!fetchOptions.body
    });

    // Make initial request
    let response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && !skipAuth) {
      console.warn('[API] 401 Unauthorized - attempting token refresh');

      const refreshed = await refreshAccessToken();

      if (!refreshed) {
        console.error('[API] Token refresh failed - logging out');
        logout();
        window.location.hash = '/login';
        
        return {
          success: false,
          error: {
            code: 'AUTHENTICATION_FAILED',
            message: 'Session expired. Please login again.',
          },
        };
      }

      // Retry original request with new token
      const newAccessToken = getAccessToken();
      if (newAccessToken) {
        headers['Authorization'] = `Bearer ${newAccessToken}`;
      }

      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    }

    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!isJson) {
      console.error('[API] Non-JSON response received:', {
        url,
        status: response.status,
        contentType,
      });

      // Try to get HTML error message for debugging
      const text = await response.text();
      console.error('[API] HTML Response:', text.substring(0, 500));

      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: `Server returned HTML instead of JSON (Status: ${response.status}). This usually means the endpoint doesn't exist or there's a server error.`,
        },
      };
    }

    // Parse JSON response
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch (error) {
      console.error('[API] Failed to parse JSON:', error);
      
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse server response',
        },
      };
    }

    // Log errors for debugging
    if (!data.success) {
      console.error('[API] Request failed:', {
        url,
        status: response.status,
        error: data.error,
      });
    }

    return data;
  } catch (error) {
    console.error('[API] Fetch error:', error);
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      },
    };
  }
};

/**
 * Convenience methods for different HTTP verbs
 */

export const apiGet = <T = any>(url: string, options: ApiFetchOptions = {}): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, { ...options, method: 'GET', skipIdempotency: true }); // GET doesn't need idempotency
};

export const apiPost = <T = any>(
  url: string,
  body: any,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const apiPut = <T = any>(
  url: string,
  body: any,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const apiPatch = <T = any>(
  url: string,
  body: any,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const apiDelete = <T = any>(url: string, options: ApiFetchOptions = {}): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, { ...options, method: 'DELETE' });
};