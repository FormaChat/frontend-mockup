/**
 * ========================================
 * CHAT TYPE DEFINITIONS
 * ========================================
 * 
 * TypeScript interfaces for chat-related data structures.
 * Matches the Chat Service API responses.
 */

/**
 * Session Status
 */
export type SessionStatus = 'active' | 'ended' | 'abandoned';

/**
 * Message Role
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Intent Type
 */
export type IntentType = 'enquiry' | 'booking' | 'purchase' | 'support';

/**
 * Lead Status
 */
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'spam';

/**
 * Contact Information (captured from chat)
 */
export interface ContactInfo {
  captured: boolean;
  email?: string;
  phone?: string;
  name?: string;
  capturedAt?: Date;
  capturedInMessageId?: string;
}

/**
 * Intent Detection
 */
export interface Intent {
  type: IntentType;
  confidence?: number;
  detectedAt?: Date;
}

/**
 * Agent Handoff (future)
 */
export interface AgentHandoff {
  isHandedOff: boolean;
  agentType?: string;
  handOffAt?: Date;
  completedAt?: Date;
}

/**
 * Chat Session
 */
export interface ChatSession {
  sessionId: string;
  businessId: string;
  visitorId?: string;
  contact: ContactInfo;
  status: SessionStatus;
  startedAt: Date;
  lastMessageAt: Date;
  endedAt?: Date;
  messageCount: number;
  userMessageCount: number;
  botMessageCount: number;
  intent?: Intent;
  agentHandoff?: AgentHandoff;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  hasUnreadMessages: boolean;
  isStarred: boolean;
  tags: string[];
}

/**
 * Chat Message
 */
export interface ChatMessage {
  _id?: string;
  sessionId: string;
  businessId: string;
  role: MessageRole;
  content: string;
  extractedContact?: {
    email?: string;
    phone?: string;
    name?: string;
    confidence?: number;
  };
  llmModel?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  latency?: number;
  vectorsUsed?: Array<{
    chunkId: string;
    relevanceScore: number;
    sourceType: 'questionnaire' | 'document' | 'image';
  }>;
  timestamp: Date;
}

/**
 * Contact Lead
 */
export interface ContactLead {
  _id: string;
  businessId: string;
  email?: string;
  phone?: string;
  name?: string;
  firstSessionId: string;
  lastSessionId: string;
  firstContactDate: Date;
  lastContactDate: Date;
  totalSessions: number;
  totalMessages: number;
  status: LeadStatus;
  leadScore?: number;
  tags: string[];
  notes?: string;
  firstSource?: string;
  capturedIntent?: string;
  isStarred: boolean;
  assignedTo?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Session Request
 */
export interface CreateSessionRequest {
  businessId: string;
  visitorId?: string;
}

/**
 * Create Session Response
 */
export interface CreateSessionResponse {
  sessionId: string;
  visitorId: string;
  businessInfo: {
    businessName: string;
    chatbotGreeting?: string;
    chatbotTone: string;
  };
}

/**
 * Send Message Request
 */
export interface SendMessageRequest {
  message: string;
}

/**
 * Send Message Response
 */
export interface SendMessageResponse {
  message: ChatMessage;
  contactCaptured: boolean;
}

/**
 * Get Messages Response
 */
export interface GetMessagesResponse {
  messages: ChatMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Session List Response
 */
export interface SessionListResponse {
  sessions: ChatSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Lead List Response
 */
export interface LeadListResponse {
  leads: ContactLead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Session Details Response
 */
export interface SessionDetailsResponse {
  session: ChatSession;
  messages: ChatMessage[];
}

/**
 * Session Filters (for business owner dashboard)
 */
export interface SessionFilters {
  status?: SessionStatus;
  contactCaptured?: boolean;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Lead Filters (for business owner dashboard)
 */
export interface LeadFilters {
  status?: LeadStatus;
  startDate?: Date;
  endDate?: Date;
}