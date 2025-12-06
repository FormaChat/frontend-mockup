// pages/dashboard/analytics/detail.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { showSessionDetailsModal } from '../../../components/session-details-modal'; // ✅ NEW IMPORT
import { getBusinessById } from '../../../services/business.service';
import { 
  getAnalyticsSummary, 
  getBusinessSessions, 
  getBusinessLeads,
} from '../../../services/chat.service';

export async function renderAnalyticsDetail(businessId: string): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'analytics-detail';
  
  // Show loading spinner
  const spinner = createLoadingSpinner('Loading analytics...');
  container.appendChild(spinner);
  
  try {
    // Fetch business details and analytics data in parallel
    const [business, analyticsSummary, recentSessions, recentLeads] = await Promise.all([
      getBusinessById(businessId),
      getAnalyticsSummary(businessId),
      getBusinessSessions(businessId, undefined, 1, 5), // Last 5 sessions
      getBusinessLeads(businessId, undefined, 1, 5)// Last 5 leads
    ]);
    
    // Remove spinner
    hideLoadingSpinner(spinner);
    
    // Breadcrumb
    const breadcrumb = createBreadcrumb([
      { label: 'Analytics', path: '#/dashboard/analytics' },
      { label: business.basicInfo.businessName }
    ]);
    container.appendChild(breadcrumb);
    
    // Page heading
    const heading = document.createElement('h1');
    heading.textContent = `Analytics - ${business.basicInfo.businessName}`;
    container.appendChild(heading);
    
    // Stats Overview Section
    const statsSection = document.createElement('section');
    statsSection.className = 'stats-section';
    
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    
    // Real stats from chat service
    const sessionsCard = createStatCard(
      'Total Sessions', 
      analyticsSummary.totalSessions.toString(),
      `${analyticsSummary.activeSessions} active`
    );
    statsGrid.appendChild(sessionsCard);
    
    const leadsCard = createStatCard(
      'Total Leads', 
      analyticsSummary.totalLeads.toString(),
      'Captured contacts'
    );
    statsGrid.appendChild(leadsCard);
    
    const messagesCard = createStatCard(
      'Total Messages', 
      analyticsSummary.totalMessages.toString(),
      'Across all sessions'
    );
    statsGrid.appendChild(messagesCard);
    
    const conversionCard = createStatCard(
      'Conversion Rate', 
      `${analyticsSummary.conversionRate}%`,
      'Sessions with contact'
    );
    statsGrid.appendChild(conversionCard);
    
    statsSection.appendChild(statsGrid);
    container.appendChild(statsSection);
    
    // Recent Sessions Section
    if (recentSessions.length > 0) {
      const sessionsSection = document.createElement('section');
      sessionsSection.className = 'sessions-section';
      
      const sessionsHeading = document.createElement('h2');
      sessionsHeading.textContent = 'Recent Sessions';
      sessionsSection.appendChild(sessionsHeading);
      
      const sessionsTable = document.createElement('div');
      sessionsTable.className = 'sessions-table';
      
      // Table header
      const tableHeader = document.createElement('div');
      tableHeader.className = 'table-row table-header';
      tableHeader.innerHTML = `
        <div class="table-cell">Session ID</div>
        <div class="table-cell">Status</div>
        <div class="table-cell">Messages</div>
        <div class="table-cell">Contact</div>
        <div class="table-cell">Started</div>
      `;
      sessionsTable.appendChild(tableHeader);
      
      // Table rows
      recentSessions.forEach(session => {
        const row = document.createElement('div');
        row.className = 'table-row';
        
        const sessionIdCell = document.createElement('div');
        sessionIdCell.className = 'table-cell';
        sessionIdCell.textContent = session.sessionId.substring(0, 8) + '...';
        sessionIdCell.title = session.sessionId;
        row.appendChild(sessionIdCell);
        
        const statusCell = document.createElement('div');
        statusCell.className = 'table-cell';
        statusCell.innerHTML = `<span class="status-badge status-${session.status}">${session.status}</span>`;
        row.appendChild(statusCell);
        
        const messagesCell = document.createElement('div');
        messagesCell.className = 'table-cell';
        messagesCell.textContent = session.messageCount.toString();
        row.appendChild(messagesCell);
        
        const contactCell = document.createElement('div');
        contactCell.className = 'table-cell';
        contactCell.textContent = session.contact?.captured 
          ? (session.contact.email || session.contact.phone || 'Yes')
          : 'No';
        row.appendChild(contactCell);
        
        const dateCell = document.createElement('div');
        dateCell.className = 'table-cell';
        dateCell.textContent = new Date(session.startedAt).toLocaleDateString();
        row.appendChild(dateCell);
        
        // ✅ UPDATED: Make row clickable to view details
        row.style.cursor = 'pointer';
        row.addEventListener('click', async () => {
          await showSessionDetailsModal(businessId, session.sessionId);
        });
        
        sessionsTable.appendChild(row);
      });
      
      sessionsSection.appendChild(sessionsTable);
      
      // ✅ UPDATED: View all button - show all sessions modal
      const viewAllBtn = document.createElement('button');
      viewAllBtn.textContent = 'View All Sessions';
      viewAllBtn.className = 'btn-secondary';
      viewAllBtn.addEventListener('click', async () => {
        await showAllSessionsModal(businessId);
      });
      sessionsSection.appendChild(viewAllBtn);
      
      container.appendChild(sessionsSection);
    }
    
    // Recent Leads Section
    if (recentLeads.length > 0) {
      const leadsSection = document.createElement('section');
      leadsSection.className = 'leads-section';
      
      const leadsHeading = document.createElement('h2');
      leadsHeading.textContent = 'Recent Leads';
      leadsSection.appendChild(leadsHeading);
      
      const leadsTable = document.createElement('div');
      leadsTable.className = 'leads-table';
      
      // Table header
      const tableHeader = document.createElement('div');
      tableHeader.className = 'table-row table-header';
      tableHeader.innerHTML = `
        <div class="table-cell">Name</div>
        <div class="table-cell">Email</div>
        <div class="table-cell">Phone</div>
        <div class="table-cell">Status</div>
        <div class="table-cell">Captured</div>
      `;
      leadsTable.appendChild(tableHeader);
      
      // Table rows
      recentLeads.forEach(lead => {
        const row = document.createElement('div');
        row.className = 'table-row';
        
        const nameCell = document.createElement('div');
        nameCell.className = 'table-cell';
        nameCell.textContent = lead.name || '-';
        row.appendChild(nameCell);
        
        const emailCell = document.createElement('div');
        emailCell.className = 'table-cell';
        emailCell.textContent = lead.email || '-';
        row.appendChild(emailCell);
        
        const phoneCell = document.createElement('div');
        phoneCell.className = 'table-cell';
        phoneCell.textContent = lead.phone || '-';
        row.appendChild(phoneCell);
        
        const statusCell = document.createElement('div');
        statusCell.className = 'table-cell';
        statusCell.innerHTML = `<span class="status-badge status-${lead.status}">${lead.status}</span>`;
        row.appendChild(statusCell);
        
        const dateCell = document.createElement('div');
        dateCell.className = 'table-cell';
        dateCell.textContent = new Date(lead.firstContactDate).toLocaleDateString();
        row.appendChild(dateCell);
        
        leadsTable.appendChild(row);
      });
      
      leadsSection.appendChild(leadsTable);
      
      // ✅ UPDATED: View all button - show all leads modal
      const viewAllBtn = document.createElement('button');
      viewAllBtn.textContent = 'View All Leads';
      viewAllBtn.className = 'btn-secondary';
      viewAllBtn.addEventListener('click', async () => {
        await showAllLeadsModal(businessId);
      });
      leadsSection.appendChild(viewAllBtn);
      
      container.appendChild(leadsSection);
    }
    
    // Empty state if no data
    if (recentSessions.length === 0 && recentLeads.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <p>No chat activity yet for this business.</p>
        <p>Share your bot URL to start receiving conversations!</p>
      `;
      container.appendChild(emptyState);
    }
    
  } catch (error) {
    hideLoadingSpinner(spinner);
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load analytics. Please try again.';
    errorMessage.className = 'error-message';
    container.appendChild(errorMessage);
    
    console.error('Failed to fetch analytics:', error);
  }
  
  return container;
}

// ========================================
// ✅ NEW HELPER FUNCTIONS
// ========================================

/**
 * Show all sessions in a modal with full list
 */
async function showAllSessionsModal(businessId: string): Promise<void> {
  const { showModal } = await import('../../../components/modal');
  const { getBusinessSessions } = await import('../../../services/chat.service');
  const { createLoadingSpinner } = await import('../../../components/loading-spinner');

  // Create loading content
  const loadingContent = document.createElement('div');
  loadingContent.style.padding = '40px';
  loadingContent.style.textAlign = 'center';
  const spinner = createLoadingSpinner('Loading all sessions...');
  loadingContent.appendChild(spinner);

  // Show modal with loading state
  const modal = showModal({
    title: 'All Sessions',
    content: loadingContent,
    showCloseButton: true
  });

  try {
    // Fetch all sessions (limit 100 for now)
    const sessions = await getBusinessSessions(businessId, undefined, 1, 100);

    // Build table
    const tableContainer = document.createElement('div');
    tableContainer.className = 'sessions-table';
    tableContainer.style.maxHeight = '500px';
    tableContainer.style.overflowY = 'auto';

    // Table header
    const tableHeader = document.createElement('div');
    tableHeader.className = 'table-row table-header';
    tableHeader.innerHTML = `
      <div class="table-cell">Session ID</div>
      <div class="table-cell">Status</div>
      <div class="table-cell">Messages</div>
      <div class="table-cell">Contact</div>
      <div class="table-cell">Started</div>
    `;
    tableContainer.appendChild(tableHeader);

    // Table rows
    sessions.forEach(session => {
      const row = document.createElement('div');
      row.className = 'table-row';
      row.style.cursor = 'pointer';

      row.innerHTML = `
        <div class="table-cell">${session.sessionId.substring(0, 8)}...</div>
        <div class="table-cell"><span class="status-badge status-${session.status}">${session.status}</span></div>
        <div class="table-cell">${session.messageCount}</div>
        <div class="table-cell">${session.contact?.captured ? (session.contact.email || session.contact.phone || 'Yes') : 'No'}</div>
        <div class="table-cell">${new Date(session.startedAt).toLocaleDateString()}</div>
      `;

      row.addEventListener('click', async () => {
        await showSessionDetailsModal(businessId, session.sessionId);
      });

      tableContainer.appendChild(row);
    });

    // Replace loading content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(tableContainer);
    }
  } catch (error) {
    console.error('Failed to load sessions:', error);
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '<p class="error-message">Failed to load sessions.</p>';
    }
  }
}

/**
 * Show all leads in a modal with full list
 */
async function showAllLeadsModal(businessId: string): Promise<void> {
  const { showModal } = await import('../../../components/modal');
  const { getBusinessLeads } = await import('../../../services/chat.service');
  const { createLoadingSpinner } = await import('../../../components/loading-spinner');

  // Create loading content
  const loadingContent = document.createElement('div');
  loadingContent.style.padding = '40px';
  loadingContent.style.textAlign = 'center';
  const spinner = createLoadingSpinner('Loading all leads...');
  loadingContent.appendChild(spinner);

  // Show modal with loading state
  const modal = showModal({
    title: 'All Leads',
    content: loadingContent,
    showCloseButton: true
  });

  try {
    // Fetch all leads (limit 100 for now)
    const leads = await getBusinessLeads(businessId, undefined, 1, 100);

    // Build table
    const tableContainer = document.createElement('div');
    tableContainer.className = 'leads-table';
    tableContainer.style.maxHeight = '500px';
    tableContainer.style.overflowY = 'auto';

    // Add export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export to CSV';
    exportBtn.className = 'btn-primary';
    exportBtn.style.marginBottom = '15px';
    exportBtn.addEventListener('click', () => {
      exportLeadsToCSV(leads);
    });
    tableContainer.appendChild(exportBtn);

    // Table header
    const tableHeader = document.createElement('div');
    tableHeader.className = 'table-row table-header';
    tableHeader.innerHTML = `
      <div class="table-cell">Name</div>
      <div class="table-cell">Email</div>
      <div class="table-cell">Phone</div>
      <div class="table-cell">Status</div>
      <div class="table-cell">Captured</div>
    `;
    tableContainer.appendChild(tableHeader);

    // Table rows
    leads.forEach(lead => {
      const row = document.createElement('div');
      row.className = 'table-row';

      row.innerHTML = `
        <div class="table-cell">${lead.name || '-'}</div>
        <div class="table-cell">${lead.email || '-'}</div>
        <div class="table-cell">${lead.phone || '-'}</div>
        <div class="table-cell"><span class="status-badge status-${lead.status}">${lead.status}</span></div>
        <div class="table-cell">${new Date(lead.firstContactDate).toLocaleDateString()}</div>
      `;

      tableContainer.appendChild(row);
    });

    // Replace loading content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(tableContainer);
    }
  } catch (error) {
    console.error('Failed to load leads:', error);
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '<p class="error-message">Failed to load leads.</p>';
    }
  }
}

/**
 * Export leads to CSV file
 */
function exportLeadsToCSV(leads: any[]): void {
  // CSV header
  const headers = ['Name', 'Email', 'Phone', 'Status', 'First Contact Date'];
  
  // CSV rows
  const rows = leads.map(lead => [
    lead.name || '',
    lead.email || '',
    lead.phone || '',
    lead.status || '',
    new Date(lead.firstContactDate).toLocaleDateString()
  ]);

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper function to create stat cards
function createStatCard(label: string, value: string, change: string): HTMLElement {
  const card = document.createElement('div');
  card.className = 'stat-card';
  
  const labelElement = document.createElement('p');
  labelElement.className = 'stat-label';
  labelElement.textContent = label;
  card.appendChild(labelElement);
  
  const valueElement = document.createElement('h3');
  valueElement.className = 'stat-value';
  valueElement.textContent = value;
  card.appendChild(valueElement);
  
  const changeElement = document.createElement('p');
  changeElement.className = 'stat-change';
  changeElement.textContent = change;
  card.appendChild(changeElement);
  
  return card;
}