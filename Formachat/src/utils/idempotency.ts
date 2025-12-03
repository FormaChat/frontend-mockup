/**
 * ========================================
 * IDEMPOTENCY KEY GENERATOR
 * ========================================
 * 
 * Generates unique idempotency keys for API requests.
 * Prevents duplicate requests from being processed multiple times.
 * 
 * Format: idmp_<timestamp>_<random>
 * Example: idmp_1764625114383_abc123xyz
 */

/**
 * Generate a random string
 */
const generateRandomString = (length: number = 10): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Generate idempotency key
 * Format: idmp_<timestamp>_<random>
 */
export const generateIdempotencyKey = (): string => {
  const timestamp = Date.now();
  const random = generateRandomString(10);
  
  return `idmp_${timestamp}_${random}`;
};

/**
 * Store used idempotency keys to prevent reuse in same session
 * (Optional - for extra safety)
 */
const usedKeys = new Set<string>();

/**
 * Generate unique idempotency key (guaranteed not to repeat in session)
 */
export const generateUniqueIdempotencyKey = (): string => {
  let key = generateIdempotencyKey();
  
  // Ensure uniqueness within session
  while (usedKeys.has(key)) {
    key = generateIdempotencyKey();
  }
  
  usedKeys.add(key);
  
  return key;
};