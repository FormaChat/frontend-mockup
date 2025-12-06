import { createUserProfileDropdown } from './user-profile-dropdown';
import type { UserProfileData } from './user-profile-dropdown';

/**
 * Create navbar with user profile dropdown
 * @param userProfile - User profile data to display (optional)
 */
export function createNavbar(userProfile?: UserProfileData | null): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  
  // Left section - Logo/Brand
  const leftSection = document.createElement('div');
  leftSection.className = 'navbar-left';
  
  const logo = document.createElement('a');
  logo.href = '#/dashboard';
  logo.textContent = 'FormaChat';
  logo.className = 'navbar-logo';
  leftSection.appendChild(logo);
  
  nav.appendChild(leftSection);
  
  // Right section - User profile
  const rightSection = document.createElement('div');
  rightSection.className = 'navbar-right';
  
  // Add user profile dropdown if user data is available
  if (userProfile) {
    const profileDropdown = createUserProfileDropdown(userProfile);
    rightSection.appendChild(profileDropdown);
  } else {
    // Fallback: show a loading state or login button
    const placeholder = document.createElement('span');
    placeholder.textContent = 'Loading...';
    placeholder.className = 'user-loading';
    rightSection.appendChild(placeholder);
  }
  
  nav.appendChild(rightSection);
  
  return nav;
}