// pages/dashboard/businesses/list.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createBusinessCard } from '../../../components/business-card';
import type { BusinessCardData } from '../../../components/business-card';
import { createEmptyState } from '../../../components/empty-state';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { showDeleteConfirmation } from '../../../components/delete-confirmation';
import { getBusinesses, deleteBusiness } from '../../../services/business.service';

export async function renderBusinessList(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'businesses-list';
  
  // Breadcrumb
  const breadcrumb = createBreadcrumb([
    { label: 'Businesses' }
  ]);
  container.appendChild(breadcrumb);
  
  // Header section
  const header = document.createElement('div');
  header.className = 'page-header';
  
  const heading = document.createElement('h1');
  heading.textContent = 'My Businesses';
  header.appendChild(heading);
  
  const createButton = document.createElement('button');
  createButton.textContent = 'Create New Business';
  createButton.className = 'btn-primary';
  createButton.addEventListener('click', () => {
    window.location.hash = '#/dashboard/businesses/create';
  });
  header.appendChild(createButton);
  
  container.appendChild(header);
  
  const description = document.createElement('p');
  description.textContent = 'Manage your chatbot businesses. Create, edit, or delete your business profiles.';
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
        message: 'No businesses found. Create your first chatbot to get started!',
        buttonText: 'Create Business Bot',
        buttonPath: '#/dashboard/businesses/create'
      });
      grid.appendChild(emptyState);
    } else {
      // Render business cards with actions
      businesses.forEach(business => {
        const card = createBusinessCardWithActions(business);
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

/**
 * Create business card with edit/delete actions
 */
function createBusinessCardWithActions(business: any): HTMLElement {
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'business-card-wrapper';
  
  // Business card (clickable to view details)
  const cardData: BusinessCardData = {
    id: business._id,
    name: business.basicInfo.businessName,
    createdAt: business.createdAt,
    status: business.isActive ? 'active' : 'inactive'
  };
  
  const card = createBusinessCard(
    cardData,
    `#/dashboard/businesses/${business._id}/edit` // Click goes to edit page
  );
  
  // Actions container
  const actions = document.createElement('div');
  actions.className = 'card-actions';
  
  // Edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'btn-secondary';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card click
    window.location.hash = `#/dashboard/businesses/${business._id}/edit`;
  });
  actions.appendChild(editBtn);
  
  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'btn-danger';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card click
    handleDeleteBusiness(business._id, business.basicInfo.businessName, cardWrapper);
  });
  actions.appendChild(deleteBtn);
  
  card.appendChild(actions);
  cardWrapper.appendChild(card);
  
  return cardWrapper;
}

/**
 * Handle business deletion with confirmation
 */
async function handleDeleteBusiness(
  businessId: string,
  businessName: string,
  cardElement: HTMLElement
): Promise<void> {
  showDeleteConfirmation({
    itemName: businessName,
    onConfirm: async () => {
      try {
        // Show loading state
        cardElement.style.opacity = '0.5';
        cardElement.style.pointerEvents = 'none';
        
        // Delete business
        await deleteBusiness(businessId);
        
        // Remove card from DOM
        cardElement.remove();
        
        alert(`Business "${businessName}" deleted successfully`);
      } catch (error) {
        // Restore card state
        cardElement.style.opacity = '1';
        cardElement.style.pointerEvents = 'auto';
        
        alert('Failed to delete business. Please try again.');
        console.error('Delete error:', error);
      }
    },
    onCancel: () => {
      console.log('Deletion cancelled');
    }
  });
}