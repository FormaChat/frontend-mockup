// pages/dashboard/layout.ts
import { createNavbar } from '../../components/navbar';
import { createSidebar } from '../../components/sidebar';
import { getUserDetails } from '../../utils/userDetails.utils';

export async function renderDashboardLayout(content: HTMLElement): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'dashboard-layout';

  const userProfile = await getUserDetails();
  
  // Navbar (fixed at top)
  const navbar = createNavbar(userProfile);
  container.appendChild(navbar);
  
  // Main content area (sidebar + content)
  const mainContent = document.createElement('div');
  mainContent.className = 'dashboard-main';
  
  // Sidebar
  const sidebar = createSidebar();
  mainContent.appendChild(sidebar);
  
  // Content area (scrollable)
  const contentArea = document.createElement('div');
  contentArea.className = 'dashboard-content';
  contentArea.appendChild(content);
  mainContent.appendChild(contentArea);
  
  container.appendChild(mainContent);
  
  return container;
}