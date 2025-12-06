export interface BreadcrumbItem {
  label: string;
  path?: string; 
}

export function createBreadcrumb(items: BreadcrumbItem[]): HTMLElement {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  
  const ol = document.createElement('ol');
  
  items.forEach((item, index) => {
    const li = document.createElement('li');
    
    if (item.path) {
      // Clickable breadcrumb item
      const link = document.createElement('a');
      link.href = item.path;
      link.textContent = item.label;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = item.path!;
      });
      li.appendChild(link);
    } else {
      // Current page (not clickable)
      const span = document.createElement('span');
      span.textContent = item.label;
      span.setAttribute('aria-current', 'page');
      li.appendChild(span);
    }
    
    // Add separator except for last item
    if (index < items.length - 1) {
      const separator = document.createElement('span');
      separator.textContent = ' > ';
      li.appendChild(separator);
    }
    
    ol.appendChild(li);
  });
  
  nav.appendChild(ol);
  return nav;
}