export interface SidebarItem {
  label: string;
  path: string;
  icon?: string; // Optional icon identifier for future use
}

export function createSidebar(): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  
  // Sidebar navigation items
  const navItems: SidebarItem[] = [
    { label: 'Home', path: '#/dashboard' },
    { label: 'Businesses', path: '#/dashboard/businesses' },
    { label: 'Channels', path: '#/dashboard/channels' },
    { label: 'Analytics', path: '#/dashboard/analytics' }
  ];
  
  const nav = document.createElement('nav');
  nav.className = 'sidebar-nav';
  
  const ul = document.createElement('ul');
  
  navItems.forEach(item => {
    const li = document.createElement('li');
    
    const link = document.createElement('a');
    link.href = item.path;
    link.textContent = item.label;
    link.className = 'sidebar-link';
    
    // Highlight active link
    if (window.location.hash === item.path) {
      link.classList.add('active');
    }
    
    // Update active state on click
    link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
    
    li.appendChild(link);
    ul.appendChild(li);
  });
  
  nav.appendChild(ul);
  sidebar.appendChild(nav);
  
  return sidebar;
}


//Toggle sidebar visibility (for mobile/responsive)

export function toggleSidebar(sidebar: HTMLElement): void {
  sidebar.classList.toggle('collapsed');
}