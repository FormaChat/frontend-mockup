// pages/dashboard/analytics/detail.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { getBusinessById } from '../../../services/business.service';
import { 
  getAnalyticsSummary, 
  getBusinessSessions, 
  getBusinessLeads 
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
      getBusinessLeads(businessId, undefined, 1, 5) // Last 5 leads
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
        contactCell.textContent = session.contact.captured 
          ? (session.contact.email || session.contact.phone || 'Yes')
          : 'No';
        row.appendChild(contactCell);
        
        const dateCell = document.createElement('div');
        dateCell.className = 'table-cell';
        dateCell.textContent = new Date(session.startedAt).toLocaleDateString();
        row.appendChild(dateCell);
        
        // Make row clickable to view details
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
          // TODO: Navigate to session details page or open modal
          alert(`View session ${session.sessionId}`);
        });
        
        sessionsTable.appendChild(row);
      });
      
      sessionsSection.appendChild(sessionsTable);
      
      // View all button
      const viewAllBtn = document.createElement('button');
      viewAllBtn.textContent = 'View All Sessions';
      viewAllBtn.className = 'btn-secondary';
      viewAllBtn.addEventListener('click', () => {
        // TODO: Navigate to full sessions list or expand table
        alert('View all sessions functionality - coming soon');
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
      
      // View all button
      const viewAllBtn = document.createElement('button');
      viewAllBtn.textContent = 'View All Leads';
      viewAllBtn.className = 'btn-secondary';
      viewAllBtn.addEventListener('click', () => {
        // TODO: Navigate to full leads list
        alert('View all leads functionality - coming soon');
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