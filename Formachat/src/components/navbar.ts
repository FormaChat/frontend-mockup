import { createUserProfileDropdown } from './user-profile-dropdown';
import type { UserProfileData } from './user-profile-dropdown';
import { createSidebarDropdown } from './sidebar';


function injectNavbarStyles() {
  if (document.getElementById('navbar-styles')) return;

  const style = document.createElement('style');
  style.id = 'navbar-styles';
  style.textContent = `
    :root {
      --primary: #636b2f;
      --text-main: #1a1a1a;
      --text-muted: #666;
    }
    
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 65px;
      padding: 0 20px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 40;
      box-shadow: 0 1px 0px rgba(0,0,0,0.05);
      box-sizing: border-box;
    }
    
    .navbar-hidden {
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    }

    /* Left: Toggle Button + Sidebar Dropdown */
    .navbar-left {
      position: relative;
      display: flex;
      align-items: center;
      z-index: 42;
    }

    /* Center: Logo (FormaChat) */
    .navbar-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 41;
      text-align: center;
    }
    
    .navbar-logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
      text-decoration: none;
      letter-spacing: -0.5px;
    }

    /* Right: Profile */
    .navbar-right {
      position: relative;
      display: flex;
      align-items: center;
      z-index: 42;
    }

    /* Sidebar Toggle Button */
    .sidebar-toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-main);
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }
    .sidebar-toggle:hover {
      background: rgba(99, 107, 47, 0.1);
    }
    .sidebar-toggle svg {
      width: 26px;
      height: 26px;
    }
    
    .user-loading {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  `;
  document.head.appendChild(style);
}

function attachSmartScrollHide(navbarElement: HTMLElement): void {
  let lastScrollY = window.scrollY;
  let isScrolling: number | undefined; 
  const SCROLL_THRESHOLD = 50; 

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) return; 

    if (currentScrollY > 65 && scrollDelta > 0) {
      navbarElement.classList.add('navbar-hidden');
    } else if (scrollDelta < 0 || currentScrollY < 65) {
      navbarElement.classList.remove('navbar-hidden');
    }

    lastScrollY = currentScrollY;

    if (isScrolling !== undefined) window.clearTimeout(isScrolling);

    isScrolling = window.setTimeout(() => {
      if (navbarElement.classList.contains('navbar-hidden')) {
        navbarElement.classList.remove('navbar-hidden');
        lastScrollY = window.scrollY; 
      }
      isScrolling = undefined;
    }, 200);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

export function createNavbar(
  userProfile: UserProfileData | null
): HTMLElement {
  injectNavbarStyles();

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  
  const leftSection = document.createElement('div');
  leftSection.className = 'navbar-left';
  
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'sidebar-toggle';
  toggleBtn.setAttribute('aria-label', 'Toggle menu');
  toggleBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  `;
  
  const sidebarDropdown = createSidebarDropdown();
  
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = sidebarDropdown.querySelector('.sidebar-menu') as HTMLElement;
    if (menu) {
      const isVisible = menu.style.display !== 'none';
      menu.style.display = isVisible ? 'none' : 'block';
    }
  });
  
  leftSection.appendChild(toggleBtn);
  leftSection.appendChild(sidebarDropdown);
  nav.appendChild(leftSection);

  const centerSection = document.createElement('div');
  centerSection.className = 'navbar-center';
  
  const logo = document.createElement('a');
  logo.href = '#/dashboard';
  logo.textContent = 'FormaChat';
  logo.className = 'navbar-logo';
  centerSection.appendChild(logo);
  nav.appendChild(centerSection);
  
  const rightSection = document.createElement('div');
  rightSection.className = 'navbar-right';
  
  if (userProfile) {
    const profileDropdown = createUserProfileDropdown(userProfile);
    rightSection.appendChild(profileDropdown);
  } else {
    const placeholder = document.createElement('span');
    placeholder.textContent = 'Loading...';
    placeholder.className = 'user-loading';
    rightSection.appendChild(placeholder);
  }
  
  nav.appendChild(rightSection);

  document.addEventListener('click', () => {
    const sidebarMenu = sidebarDropdown.querySelector('.sidebar-menu') as HTMLElement;
    if (sidebarMenu) {
      sidebarMenu.style.display = 'none';
    }
  });

  window.requestAnimationFrame(() => attachSmartScrollHide(nav));
  
  return nav;
}