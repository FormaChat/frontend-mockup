// components/user-profile-dropdown.ts
import { logout } from '../utils/auth.utils';

export interface UserProfileData {
  username: string;
  lastLogin?: string;
}

export function createUserProfileDropdown(user: UserProfileData): HTMLElement {
  const container = document.createElement('div');
  container.className = 'user-profile-dropdown';
  
  // Trigger button
  const trigger = document.createElement('button');
  trigger.textContent = user.username;
  trigger.className = 'profile-trigger';
  
  // Dropdown menu
  const menu = document.createElement('div');
  menu.className = 'profile-menu';
  menu.style.display = 'none';
  
  // Last login info
  if (user.lastLogin) {
    const lastLogin = document.createElement('p');
    lastLogin.textContent = `Last login: ${new Date(user.lastLogin).toLocaleString()}`;
    menu.appendChild(lastLogin);
  }
  
  // Logout button
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Logout';
  logoutBtn.addEventListener('click', () => {
    logout();
    window.location.hash = '#/login';
  });
  menu.appendChild(logoutBtn);
  
  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });
  
  container.appendChild(trigger);
  container.appendChild(menu);
  
  return container;
}