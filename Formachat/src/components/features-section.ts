export interface Feature {
  title: string;
  description: string;
  status?: 'available' | 'coming-soon';
}

function injectFeatureStyles() {
  if (document.getElementById('feature-section-styles')) return;

  const style = document.createElement('style');
  style.id = 'feature-section-styles';
  style.textContent = `
    :root {
      --primary: #636b2f;
      --text-main: #1a1a1a;
      --text-muted: #666;
    }

    .features-section {
      width: 100%;
    }

    .features-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .features-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    
    .features-subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin: 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      width: 100%;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      padding: 24px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      height: 100%;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(99, 107, 47, 0.12);
      border-color: rgba(99, 107, 47, 0.2);
    }

    .card-coming-soon {
      opacity: 0.75;
    }

    .feature-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .card-available .feature-icon-box {
      background: linear-gradient(135deg, #f4f6e6 0%, #e8ead5 100%);
      color: var(--primary);
    }
    
    .card-coming-soon .feature-icon-box {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: #9ca3af;
    }

    .feature-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: var(--text-main);
      line-height: 1.3;
    }

    .feature-card p {
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--text-muted);
      margin: 0 0 16px 0;
      flex-grow: 1;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      width: fit-content;
      text-transform: capitalize;
    }

    .status-available {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    .status-coming-soon {
      background: rgba(156, 163, 175, 0.15);
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .features-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .features-title {
        font-size: 1.5rem;
      }

      .feature-card {
        padding: 20px;
      }
    }
  `;
  document.head.appendChild(style);
}

export function createFeaturesSection(features: Feature[]): HTMLElement {
  injectFeatureStyles();

  const container = document.createElement('div');
  container.className = 'features-section';
  
  const header = document.createElement('div');
  header.className = 'features-header';
  
  const heading = document.createElement('h2');
  heading.className = 'features-title';
  heading.textContent = 'Powerful Features';
  header.appendChild(heading);

  const sub = document.createElement('p');
  sub.className = 'features-subtitle';
  sub.textContent = 'Everything you need to automate your support workflow';
  header.appendChild(sub);

  container.appendChild(header);
  
  const grid = document.createElement('div');
  grid.className = 'features-grid';
  
  features.forEach(feature => {
    const card = document.createElement('div');
    const statusClass = feature.status === 'coming-soon' ? 'card-coming-soon' : 'card-available';
    card.className = `feature-card ${statusClass}`;
    
    const iconBox = document.createElement('div');
    iconBox.className = 'feature-icon-box';
    
    if (feature.status === 'coming-soon') {
      iconBox.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      `;
    } else {
      iconBox.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    }
    card.appendChild(iconBox);

    const title = document.createElement('h3');
    title.textContent = feature.title;
    card.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = feature.description;
    card.appendChild(description);
    
    if (feature.status) {
      const status = document.createElement('div');
      status.textContent = feature.status === 'coming-soon' ? 'Coming Soon' : 'Available';
      status.className = `status-badge status-${feature.status}`;
      card.appendChild(status);
    }
    
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  return container;
}