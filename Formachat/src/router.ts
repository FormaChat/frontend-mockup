import { isAuthenticated,getAccessToken, isTokenExpired, logout } from './utils/auth.utils';
import { refreshAccessToken } from './utils/api.utils';

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


type RouteHandler = () => void | Promise<void>;

interface Route {
  path: string;
  handler: RouteHandler;
  isProtected: boolean;
}

class Router {
  private routes: Route[] = [];

  // Register a public route
  
  public route(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler, isProtected: false });
  }

  // Register a protected route (requires authentication)

  public protectedRoute(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler, isProtected: true });
  }

  
  // Navigate to a path programmatically
   
  public navigate(path: string): void {
    window.location.hash = path;
  }

  
  // Get current path from hash (strips query params)
  
  private getCurrentPath(): string {
    const hash = window.location.hash.slice(1) || '/';
    
    return hash.split('?')[0];
  }

  
  // Check if current URL is in embed mode
   
  private isEmbedMode(): boolean {
    const hash = window.location.hash;
    return hash.includes('embed=true');
  }

  
  // Extract route params from path

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

  
  // Find matching route for current path
  
  private findRoute(path: string): { route: Route; params: Record<string, string> } | null {
    for (const route of this.routes) {
      const params = this.extractParams(route.path, path);
      if (params !== null) {
        return { route, params };
      }
    }
    return null;
  }

  // Handle route change
  
  private async handleRoute(): Promise<void> {
    const path = this.getCurrentPath();
    const embedMode = this.isEmbedMode();

    console.log('[Router] Navigating to:', path, embedMode ? '(EMBED MODE)' : '');

    const match = this.findRoute(path);

    if (!match) {
      console.warn('[Router] No route found for:', path);
      this.navigate('/');
      return;
    }

    const { route, params } = match;

    // Skip authentication checks if in embed mode
    if (route.isProtected && !embedMode) {
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        console.warn('[Router] Unauthorized access to:', path);
        this.navigate('/login');
        return;
      }
      
      // Try to refresh if token is expired
      const accessToken = getAccessToken();
      if (accessToken && isTokenExpired(accessToken)) {
        console.warn('[Router] Token expired, attempting refresh before route...');
        const refreshed = await refreshAccessToken();
        
        if (!refreshed) {
          console.error('[Router] Token refresh failed');
          logout();
          this.navigate('/login');
          return;
        }
      }
    }

    (window as any).routeParams = params;

    try {
      await route.handler();
    } catch (error) {
      console.error('[Router] Route handler error:', error);
      alert('An error occurred. Please try again.');
    }
  }

  public init(): void {
  
    this.registerRoutes();

    window.addEventListener('hashchange', () => this.handleRoute());

    this.handleRoute();

    console.log('[Router] Initialized with', this.routes.length, 'routes');
  }

  private registerRoutes(): void {
    const appRoot = document.getElementById('app');
    if (!appRoot) throw new Error('App root element not found');

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
      const embedMode = this.isEmbedMode();
      
      console.log('[Router] Loading chat widget for business:', params.businessId, embedMode ? '(EMBED)' : '');
      
      try {
        const content = await renderChatWidget(params.businessId, embedMode);
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

    // Dashboard Home
    this.protectedRoute('/dashboard', async () => {
      const homeContent = renderDashboardHome();
      const layout = await renderDashboardLayout(homeContent);
      renderTo(appRoot, layout);
    });

    // List all businesses
    this.protectedRoute('/dashboard/businesses', async () => {
      const content = await renderBusinessList();
      const layout = await renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Create new business
    this.protectedRoute('/dashboard/businesses/create', async () => {
      const content = await renderBusinessCreate();
      const layout = await renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Edit business
    this.protectedRoute('/dashboard/businesses/:id/edit', async () => {
      const params = this.getParams();
      const content = await renderBusinessEdit(params.id);
      const layout = await renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Channels index (selector)
    this.protectedRoute('/dashboard/channels', async () => {
      const content = await renderChannelsIndex();
      const layout = await renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Channels detail (specific business)
    this.protectedRoute('/dashboard/channels/:id', async () => {
      const params = this.getParams();
      const content = await renderChannelsDetail(params.id);
      const layout = await renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Analytics index (selector)
    this.protectedRoute('/dashboard/analytics', async () => {
      const content = await renderAnalyticsIndex();
      const layout = await renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });

    // Analytics detail (specific business)
    this.protectedRoute('/dashboard/analytics/:id', async () => {
      const params = this.getParams();
      const content = await renderAnalyticsDetail(params.id);
      const layout = await renderDashboardLayout(content);
      renderTo(appRoot, layout);
    });
  }


  public getParams(): Record<string, string> {
    return (window as any).routeParams || {};
  }

 
  public back(): void {
    window.history.back();
  }
}

// Export singleton instance
export const router = new Router();

// Helper function to get route params in handlers

export const getRouteParams = (): Record<string, string> => {
  return router.getParams();
};