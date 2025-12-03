// components/navbar.ts
import { createUserProfileDropdown } from './user-profile-dropdown';
import type { UserProfileData } from './user-profile-dropdown';
import { getUser } from '../utils/auth.utils';

export function createNavbar(): HTMLElement {
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
  
  // Get user data from localStorage
  const user = getUser();
  
  if (user) {
    const userProfileData: UserProfileData = {
      username: "user.name || user.email,,",
      lastLogin: "user.lastLogin"
    };
    
    const profileDropdown = createUserProfileDropdown(userProfileData);
    rightSection.appendChild(profileDropdown);
  }
  
  nav.appendChild(rightSection);
  
  return nav;
}