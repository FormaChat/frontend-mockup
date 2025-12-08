import { showModal } from './modal';
import { getBusinessSessions } from '../services/chat.service';
import { showSessionDetailsModal } from './session-details-modal';
import { createLoadingSpinner } from './loading-spinner';
import type { ContactLead, ChatSession } from '../types/chat.types';

function injectLeadDetailsStyles() {
  if (document.getElementById('lead-details-styles')) return;

  const style = document.createElement('style');
  style.id = 'lead-details-styles';
  style.textContent = `
    :root {
      --primary: #636b2f;
      --secondary: #bac095;
      --text-main: #1a1a1a;
      --text-muted: #666;
      --bg-glass: rgba(255, 255, 255, 0.85);
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }

    .lead-details-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-height: 70vh;
      overflow-y: auto;
    }

    /* Scrollbar Styling */
    .lead-details-container::-webkit-scrollbar { width: 6px; }
    .lead-details-container::-webkit-scrollbar-thumb { 
      background: var(--secondary); 
      border-radius: 3px; 
    }

    /* --- INFO CARDS (Glassmorphism) --- */
    .lead-info-card {
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.6);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .lead-section-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin: 0 0 15px 0;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* --- CONTACT INFO GRID --- */
    .contact-info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .contact-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .contact-info-row:last-child {
      border-bottom: none;
    }

    .contact-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 600;
      min-width: 80px;
    }

    .contact-value {
      font-size: 0.95rem;
      color: var(--text-main);
      font-weight: 500;
      flex: 1;
      word-break: break-all;
    }

    .contact-value.empty {
      color: var(--text-muted);
      font-style: italic;
    }

    /* Copy Button */
    .copy-btn {
      background: white;
      border: 1px solid var(--secondary);
      color: var(--primary);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .copy-btn:hover {
      background: var(--secondary);
      color: white;
    }

    .copy-btn.copied {
      background: var(--success);
      color: white;
      border-color: var(--success);
    }

    /* Status Badge */
    .lead-status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: capitalize;
    }

    .status-new { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
    .status-contacted { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .status-qualified { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .status-converted { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .status-spam { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    /* --- METRICS GRID --- */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
    }

    .metric-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
    }

    /* --- SESSION HISTORY TABLE --- */
    .session-history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .session-count {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .sessions-table {
      border-radius: 8px;
      overflow: hidden;
    }

    .session-table-row {
      display: grid;
      grid-template-columns: 120px 1fr 80px 100px 40px;
      padding: 12px 15px;
      align-items: center;
      border-bottom: 1px solid #eee;
      gap: 10px;
    }

    .session-table-header {
      background: var(--secondary);
      font-weight: 700;
      color: var(--text-main);
      font-size: 0.85rem;
    }

    .session-table-row:not(.session-table-header) {
      cursor: pointer;
      transition: background 0.2s;
    }

    .session-table-row:not(.session-table-header):hover {
      background: rgba(99, 107, 47, 0.05);
    }

    .session-cell {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.9rem;
    }

    .session-id-cell {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: var(--primary);
    }

    .session-arrow {
      text-align: center;
      color: var(--text-muted);
      font-weight: bold;
    }

    /* Session Status Badges */
    .session-status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: capitalize;
    }

    .session-status-active { background: var(--success); color: white; }
    .session-status-ended { background: #9ca3af; color: white; }
    .session-status-abandoned { background: var(--warning); color: white; }

    /* Empty State */
    .sessions-empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      font-style: italic;
    }

    /* --- EXPORT BUTTON --- */
    .lead-export-btn {
      width: 100%;
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .lead-export-btn:hover {
      background: #4a5224;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    /* Loading state in modal */
    .lead-loading-container {
      padding: 60px 20px;
      text-align: center;
    }

    /* Error state */
    .lead-error-message {
      padding: 30px;
      text-align: center;
      color: var(--danger);
    }
  `;
  document.head.appendChild(style);
}

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDateTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}


async function copyToClipboard(text: string, button: HTMLButtonElement): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    
    const originalHTML = button.innerHTML;
    button.innerHTML = '✓ Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
    button.innerHTML = '✗ Failed';
    setTimeout(() => {
      button.innerHTML = '📋 Copy';
    }, 2000);
  }
}

function filterSessionsForLead(
  allSessions: ChatSession[],
  lead: ContactLead
): ChatSession[] {
  return allSessions.filter(session => {
    
    if (lead.email && session.contact?.email === lead.email) {
      return true;
    }
    
    if (lead.phone && session.contact?.phone === lead.phone) {
      return true;
    }
    
    return false;
  });
}


function exportLeadToCSV(lead: ContactLead): void {
  const headers = ['Field', 'Value'];
  const rows = [
    ['Name', lead.name || '-'],
    ['Email', lead.email || '-'],
    ['Phone', lead.phone || '-'],
    ['Status', lead.status],
    ['Total Sessions', lead.totalSessions.toString()],
    ['Total Messages', lead.totalMessages.toString()],
    ['Lead Score', lead.leadScore?.toString() || '-'],
    ['First Contact', formatDateTime(lead.firstContactDate)],
    ['Last Activity', formatDateTime(lead.lastContactDate)],
    ['First Session ID', lead.firstSessionId],
    ['Last Session ID', lead.lastSessionId],
    ['Created', formatDateTime(lead.createdAt)],
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const leadIdentifier = lead.email || lead.phone || lead.firstSessionId.substring(0, 8);
  link.setAttribute('href', url);
  link.setAttribute('download', `lead-${leadIdentifier}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function buildLeadDetailsContent(
  lead: ContactLead,
  leadSessions: ChatSession[],
  businessId: string
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'lead-details-container';

  const contactCard = document.createElement('div');
  contactCard.className = 'lead-info-card';

  const contactTitle = document.createElement('h4');
  contactTitle.className = 'lead-section-title';
  contactTitle.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
    Contact Information
  `;
  contactCard.appendChild(contactTitle);

  const contactGrid = document.createElement('div');
  contactGrid.className = 'contact-info-grid';

  const nameRow = document.createElement('div');
  nameRow.className = 'contact-info-row';
  nameRow.innerHTML = `
    <span class="contact-label">Name:</span>
    <span class="contact-value ${!lead.name ? 'empty' : ''}">${lead.name || 'Not provided'}</span>
  `;
  contactGrid.appendChild(nameRow);

  if (lead.email) {
    const emailRow = document.createElement('div');
    emailRow.className = 'contact-info-row';
    
    const emailLabel = document.createElement('span');
    emailLabel.className = 'contact-label';
    emailLabel.textContent = 'Email:';
    
    const emailValue = document.createElement('span');
    emailValue.className = 'contact-value';
    emailValue.textContent = lead.email;
    
    const copyEmailBtn = document.createElement('button');
    copyEmailBtn.className = 'copy-btn';
    copyEmailBtn.innerHTML = '📋 Copy';
    copyEmailBtn.addEventListener('click', () => copyToClipboard(lead.email!, copyEmailBtn));
    
    emailRow.appendChild(emailLabel);
    emailRow.appendChild(emailValue);
    emailRow.appendChild(copyEmailBtn);
    contactGrid.appendChild(emailRow);
  }

  if (lead.phone) {
    const phoneRow = document.createElement('div');
    phoneRow.className = 'contact-info-row';
    
    const phoneLabel = document.createElement('span');
    phoneLabel.className = 'contact-label';
    phoneLabel.textContent = 'Phone:';
    
    const phoneValue = document.createElement('span');
    phoneValue.className = 'contact-value';
    phoneValue.textContent = lead.phone;
    
    const copyPhoneBtn = document.createElement('button');
    copyPhoneBtn.className = 'copy-btn';
    copyPhoneBtn.innerHTML = '📋 Copy';
    copyPhoneBtn.addEventListener('click', () => copyToClipboard(lead.phone!, copyPhoneBtn));
    
    phoneRow.appendChild(phoneLabel);
    phoneRow.appendChild(phoneValue);
    phoneRow.appendChild(copyPhoneBtn);
    contactGrid.appendChild(phoneRow);
  }

  const statusRow = document.createElement('div');
  statusRow.className = 'contact-info-row';
  statusRow.innerHTML = `
    <span class="contact-label">Status:</span>
    <span class="lead-status-badge status-${lead.status}">${lead.status}</span>
  `;
  contactGrid.appendChild(statusRow);

  contactCard.appendChild(contactGrid);
  container.appendChild(contactCard);

  const metricsCard = document.createElement('div');
  metricsCard.className = 'lead-info-card';

  const metricsTitle = document.createElement('h4');
  metricsTitle.className = 'lead-section-title';
  metricsTitle.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
    Engagement Metrics
  `;
  metricsCard.appendChild(metricsTitle);

  const metricsGrid = document.createElement('div');
  metricsGrid.className = 'metrics-grid';

  const metrics = [
    { label: 'Total Sessions', value: lead.totalSessions.toString() },
    { label: 'Total Messages', value: lead.totalMessages.toString() },
    { label: 'Lead Score', value: lead.leadScore?.toString() || '-' },
  ];

  metrics.forEach(metric => {
    const metricItem = document.createElement('div');
    metricItem.className = 'metric-item';
    metricItem.innerHTML = `
      <span class="metric-label">${metric.label}</span>
      <span class="metric-value">${metric.value}</span>
    `;
    metricsGrid.appendChild(metricItem);
  });

  metricsCard.appendChild(metricsGrid);

  const datesGrid = document.createElement('div');
  datesGrid.className = 'metrics-grid';
  datesGrid.style.marginTop = '15px';
  datesGrid.style.paddingTop = '15px';
  datesGrid.style.borderTop = '1px solid rgba(0,0,0,0.05)';

  const dates = [
    { label: 'First Contact', value: formatDate(lead.firstContactDate) },
    { label: 'Last Activity', value: formatDate(lead.lastContactDate) },
  ];

  dates.forEach(date => {
    const dateItem = document.createElement('div');
    dateItem.className = 'metric-item';
    dateItem.innerHTML = `
      <span class="metric-label">${date.label}</span>
      <span class="metric-value" style="font-size: 1rem;">${date.value}</span>
    `;
    datesGrid.appendChild(dateItem);
  });

  metricsCard.appendChild(datesGrid);
  container.appendChild(metricsCard);

  const sessionsCard = document.createElement('div');
  sessionsCard.className = 'lead-info-card';

  const sessionsHeader = document.createElement('div');
  sessionsHeader.className = 'session-history-header';

  const sessionsTitle = document.createElement('h4');
  sessionsTitle.className = 'lead-section-title';
  sessionsTitle.style.margin = '0';
  sessionsTitle.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    Session History
  `;

  const sessionCount = document.createElement('span');
  sessionCount.className = 'session-count';
  sessionCount.textContent = `${leadSessions.length} session${leadSessions.length !== 1 ? 's' : ''}`;

  sessionsHeader.appendChild(sessionsTitle);
  sessionsHeader.appendChild(sessionCount);
  sessionsCard.appendChild(sessionsHeader);

  if (leadSessions.length > 0) {
    const sessionsTable = document.createElement('div');
    sessionsTable.className = 'sessions-table';

    const tableHeader = document.createElement('div');
    tableHeader.className = 'session-table-row session-table-header';
    tableHeader.innerHTML = `
      <div class="session-cell">Session ID</div>
      <div class="session-cell">Date</div>
      <div class="session-cell">Msgs</div>
      <div class="session-cell">Status</div>
      <div class="session-cell"></div>
    `;
    sessionsTable.appendChild(tableHeader);

    const sortedSessions = [...leadSessions].sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    sortedSessions.forEach(session => {
      const row = document.createElement('div');
      row.className = 'session-table-row';

      const sessionIdCell = document.createElement('div');
      sessionIdCell.className = 'session-cell session-id-cell';
      sessionIdCell.textContent = session.sessionId.substring(0, 8) + '...';
      sessionIdCell.title = session.sessionId;
      row.appendChild(sessionIdCell);

      const dateCell = document.createElement('div');
      dateCell.className = 'session-cell';
      dateCell.textContent = formatDate(session.startedAt);
      row.appendChild(dateCell);

      const msgsCell = document.createElement('div');
      msgsCell.className = 'session-cell';
      msgsCell.textContent = session.messageCount.toString();
      row.appendChild(msgsCell);

      const statusCell = document.createElement('div');
      statusCell.className = 'session-cell';
      statusCell.innerHTML = `<span class="session-status-badge session-status-${session.status}">${session.status}</span>`;
      row.appendChild(statusCell);

      const arrowCell = document.createElement('div');
      arrowCell.className = 'session-cell session-arrow';
      arrowCell.textContent = '›';
      row.appendChild(arrowCell);

      row.addEventListener('click', async () => {
        await showSessionDetailsModal(businessId, session.sessionId);
      });

      sessionsTable.appendChild(row);
    });

    sessionsCard.appendChild(sessionsTable);
  } else {
    const emptyState = document.createElement('div');
    emptyState.className = 'sessions-empty-state';
    emptyState.textContent = 'No sessions found for this lead.';
    sessionsCard.appendChild(emptyState);
  }

  container.appendChild(sessionsCard);

  const exportBtn = document.createElement('button');
  exportBtn.className = 'lead-export-btn';
  exportBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Export Lead Data
  `;
  exportBtn.addEventListener('click', () => exportLeadToCSV(lead));
  container.appendChild(exportBtn);

  return container;
}


export async function showLeadDetailsModal(
  lead: ContactLead,
  businessId: string
): Promise<void> {
  injectLeadDetailsStyles();


  const loadingContent = document.createElement('div');
  loadingContent.className = 'lead-loading-container';
  
  const spinner = createLoadingSpinner('Loading lead details...');
  loadingContent.appendChild(spinner);

  const modal = showModal({
    title: 'Lead Details',
    content: loadingContent,
    showCloseButton: true
  });

  try {
    const allSessions = await getBusinessSessions(businessId, undefined, 1, 1000);

    const leadSessions = filterSessionsForLead(allSessions, lead);

    const content = buildLeadDetailsContent(lead, leadSessions, businessId);

    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(content);
    }
  } catch (error) {
    console.error('Failed to load lead details:', error);

    const errorContent = document.createElement('div');
    errorContent.className = 'lead-error-message';
    errorContent.innerHTML = `
      <div style="font-size: 40px; margin-bottom: 10px;">⚠️</div>
      <h3 style="margin: 0; color: #dc2626;">Failed to load lead details</h3>
      <p style="color: #666;">Please check your connection and try again.</p>
    `;

    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(errorContent);
    }
  }
}