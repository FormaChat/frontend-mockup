// components/business-card.ts

export interface BusinessCardData {
  id: string;
  name: string;
  createdAt: Date;
  status?: 'active' | 'inactive';
}


export function createBusinessCard(
  business: BusinessCardData,
  onClickPath: string
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'business-card';
  
  // Business name
  const name = document.createElement('h3');
  name.textContent = business.name;
  card.appendChild(name);
  
  // Created date
  const date = document.createElement('p');
  date.textContent = `Created: ${new Date(business.createdAt).toLocaleDateString()}`;
  card.appendChild(date);
  
  // Status (if provided)
  if (business.status) {
    const status = document.createElement('span');
    status.textContent = business.status;
    status.className = `status-${business.status}`;
    card.appendChild(status);
  }
  
  // Make entire card clickable
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    window.location.hash = onClickPath;
  });
  
  return card;
}