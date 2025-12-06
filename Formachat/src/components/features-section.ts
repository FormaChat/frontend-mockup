export interface Feature {
  title: string;
  description: string;
  status?: 'available' | 'coming-soon';
}

export function createFeaturesSection(features: Feature[]): HTMLElement {
  const container = document.createElement('div');
  container.className = 'features-section';
  
  const heading = document.createElement('h2');
  heading.textContent = 'Features & Pricing';
  container.appendChild(heading);
  
  const grid = document.createElement('div');
  grid.className = 'features-grid';
  
  features.forEach(feature => {
    const card = document.createElement('div');
    card.className = 'feature-card';
    
    const title = document.createElement('h3');
    title.textContent = feature.title;
    card.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = feature.description;
    card.appendChild(description);
    
    if (feature.status) {
      const status = document.createElement('span');
      status.textContent = feature.status === 'coming-soon' ? 'Coming Soon' : 'Available';
      status.className = `status-${feature.status}`;
      card.appendChild(status);
    }
    
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  return container;
}