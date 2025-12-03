/**
 * ========================================
 * BUSINESS SERVICE
 * ========================================
 * 
 * Handles all business-related API calls.
 * 
 * Functions:
 * - createBusiness: Create new business
 * - getBusinesses: Get all user's businesses (paginated)
 * - getBusinessById: Get specific business details
 * - updateBusiness: Update existing business
 * - deleteBusiness: Delete business
 * 
 * All functions use the centralized API utilities with automatic:
 * - JWT token attachment
 * - Token refresh on 401
 * - Error handling
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api.utils';
import { BUSINESS_ENDPOINTS } from '../config/api';
import type {
  Business,
  CreateBusinessRequest,
  UpdateBusinessRequest,
  BusinessListResponse
} from '../types/business';
import type { ApiResponse } from '../config/api';

/**
 * ========================================
 * CREATE BUSINESS
 * ========================================
 * 
 * Creates a new business for the authenticated user.
 * 
 * @param businessData - Complete business data (basicInfo, productsServices, customerSupport, contactEscalation)
 * @returns Created business object
 * 
 * Backend Route: POST /businesses
 * Auth: Required (JWT)
 */
export const createBusiness = async (
  businessData: CreateBusinessRequest
): Promise<Business> => {
  console.log('[BusinessService] Creating business...');

  const response: ApiResponse<Business> = await apiPost(
    BUSINESS_ENDPOINTS.CREATE,
    businessData
  );

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to create business');
  }

  console.log('[BusinessService] ✓ Business created:', response.data._id);
  return response.data;
};

/**
 * ========================================
 * GET USER BUSINESSES (PAGINATED)
 * ========================================
 * 
 * Retrieves all businesses owned by the authenticated user.
 * 
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns List of businesses with pagination info
 * 
 * Backend Route: GET /businesses?page=1&limit=10
 * Auth: Required (JWT)
 */
export const getBusinesses = async (
  page: number = 1,
  limit: number = 10
): Promise<Business[]> => {
  console.log('[BusinessService] Fetching businesses...');

  const url = `${BUSINESS_ENDPOINTS.LIST}?page=${page}&limit=${limit}`;

  const response: ApiResponse<BusinessListResponse> = await apiGet(url);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch businesses');
  }

  console.log('[BusinessService] ✓ Fetched', response.data.businesses.length, 'businesses');
  return response.data.businesses;
};

/**
 * ========================================
 * GET BUSINESS BY ID
 * ========================================
 * 
 * Retrieves full details of a specific business.
 * 
 * @param businessId - Business ID (MongoDB ObjectId)
 * @returns Complete business object
 * 
 * Backend Route: GET /businesses/:id
 * Auth: Required (JWT + Ownership check)
 */
export const getBusinessById = async (businessId: string): Promise<Business> => {
  console.log('[BusinessService] Fetching business:', businessId);

  const response: ApiResponse<Business> = await apiGet(
    BUSINESS_ENDPOINTS.DETAILS(businessId)
  );

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch business details');
  }

  console.log('[BusinessService] ✓ Fetched business:', response.data.basicInfo.businessName);
  return response.data;
};

/**
 * ========================================
 * UPDATE BUSINESS
 * ========================================
 * 
 * Updates an existing business (partial update supported).
 * 
 * @param businessId - Business ID
 * @param updateData - Partial business data to update
 * @returns Updated business object
 * 
 * Backend Route: PUT /businesses/:id
 * Auth: Required (JWT + Ownership + Active check)
 */
export const updateBusiness = async (
  businessId: string,
  updateData: UpdateBusinessRequest
): Promise<Business> => {
  console.log('[BusinessService] Updating business:', businessId);

  const response: ApiResponse<Business> = await apiPut(
    BUSINESS_ENDPOINTS.UPDATE(businessId),
    updateData
  );

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to update business');
  }

  console.log('[BusinessService] ✓ Business updated:', response.data._id);
  return response.data;
};

/**
 * ========================================
 * DELETE BUSINESS
 * ========================================
 * 
 * Permanently deletes a business.
 * 
 * @param businessId - Business ID
 * @returns Success message
 * 
 * Backend Route: DELETE /businesses/:id
 * Auth: Required (JWT + Ownership check)
 */
export const deleteBusiness = async (businessId: string): Promise<{ message: string }> => {
  console.log('[BusinessService] Deleting business:', businessId);

  const response: ApiResponse<{ message: string; businessId: string }> = await apiDelete(
    BUSINESS_ENDPOINTS.DELETE(businessId)
  );

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to delete business');
  }

  console.log('[BusinessService] ✓ Business deleted:', businessId);
  return { message: response.data.message };
};

/**
 * ========================================
 * HELPER: CHECK IF BUSINESS EXISTS
 * ========================================
 * 
 * Checks if a business exists and user has access to it.
 * 
 * @param businessId - Business ID
 * @returns true if exists, false otherwise
 */
export const businessExists = async (businessId: string): Promise<boolean> => {
  try {
    await getBusinessById(businessId);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * ========================================
 * HELPER: GET BUSINESS NAME ONLY
 * ========================================
 * 
 * Retrieves just the business name (useful for breadcrumbs).
 * 
 * @param businessId - Business ID
 * @returns Business name
 */
export const getBusinessName = async (businessId: string): Promise<string> => {
  const business = await getBusinessById(businessId);
  return business.basicInfo.businessName;
};

/**
 * ========================================
 * EXPORTS
 * ========================================
 */
export default {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  businessExists,
  getBusinessName
};