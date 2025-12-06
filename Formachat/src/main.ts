import './style.css';
import { router } from './router';
import { 
  getAccessToken, 
  getRefreshToken, 
  logout, 
  isTokenExpired 
} from './utils/auth.utils';
import { refreshAccessToken } from './utils/api.utils';
import { 
  startTokenRefreshTimer, 
  stopTokenRefreshTimer 
} from './utils/token-refresh.utils';

console.log('[App] Initializing FormaChat Frontend...');


// Check if current URL is in embed mode
 
function isEmbedMode(): boolean {
  const hash = window.location.hash;
  return hash.includes('embed=true');
}


async function initApp() {
  if (isEmbedMode()) {
    console.log('[App] Embed mode detected - skipping authentication');
    router.init();
    console.log('[App] Router initialized in EMBED MODE. App is ready!');
    return;
  }

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  if (accessToken && refreshToken) {
    console.log('[App] Found existing tokens');
    
    if (isTokenExpired(accessToken)) {
      console.warn('[App] Access token expired, attempting refresh...');
      
      const refreshed = await refreshAccessToken();
      
      if (!refreshed) {
        console.error('[App] Token refresh failed - logging out');
        logout();
        window.location.hash = '/login';
        return;
      }
      
      console.log('[App] Token refreshed successfully');
    }
    
    startTokenRefreshTimer();
    console.log('[App] Automatic token refresh enabled');
  } else if (accessToken || refreshToken) {

    console.warn('[App] Incomplete token state, clearing');
    logout();
  } else {
    console.log('[App] No tokens found - user not logged in');
  }
  
  router.init();
  
  console.log('[App] Router initialized. App is ready!');
}


//  Cleanup on page unload

window.addEventListener('beforeunload', () => {
  stopTokenRefreshTimer();
});

// Global error handler

window.addEventListener('error', (event) => {
  console.error('[App] Global error:', event.error);
});

// Unhandled promise rejection handler

window.addEventListener('unhandledrejection', (event) => {
  console.error('[App] Unhandled promise rejection:', event.reason);
});


initApp().catch(error => {
  console.error('[App] Initialization failed:', error);
  
  // Show error to user
  const appRoot = document.getElementById('app');
  if (appRoot) {
    appRoot.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; 
        height: 100vh; background: #f5f5f5; color: #333; text-align: center;">
        <div>
          <h1 style="color: #e74c3c;"> Application Error</h1>
          <p>Failed to initialize application. Please refresh the page.</p>
          <button onclick="window.location.reload()" 
            style="margin-top: 20px; padding: 10px 20px; background: #667eea; 
            color: white; border: none; border-radius: 5px; cursor: pointer; 
            font-weight: 600;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
});