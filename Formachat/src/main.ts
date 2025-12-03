/**
 * ========================================
 * MAIN ENTRY POINT
 * ========================================
 * 
 * Initializes the FormaChat application.
 * 
 * The router handles all route registration internally.
 * This file simply:
 * 1. Imports styles
 * 2. Initializes the router
 * 3. App is ready!
 */

import './style.css';
import { router } from './router';

console.log('[App] Initializing FormaChat Frontend...');

/**
 * Initialize Router
 * 
 * The router will:
 * - Register all public routes (home, login, register, verify-email)
 * - Register all protected routes (dashboard, businesses, channels, analytics)
 * - Start listening to hash changes
 * - Handle the initial route
 */
router.init();

console.log('[App] Router initialized. App is ready!');

/**
 * Optional: Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('[App] Global error:', event.error);
});

/**
 * Optional: Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('[App] Unhandled promise rejection:', event.reason);
});