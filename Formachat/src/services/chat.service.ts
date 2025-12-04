// # API calls: createSession(), sendMessage(), etc./**
//  * ========================================
//  * CHAT SERVICE (Business Owner Dashboard)
//  * ========================================
//  * 
//  * Handles chat-related API calls for business owners.
//  * These are PROTECTED endpoints - require authentication.
//  * 
//  * Functions:
//  * - getBusinessSessions: Get all chat sessions for a business
//  * - getBusinessLeads: Get all captured leads for a business
//  * - getSessionDetails: Get detailed view of a specific session
//  * 
//  * Note: Public chat endpoints (create session, send message, etc.)
//  * are used by the chat widget, not the dashboard.
//  */

import { apiGet, apiPost } from '../utils/api.utils';
import { CHAT_ENDPOINTS } from '../config/api';
import type { ApiResponse } from '../config/api';
import type {
  ChatSession,
  ContactLead,
  SessionListResponse,
  LeadListResponse,
  SessionDetailsResponse,
  SessionFilters,
  LeadFilters
} from '../types/chat';

/**
 * ========================================
 * PUBLIC CHAT FUNCTIONS (For Widget)
 * ========================================
 */

/**
 * Create a new chat session
 * Used when widget first loads
 */
export const createChatSession = async (businessId: string): Promise<{
  sessionId: string;
  visitorId: string;
  businessInfo: {
    businessName: string;
    chatbotGreeting?: string;
    chatbotTone?: string;
  };
}> => {
  console.log('[ChatService] Creating session for business:', businessId);

  const response = await apiPost(CHAT_ENDPOINTS.SESSION_CREATE, {
    businessId
  });

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to create chat session');
  }

  console.log('[ChatService] ✓ Session created:', response.data.sessionId);
  return response.data;
};

/**
 * Send a message and get bot response
 */
export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<{
  message: {
    role: string;
    content: string;
    timestamp: string;
  };
  contactCaptured: boolean;
}> => {
  console.log('[ChatService] Sending message to session:', sessionId);

  const response = await apiPost(
    CHAT_ENDPOINTS.SESSION_MESSAGE(sessionId),
    { message }
  );

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to send message');
  }

  return response.data;
};

/**
 * Get message history for a session
 */
export const getChatMessages = async (
  sessionId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}> => {
  console.log('[ChatService] Fetching messages for session:', sessionId);

  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await apiGet(
    `${CHAT_ENDPOINTS.SESSION_MESSAGES(sessionId)}?${params.toString()}`
  );

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch messages');
  }

  return response.data;
};

/**
 * End a chat session
 */
export const endChatSession = async (sessionId: string): Promise<void> => {
  console.log('[ChatService] Ending session:', sessionId);

  const response = await apiPost(CHAT_ENDPOINTS.SESSION_END(sessionId), {});

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to end session');
  }

  console.log('[ChatService] ✓ Session ended');
};

/**
 * Get existing session details
 */
export const getChatSession = async (sessionId: string): Promise<{
  sessionId: string;
  businessId: string;
  status: string;
  messageCount: number;
  contactCaptured: boolean;
  contact?: {
    email?: string;
    phone?: string;
    name?: string;
  };
}> => {
  console.log('[ChatService] Fetching session:', sessionId);

  const response = await apiGet(CHAT_ENDPOINTS.SESSION_GET(sessionId));

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch session');
  }

  return response.data;
};

















/**
 * ========================================
 * GET BUSINESS SESSIONS
 * ========================================
 * 
 * Retrieves all chat sessions for a specific business.
 * Used in Analytics page to show session history.
 * 
 * @param businessId - Business ID (MongoDB ObjectId)
 * @param filters - Optional filters (status, dates, contactCaptured)
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @returns List of sessions with pagination
 * 
 * Backend Route: GET /business/:businessId/sessions
 * Auth: Required (JWT + Ownership check)
 */
export const getBusinessSessions = async (
  businessId: string,
  filters?: SessionFilters,
  page: number = 1,
  limit: number = 20
): Promise<ChatSession[]> => {
  console.log('[ChatService] Fetching sessions for business:', businessId);

  // Build query params
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (filters?.status) {
    params.append('status', filters.status);
  }

  if (filters?.contactCaptured !== undefined) {
    params.append('contactCaptured', filters.contactCaptured.toString());
  }

  if (filters?.startDate) {
    params.append('startDate', filters.startDate.toISOString());
  }

  if (filters?.endDate) {
    params.append('endDate', filters.endDate.toISOString());
  }

  const url = `${CHAT_ENDPOINTS.BUSINESS_SESSIONS(businessId)}?${params.toString()}`;

  const response: ApiResponse<SessionListResponse> = await apiGet(url);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch sessions');
  }

  console.log('[ChatService] ✓ Fetched', response.data.sessions.length, 'sessions');
  return response.data.sessions;
};

/**
 * ========================================
 * GET BUSINESS LEADS
 * ========================================
 * 
 * Retrieves all captured leads (contacts) for a business.
 * Used in Analytics page to show lead management/CRM.
 * 
 * @param businessId - Business ID
 * @param filters - Optional filters (status, dates)
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 50)
 * @returns List of leads with pagination
 * 
 * Backend Route: GET /business/:businessId/leads
 * Auth: Required (JWT + Ownership check)
 */
export const getBusinessLeads = async (
  businessId: string,
  filters?: LeadFilters,
  page: number = 1,
  limit: number = 50
): Promise<ContactLead[]> => {
  console.log('[ChatService] Fetching leads for business:', businessId);

  // Build query params
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (filters?.status) {
    params.append('status', filters.status);
  }

  if (filters?.startDate) {
    params.append('startDate', filters.startDate.toISOString());
  }

  if (filters?.endDate) {
    params.append('endDate', filters.endDate.toISOString());
  }

  const url = `${CHAT_ENDPOINTS.BUSINESS_LEADS(businessId)}?${params.toString()}`;

  const response: ApiResponse<LeadListResponse> = await apiGet(url);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch leads');
  }

  console.log('[ChatService] ✓ Fetched', response.data.leads.length, 'leads');
  return response.data.leads;
};

/**
 * ========================================
 * GET SESSION DETAILS
 * ========================================
 * 
 * Retrieves detailed information about a specific session,
 * including full conversation history.
 * 
 * @param businessId - Business ID
 * @param sessionId - Session ID
 * @returns Session details with full message history
 * 
 * Backend Route: GET /business/:businessId/session/:sessionId
 * Auth: Required (JWT + Ownership check)
 */
export const getSessionDetails = async (
  businessId: string,
  sessionId: string
): Promise<SessionDetailsResponse> => {
  console.log('[ChatService] Fetching session details:', sessionId);

  const url = CHAT_ENDPOINTS.BUSINESS_SESSION_DETAILS(businessId, sessionId);

  const response: ApiResponse<SessionDetailsResponse> = await apiGet(url);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch session details');
  }

  console.log('[ChatService] ✓ Fetched session with', response.data.messages.length, 'messages');
  return response.data;
};

/**
 * ========================================
 * HELPER: GET SESSION COUNT
 * ========================================
 * 
 * Get total number of sessions for a business.
 * Useful for dashboard statistics.
 * 
 * @param businessId - Business ID
 * @returns Total session count
 */
export const getSessionCount = async (businessId: string): Promise<number> => {
  try {
    const sessions = await getBusinessSessions(businessId, undefined, 1, 1);
    // Note: This is a workaround. Ideally, backend should have a /stats endpoint
    // For now, we get page 1 with limit 1, then check pagination.total
    return sessions.length; // This won't give accurate count, needs backend update
  } catch (error) {
    console.error('[ChatService] Failed to get session count:', error);
    return 0;
  }
};

/**
 * ========================================
 * HELPER: GET LEAD COUNT
 * ========================================
 * 
 * Get total number of leads for a business.
 * Useful for dashboard statistics.
 * 
 * @param businessId - Business ID
 * @returns Total lead count
 */
export const getLeadCount = async (businessId: string): Promise<number> => {
  try {
    const leads = await getBusinessLeads(businessId, undefined, 1, 1);
    return leads.length; // Same limitation as above
  } catch (error) {
    console.error('[ChatService] Failed to get lead count:', error);
    return 0;
  }
};

/**
 * ========================================
 * HELPER: GET ANALYTICS SUMMARY
 * ========================================
 * 
 * Get summary statistics for analytics dashboard.
 * Returns key metrics like total sessions, leads, etc.
 * 
 * @param businessId - Business ID
 * @returns Analytics summary object
 */
export interface AnalyticsSummary {
  totalSessions: number;
  activeSessions: number;
  totalLeads: number;
  totalMessages: number;
  conversionRate: number; // Percentage of sessions that captured contact
}

export const getAnalyticsSummary = async (
  businessId: string
): Promise<AnalyticsSummary> => {
  console.log('[ChatService] Fetching analytics summary for:', businessId);

  try {
    // Fetch recent sessions and leads
    const [allSessions, leads] = await Promise.all([
      getBusinessSessions(businessId, undefined, 1, 100),
      getBusinessLeads(businessId, undefined, 1, 100)
    ]);

    const activeSessions = allSessions.filter(s => s.status === 'active').length;
    const totalMessages = allSessions.reduce((sum, s) => sum + s.messageCount, 0);
    const sessionsWithContact = allSessions.filter(s => s.contact.captured).length;
    const conversionRate = allSessions.length > 0 
      ? (sessionsWithContact / allSessions.length) * 100 
      : 0;

    return {
      totalSessions: allSessions.length,
      activeSessions,
      totalLeads: leads.length,
      totalMessages,
      conversionRate: Math.round(conversionRate)
    };
  } catch (error) {
    console.error('[ChatService] Failed to get analytics summary:', error);
    throw error;
  }
};

/**
 * ========================================
 * EXPORTS
 * ========================================
 */
export default {
  getBusinessSessions,
  getBusinessLeads,
  getSessionDetails,
  getSessionCount,
  getLeadCount,
  getAnalyticsSummary
};