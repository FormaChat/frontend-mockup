import { showModal } from './modal';
import { getSessionDetails, deleteSession } from '../services/chat.service';
import { createLoadingSpinner } from './loading-spinner';
import { showDeleteConfirmation } from './delete-confirmation';

function injectSessionStyles() {
  if (document.getElementById('session-details-styles')) return;

  const style = document.createElement('style');
  style.id = 'session-details-styles';
  style.textContent = `
    :root {
      --primary: #636b2f;
      --secondary: #bac095;
      --bg-chat: #f9f9f9;
      --bubble-user: #636b2f;
      --bubble-ai: #ffffff;
      --text-main: #1a1a1a;
      --text-muted: #666;
      --bg-glass: rgba(255, 255, 255, 0.85);
      --danger: #ef4444;
      --success: #10b981;
    }

    .session-details-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding-bottom: 20px;
      width: 100%;
    }

    /* --- GLASS CARDS --- */
    .info-card {
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.6);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Header Row */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px dashed rgba(0,0,0,0.1);
    }

    /* Remove border for transcript header to look cleaner */
    .card-header.no-border {
      border-bottom: none;
      padding-bottom: 0;
    }

    .section-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin: 0;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* --- INFO GRID --- */
    .session-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
    .info-value { font-size: 0.95rem; font-weight: 600; color: var(--text-main); word-break: break-all; }

    /* --- BADGES --- */
    .status-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .status-active { background: #dcfce7; color: #166534; }
    .status-closed { background: #f3f4f6; color: #4b5563; }
    .status-deleted { background: #fee2e2; color: #991b1b; }

    /* --- TRANSCRIPT AREA --- */
    .messages-container {
      background: var(--bg-chat);
      border-radius: 12px;
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
      border: 1px solid rgba(0,0,0,0.05);
      scroll-behavior: smooth;
    }

    .messages-container::-webkit-scrollbar { width: 6px; }
    .messages-container::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }

    /* Message Bubbles */
    .message-bubble { 
      max-width: 80%; 
      padding: 12px 16px; 
      border-radius: 12px; 
      position: relative; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); 
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .message-assistant { align-self: flex-start; background: var(--bubble-ai); border: 1px solid #e5e7eb; border-bottom-left-radius: 2px; color: var(--text-main); }
    .message-user { align-self: flex-end; background: var(--primary); color: white; border-bottom-right-radius: 2px; }
    .message-system { align-self: center; background: transparent; box-shadow: none; font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 5px; text-align: center; }
    
    .message-timestamp { font-size: 0.7rem; margin-top: 4px; opacity: 0.7; text-align: right; }

    /* --- DELETE BUTTON --- */
    .delete-btn-sm {
      background: transparent;
      color: var(--danger);
      border: 1px solid var(--danger);
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .delete-btn-sm:hover {
      background: var(--danger);
      color: white;
    }
    .delete-btn-sm:disabled { opacity: 0.5; cursor: not-allowed; }

    /* --- DELETED STATE --- */
    .deleted-placeholder {
      text-align: center;
      padding: 40px;
      background: #fef2f2;
      border-radius: 12px;
      border: 1px dashed #fecaca;
      color: #991b1b;
    }
  `;
  document.head.appendChild(style);
}

export async function showSessionDetailsModal(businessId: string, sessionId: string): Promise<void> {
  injectSessionStyles();

  const loadingContent = document.createElement('div');
  loadingContent.style.padding = '60px 20px';
  loadingContent.style.textAlign = 'center';
  const spinner = createLoadingSpinner('Retrieving session...');
  loadingContent.appendChild(spinner);

  const modal = showModal({
    title: 'Session Details',
    content: loadingContent,
    showCloseButton: true
  });

  try {
    const sessionDetails = await getSessionDetails(businessId, sessionId);
    const content = buildSessionDetailsContent(sessionDetails, businessId, sessionId);

    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(content);
    }
  } catch (error) {
    console.error('Failed to load session details:', error);
    const errorContent = document.createElement('div');
    errorContent.style.padding = '30px';
    errorContent.style.textAlign = 'center';
    errorContent.innerHTML = `<h3 style="color: #ef4444;">Failed to load session</h3>`;
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(errorContent);
    }
  }
}

function buildSessionDetailsContent(sessionDetails: any, businessId: string, sessionId: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'session-details-container';

  const isDeleted = !!sessionDetails.session.deletedAt;

  // --- CARD 1: METADATA ---
  const infoSection = document.createElement('div');
  infoSection.className = 'info-card';

  const headerRow = document.createElement('div');
  headerRow.className = 'card-header';

  const infoTitle = document.createElement('h4');
  infoTitle.className = 'section-title';
  infoTitle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Metadata`;
  headerRow.appendChild(infoTitle);

  // Delete Button Logic (Only show if NOT deleted)
  if (!isDeleted) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn-sm';
    deleteBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete`;

    deleteBtn.addEventListener('click', async () => {
      // ... (Keep your exact Delete Logic here) ...
      const hasMessages = sessionDetails.session.messageCount > 0;
      const hasContact = sessionDetails.session.contact?.captured;
      let warningMessage = 'This session will be marked as deleted.';
      if (hasMessages || hasContact) {
        warningMessage = `<strong>⚠️ Warning:</strong> This session contains captured data. It will be marked as deleted.`;
      }

      showDeleteConfirmation({
        itemName: `Session ${sessionDetails.session.sessionId.substring(0, 8)}...`,
        onConfirm: async () => {
          try {
            deleteBtn.disabled = true;
            deleteBtn.textContent = '...';
            await deleteSession(businessId, sessionId);
            
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) overlay.remove();

            // Simple Success Modal that reloads on close
            showModal({
                title: 'Success', 
                content: '<div style="padding:20px;text-align:center">Session deleted successfully.</div>',
                showCloseButton: true,
                onClose: () => window.location.reload()
            });
          } catch (error) {
            alert('Failed to delete session.');
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = 'Delete';
          }
        },
        onCancel: () => {}
      });
    });
    headerRow.appendChild(deleteBtn);
  } else {
    // Show Deleted Badge
    const delBadge = document.createElement('span');
    delBadge.style.color = 'var(--danger)';
    delBadge.style.fontWeight = '700';
    delBadge.style.fontSize = '0.8rem';
    delBadge.textContent = '⛔ DELETED';
    headerRow.appendChild(delBadge);
  }

  infoSection.appendChild(headerRow);

  const infoGrid = document.createElement('div');
  infoGrid.className = 'session-info-grid';
  infoGrid.appendChild(createInfoItem('Session ID', sessionDetails.session.sessionId));
  
  // Status Badge
  const statusLabel = isDeleted ? 'Deleted' : sessionDetails.session.status;
  const statusClass = isDeleted ? 'status-deleted' : `status-${sessionDetails.session.status.toLowerCase()}`;
  infoGrid.appendChild(createInfoItem('Status', `<span class="status-badge ${statusClass}">${statusLabel}</span>`));
  
  infoGrid.appendChild(createInfoItem('Started', new Date(sessionDetails.session.startedAt).toLocaleString()));
  if (sessionDetails.session.endedAt) {
    infoGrid.appendChild(createInfoItem('Ended', new Date(sessionDetails.session.endedAt).toLocaleString()));
  }
  infoGrid.appendChild(createInfoItem('Messages', sessionDetails.session.messageCount.toString()));
  
  infoSection.appendChild(infoGrid);
  container.appendChild(infoSection);


  // --- CARD 2: CONTACT (Optional) ---
  if (sessionDetails.session.contact?.captured) {
    const contactSection = document.createElement('div');
    contactSection.className = 'info-card'; // Wrapper Card

    const contactHeader = document.createElement('div');
    contactHeader.className = 'card-header';
    contactHeader.innerHTML = `<h4 class="section-title" style="color:var(--primary)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Captured Contact</h4>`;
    contactSection.appendChild(contactHeader);

    const contactGrid = document.createElement('div');
    contactGrid.className = 'session-info-grid';
    if (sessionDetails.session.contact.name) contactGrid.appendChild(createInfoItem('Name', sessionDetails.session.contact.name));
    if (sessionDetails.session.contact.email) contactGrid.appendChild(createInfoItem('Email', `<a href="mailto:${sessionDetails.session.contact.email}" style="color:var(--primary)">${sessionDetails.session.contact.email}</a>`));
    if (sessionDetails.session.contact.phone) contactGrid.appendChild(createInfoItem('Phone', sessionDetails.session.contact.phone));
    
    contactSection.appendChild(contactGrid);
    container.appendChild(contactSection);
  }


  // --- CARD 3: TRANSCRIPT ---
  const conversationCard = document.createElement('div');
  conversationCard.className = 'info-card'; // Wrapper Card

  const convHeader = document.createElement('div');
  convHeader.className = 'card-header no-border'; // Cleaner look for chat
  convHeader.innerHTML = `<h4 class="section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Transcript</h4>`;
  conversationCard.appendChild(convHeader);

  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'messages-container';

  if (isDeleted) {
    const deletedState = document.createElement('div');
    deletedState.className = 'deleted-placeholder';
    deletedState.innerHTML = `
      <div style="font-size: 32px; margin-bottom: 10px;">🗑️</div>
      <h3 style="margin: 0 0 5px 0; font-weight: 700;">Session Deleted</h3>
      <p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">The transcript is hidden because this session was deleted.</p>
    `;
    messagesContainer.appendChild(deletedState);
    messagesContainer.style.overflow = 'hidden';
  } else if (sessionDetails.messages && sessionDetails.messages.length > 0) {
    sessionDetails.messages.forEach((message: any) => {
      messagesContainer.appendChild(createMessageBubble(message));
    });
    setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 100);
  } else {
    messagesContainer.innerHTML = '<div style="text-align:center;padding:30px;color:#999"><i>No messages recorded.</i></div>';
  }

  conversationCard.appendChild(messagesContainer);
  container.appendChild(conversationCard);

  return container;
}

function createInfoItem(label: string, valueHtml: string): HTMLElement {
  const div = document.createElement('div');
  div.className = 'info-item';
  div.innerHTML = `<span class="info-label">${label}</span><span class="info-value">${valueHtml}</span>`;
  return div;
}

function createMessageBubble(message: any): HTMLElement {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-bubble message-${message.role}`;
  messageDiv.innerHTML = `
    <div class="message-content">${message.content}</div>
    ${message.role !== 'system' ? `<div class="message-timestamp">${new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>` : ''}
  `;
  return messageDiv;
}