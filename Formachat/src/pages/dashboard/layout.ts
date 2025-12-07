// pages/dashboard/layout.ts
import { createNavbar } from '../../components/navbar';
import { getUserDetails } from '../../utils/userDetails.utils';

export async function renderDashboardLayout(content: HTMLElement): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'dashboard-layout';

  const userProfile = await getUserDetails();
  
  // Navbar with integrated sidebar dropdown
  const navbar = createNavbar(userProfile);
  container.appendChild(navbar);
  
  // Content area (add top padding for fixed navbar)
  const contentArea = document.createElement('div');
  contentArea.className = 'dashboard-content';
  contentArea.style.paddingTop = '80px'; // Account for 65px navbar + spacing
  contentArea.appendChild(content);
  
  container.appendChild(contentArea);
  
  return container;
}