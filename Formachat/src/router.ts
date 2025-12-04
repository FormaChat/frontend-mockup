/**
 * ========================================
 * CLIENT-SIDE HASH ROUTER
 * ========================================
 * 
 * Handles navigation between pages using hash-based routing.
 * 
 * Routes:
 * PUBLIC:
 * - #/ or #/home → Landing page
 * - #/login → Login page
 * - #/register → Register page
 * - #/verify-email → Email verification
 * 
 * PROTECTED (Dashboard):
 * - #/dashboard → Dashboard home
 * - #/dashboard/businesses → List businesses
 * - #/dashboard/businesses/create → Create business
 * - #/dashboard/businesses/:id/edit → Edit business
 * - #/dashboard/channels → Channels selector (all businesses)
 * - #/dashboard/channels/:id → Channels detail (specific business)
 * - #/dashboard/analytics → Analytics selector (all businesses)
 * - #/dashboard/analytics/:id → Analytics detail (specific business)
 */

import { isAuthenticated } from './utils/auth.utils';
import { renderTo } from './utils/dom.utils';

// Import public pages
import { renderHome } from './pages/public/home';
import { renderLogin } from './pages/public/login';
import { renderRegister } from './pages/public/register';
import { renderVerifyEmail } from './pages/public/verify-email';

// Import dashboard pages
import { renderDashboardLayout } from './pages/dashboard/layout';
import { renderDashboardHome } from './pages/dashboard/home';

// Import business pages
import { renderBusinessList } from './pages/dashboard/businesses/list';
import { renderBusinessCreate } from './pages/dashboard/businesses/create';
import { renderBusinessEdit } from './pages/dashboard/businesses/edit';

// Import channels pages
import { renderChannelsIndex } from './pages/dashboard/channels/index';
import { renderChannelsDetail } from './pages/dashboard/channels/detail';

// Import analytics pages
import { renderAnalyticsIndex } from './pages/dashboard/analytics/index';
import { renderAnalyticsDetail } from './pages/dashboard/analytics/detail';

// Chat widget
import { renderChatWidget } from './pages/public/chat-widget';

// Route definition type
type RouteHandler = () => void | Promise<void>;

interface Route {
  path: string;
  handler: RouteHandler;
  isProtected: boolean;
}

class Router {
  private routes: Route[] = [];

  /**
   * Register a public route
   */
  public route(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler, isProtected: false });
  }

  /**
   * Register a protected route (requires authentication)
   */
  public protectedRoute(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler, isProtected: true });
  }

  /**
   * Navigate to a path programmatically
   */
  public navigate(path: string): void {
    window.location.hash = path;
  }

  /**
   * Get current path from hash
   */
  private getCurrentPath(): string {
    return window.location.hash.slice(1) || '/';
  }

  /**
   * Extract route params from path
   * Example: /dashboard/businesses/123/edit -> { id: '123' }
   */
  private extractParams(routePath: string, actualPath: string): Record<string, string> | null {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }

    return params;
  }

  /**
   * Find matching route for current path
   */
  private findRoute(path: string): { route: Route; params: Record<string, string> } | null {
    for (const route of this.routes) {
      const params = this.extractParams(route.path, path);
      if (params !== null) {
        return { route, params };
      }
    }
    return null;
  }

  /**
   * Handle route change
   */
  private async handleRoute(): Promise<void> {
    const path = this.getCurrentPath();

    console.log('[Router] Navigating to:', path);

    const match = this.findRoute(path);

    if (!match) {
      console.warn('[Router] No route found for:', path);
      this.navigate('/');
      return;
    }

    const { route, params } = match;

    // Check authentication for protected routes
    if (route.isProtected && !isAuthenticated()) {
      console.warn('[Router] Unauthorized access to:', path);
      this.navigate('/login');
      return;
    }

    // Store params in global object for handlers to access
    (window as any).routeParams = params;

    // Execute route handler
    try {
      await route.handler();
    } catch (error) {
      console.error('[Router] Route handler error:', error);
      alert('An error occurred. Please try again.');
    }
  }

  /**
   * Initialize router - start listening to hash changes
   */
  public init(): void {
    // Register all routes
    this.registerRoutes();

    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());

    // Handle initial load
    this.handleRoute();

    console.log('[Router] Initialized with', this.routes.length, 'routes');
  }

  /**
   * Register all application routes
   */
  private registerRoutes(): void {
    const appRoot = document.getElementById('app');
    if (!appRoot) throw new Error('App root element not found');

    // ========================================
    // PUBLIC ROUTES
    // ========================================

    this.route('/', () => {
      const content = renderHome();
      renderTo(appRoot, content);
    });

    this.route('/home', () => {
      const content = renderHome();
      renderTo(appRoot, content);
    });

    this.route('/login', () => {
      const content = renderLogin();
      renderTo(appRoot, content);
    });

    this.route('/register', () => {
      const content = renderRegister();
      renderTo(appRoot, content);
    });

    this.route('/verify-email', () => {
      const content = renderVerifyEmail();
      renderTo(appRoot, content);
    });

    this.route('/chat/:businessId', async () => {
      const params = this.getParams();
      console.log('[Router] Loading chat widget for business:', params.businessId);
      
      try {
        const content = await renderChatWidget(params.businessId);
        renderTo(appRoot, content);
      } catch (error) {
        console.error('[Router] Chat widget failed to load:', error);
        
        // Show error in UI
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 20px;
        `;
        errorDiv.innerHTML = `
          <div>
            <h1 style="font-size: 48px; margin-bottom: 20px;">❌</h1>
            <h2 style="margin-bottom: 10px;">Failed to Load Chat</h2>
            <p style="opacity: 0.9;">${error instanceof Error ? error.message : 'Unknown error occurred'}</p>
            <button onclick="window.location.reload()" 
              style="margin-top: 20px; padding: 10px 20px; background: white; 
              color: #667eea; border: none; border-radius: 5px; cursor: pointer; 
              font-weight: 600;">
              Retry
            </button>
          </div>
        `;
        renderTo(appRoot, errorDiv);
      }
    });

    // ========================================
    // PROTECTED ROUTES - DASHBOARD
    // ========================================

    // Dashboard Home
    this.protectedRoute('/dashboard', async () => {
      const homeContent = renderDashboardHome();
      const layout = renderDashboardLayout(homeContent);
      renderTo(appRoot, layout);
    });

    // ========================================
    // BUSINESSES ROUTES
    // ========================================

    // List all businesses
    this.protectedRoute('/dashboard/businesses', async () => {
      const content = await renderBusinessList();
      const layout = renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Create new business
    this.protectedRoute('/dashboard/businesses/create', async () => {
      const content = await renderBusinessCreate();
      const layout = renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Edit business
    this.protectedRoute('/dashboard/businesses/:id/edit', async () => {
      const params = this.getParams();
      const content = await renderBusinessEdit(params.id);
      const layout = renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // ========================================
    // CHANNELS ROUTES
    // ========================================

    // Channels index (selector)
    this.protectedRoute('/dashboard/channels', async () => {
      const content = await renderChannelsIndex();
      const layout = renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Channels detail (specific business)
    this.protectedRoute('/dashboard/channels/:id', async () => {
      const params = this.getParams();
      const content = await renderChannelsDetail(params.id);
      const layout = renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // ========================================
    // ANALYTICS ROUTES
    // ========================================

    // Analytics index (selector)
    this.protectedRoute('/dashboard/analytics', async () => {
      const content = await renderAnalyticsIndex();
      const layout = renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Analytics detail (specific business)
    this.protectedRoute('/dashboard/analytics/:id', async () => {
      const params = this.getParams();
      const content = await renderAnalyticsDetail(params.id);
      const layout = renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });
  }

  /**
   * Get current route params
   */
  public getParams(): Record<string, string> {
    return (window as any).routeParams || {};
  }

  /**
   * Go back in history
   */
  public back(): void {
    window.history.back();
  }
}

// Export singleton instance
export const router = new Router();

/**
 * Helper function to get route params in handlers
 */
export const getRouteParams = (): Record<string, string> => {
  return router.getParams();
};