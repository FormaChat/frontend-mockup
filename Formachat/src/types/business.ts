// # Interfaces for Business, Questionnaire, etc.
/**
 * ========================================
 * BUSINESS TYPE DEFINITIONS
 * ========================================
 * 
 * TypeScript interfaces for business-related data structures.
 * Matches the Business Service API responses.
 */

/**
 * Business Types (dropdown options)
 */
export type BusinessType = 
  | 'E-commerce' 
  | 'Real Estate' 
  | 'Restaurant' 
  | 'Hotel'
  | 'Service-based' 
  | 'Tech/SaaS' 
  | 'Healthcare' 
  | 'Education' 
  | 'Other';

/**
 * Service Delivery Options (multi-select)
 */
export type ServiceDeliveryType = 
  | 'Delivery' 
  | 'Pickup' 
  | 'In-person' 
  | 'Online/Virtual';

/**
 * Chatbot Tone Options (dropdown)
 */
export type ChatbotTone = 
  | 'Friendly' 
  | 'Professional' 
  | 'Casual' 
  | 'Formal' 
  | 'Playful';

/**
 * Contact Method Types (dropdown)
 */
export type ContactMethodType = 
  | 'Email' 
  | 'Phone' 
  | 'WhatsApp' 
  | 'Live Chat' 
  | 'Social Media';

/**
 * Chatbot Capabilities (multi-select)
 */
export type ChatbotCapabilityType = 
  | 'Answer FAQs' 
  | 'Book appointments' 
  | 'Generate leads' 
  | 'Handle Complaints' 
  | 'Provide product info'
  | 'Process orders';

/**
 * Vector Status
 */
export type VectorStatus = 'pending' | 'completed' | 'failed' | 'frozen';

/**
 * Basic Info Section
 */
export interface BasicInfo {
  businessName: string;
  businessDescription: string;
  businessType: BusinessType;
  operatingHours: string;
  location: string;
  timezone?: string;
}

/**
 * Popular Item
 */
export interface PopularItem {
  name: string;
  description?: string;
  price?: number;
}

/**
 * Pricing Display Settings
 */
export interface PricingDisplay {
  canDiscussPricing: boolean;
  pricingNote?: string;
}

/**
 * Products/Services Section
 */
export interface ProductsServices {
  offerings: string;
  popularItems: PopularItem[];
  serviceDelivery: ServiceDeliveryType[];
  pricingDisplay?: PricingDisplay;
}

/**
 * FAQ Item
 */
export interface FAQ {
  question: string;
  answer: string;
}

/**
 * Policies
 */
export interface Policies {
  refundPolicy: string;
  cancellationPolicy?: string;
  importantPolicies?: string;
}

/**
 * Customer Support Section
 */
export interface CustomerSupport {
  faqs: FAQ[];
  policies: Policies;
  chatbotTone: ChatbotTone;
  chatbotGreeting?: string;
  chatbotRestrictions?: string;
}

/**
 * Contact Method
 */
export interface ContactMethod {
  method: ContactMethodType;
  value: string;
}

/**
 * Escalation Contact
 */
export interface EscalationContact {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Contact Escalation Section
 */
export interface ContactEscalation {
  contactMethods: ContactMethod[];
  escalationContact: EscalationContact;
  chatbotCapabilities: ChatbotCapabilityType[];
}

/**
 * File Document (PRO+ tier)
 */
export interface FileDocument {
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  fileSize: number;
}

/**
 * File Image (PRO+ tier)
 */
export interface FileImage {
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  category?: string;
}

/**
 * Files Section (PRO+ tier)
 */
export interface Files {
  documents: FileDocument[];
  images: FileImage[];
}

/**
 * Vector Info
 */
export interface VectorInfo {
  namespace: string;
  lastVectorUpdate: Date;
  vectorStatus: VectorStatus;
  needsUpdate?: boolean;
  vectorCount?: number;
  lastSyncAttempt?: Date;
  processingErrors?: {
    lastError?: string;
    lastErrorAt?: Date;
  };
}

/**
 * Freeze Info
 */
export interface FreezeInfo {
  isFrozen: boolean;
  reason?: 'trial_expired' | 'payment_failed' | 'admin_action' | 'subscription_canceled' | 'user_requested';
  frozenAt?: Date;
  frozenBy?: 'system' | 'admin';
  adminNote?: string;
  autoUnfreezeAt?: Date;
}

/**
 * Complete Business Object
 */
export interface Business {
  _id: string;
  userId: string;
  userEmail: string;
  isActive: boolean;
  freezeInfo?: FreezeInfo;
  basicInfo: BasicInfo;
  productsServices: ProductsServices;
  customerSupport: CustomerSupport;
  contactEscalation: ContactEscalation;
  files?: Files;
  vectorInfo: VectorInfo;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Business Request (all at once)
 */
export interface CreateBusinessRequest {
  basicInfo: BasicInfo;
  productsServices: ProductsServices;
  customerSupport: CustomerSupport;
  contactEscalation: ContactEscalation;
}

/**
 * Update Business Request (partial)
 */
export interface UpdateBusinessRequest {
  basicInfo?: Partial<BasicInfo>;
  productsServices?: Partial<ProductsServices>;
  customerSupport?: Partial<CustomerSupport>;
  contactEscalation?: Partial<ContactEscalation>;
}

/**
 * Business List Response
 */
export interface BusinessListResponse {
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Business Chat Config (from internal API)
 */
export interface BusinessChatConfig {
  allowed: boolean;
  config?: {
    namespace: string;
    vectorStatus: VectorStatus;
    businessName: string;
    businessDescription: string;
    chatbotTone: ChatbotTone;
    chatbotGreeting?: string;
    chatbotRestrictions?: string;
    chatbotCapabilities: ChatbotCapabilityType[];
    escalationContact: EscalationContact;
    contactMethods: ContactMethod[];
    pricingDisplay?: PricingDisplay;
  };
}