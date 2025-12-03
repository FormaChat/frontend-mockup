// pages/dashboard/channels/index.ts
import { createBusinessCard} from '../../../components/business-card';
import type { BusinessCardData } from '../../../components/business-card';
import { createEmptyState } from '../../../components/empty-state';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { createBreadcrumb } from '../../../components/breadcrumb';
import { getBusinesses } from '../../../services/business.service';

export async function renderChannelsIndex(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'channels-index';
  
  // Breadcrumb
  const breadcrumb = createBreadcrumb([
    { label: 'Channels' }
  ]);
  container.appendChild(breadcrumb);
  
  // Page heading
  const heading = document.createElement('h1');
  heading.textContent = 'Channels';
  container.appendChild(heading);
  
  const description = document.createElement('p');
  description.textContent = 'Select a business to manage its channels, test bot, and get QR codes';
  container.appendChild(description);
  
  // Business cards grid
  const grid = document.createElement('div');
  grid.className = 'business-cards-grid';
  container.appendChild(grid);
  
  // Show loading spinner
  const spinner = createLoadingSpinner('Loading businesses...');
  grid.appendChild(spinner);
  
  try {
    // Fetch businesses from API
    const businesses = await getBusinesses();
    
    // Remove spinner
    hideLoadingSpinner(spinner);
    
    if (businesses.length === 0) {
      // Show empty state
      const emptyState = createEmptyState({
        message: 'No businesses found. Create your first bot to get started!',
        buttonText: 'Create Business Bot',
        buttonPath: '#/dashboard/businesses/create'
      });
      grid.appendChild(emptyState);
    } else {
      // Render business cards
      businesses.forEach(business => {
        const cardData: BusinessCardData = {
          id: business._id,
          name: business.basicInfo.businessName,
          createdAt: business.createdAt,
          status: business.isActive? 'active' : 'inactive'
        };
        
        const card = createBusinessCard(
          cardData,
          `#/dashboard/channels/${business._id}`
        );
        grid.appendChild(card);
      });
    }
  } catch (error) {
    hideLoadingSpinner(spinner);
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load businesses. Please try again.';
    errorMessage.className = 'error-message';
    grid.appendChild(errorMessage);
    
    console.error('Failed to fetch businesses:', error);
  }
  
  return container;
}