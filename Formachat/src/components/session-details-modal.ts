import { showModal } from './modal';
import { getSessionDetails } from '../services/chat.service';
import { createLoadingSpinner } from './loading-spinner';

export async function showSessionDetailsModal(
  businessId: string,
  sessionId: string
): Promise<void> {
  
  const loadingContent = document.createElement('div');
  loadingContent.style.padding = '40px';
  loadingContent.style.textAlign = 'center';
  const spinner = createLoadingSpinner('Loading session details...');
  loadingContent.appendChild(spinner);

  const modal = showModal({
    title: 'Session Details',
    content: loadingContent,
    showCloseButton: true
  });

  try {
    
    const sessionDetails = await getSessionDetails(businessId, sessionId);
    const content = buildSessionDetailsContent(sessionDetails);

    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(content);
    }
  } catch (error) {
    console.error('Failed to load session details:', error);

    const errorContent = document.createElement('div');
    errorContent.className = 'error-message';
    errorContent.style.padding = '20px';
    errorContent.textContent = 'Failed to load session details. Please try again.';

    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = '';
      modalContent.appendChild(errorContent);
    }
  }
}


function buildSessionDetailsContent(sessionDetails: any): HTMLElement {
  const container = document.createElement('div');
  container.className = 'session-details-container';

  // Session Info Section
  const infoSection = document.createElement('div');
  infoSection.className = 'session-info-section';

  const infoGrid = document.createElement('div');
  infoGrid.className = 'session-info-grid';

  // Session ID
  const sessionIdDiv = createInfoItem('Session ID', sessionDetails.session.sessionId);
  infoGrid.appendChild(sessionIdDiv);

  // Status
  const statusDiv = createInfoItem(
    'Status',
    `<span class="status-badge status-${sessionDetails.session.status}">${sessionDetails.session.status}</span>`
  );
  infoGrid.appendChild(statusDiv);

  // Message Count
  const messageCountDiv = createInfoItem(
    'Messages',
    sessionDetails.session.messageCount.toString()
  );
  infoGrid.appendChild(messageCountDiv);

  // Started At
  const startedAtDiv = createInfoItem(
    'Started',
    new Date(sessionDetails.session.startedAt).toLocaleString()
  );
  infoGrid.appendChild(startedAtDiv);

  // Ended At (if available)
  if (sessionDetails.session.endedAt) {
    const endedAtDiv = createInfoItem(
      'Ended',
      new Date(sessionDetails.session.endedAt).toLocaleString()
    );
    infoGrid.appendChild(endedAtDiv);
  }

  infoSection.appendChild(infoGrid);
  container.appendChild(infoSection);

  // Contact Info Section (if captured)
  if (sessionDetails.session.contact?.captured) {
    const contactSection = document.createElement('div');
    contactSection.className = 'contact-info-section';

    const contactHeading = document.createElement('h3');
    contactHeading.textContent = 'Contact Information';
    contactSection.appendChild(contactHeading);

    const contactGrid = document.createElement('div');
    contactGrid.className = 'session-info-grid';

    if (sessionDetails.session.contact.name) {
      const nameDiv = createInfoItem('Name', sessionDetails.session.contact.name);
      contactGrid.appendChild(nameDiv);
    }

    if (sessionDetails.session.contact.email) {
      const emailDiv = createInfoItem('Email', sessionDetails.session.contact.email);
      contactGrid.appendChild(emailDiv);
    }

    if (sessionDetails.session.contact.phone) {
      const phoneDiv = createInfoItem('Phone', sessionDetails.session.contact.phone);
      contactGrid.appendChild(phoneDiv);
    }

    contactSection.appendChild(contactGrid);
    container.appendChild(contactSection);
  }

  // Conversation Section
  const conversationSection = document.createElement('div');
  conversationSection.className = 'conversation-section';

  const conversationHeading = document.createElement('h3');
  conversationHeading.textContent = 'Conversation';
  conversationSection.appendChild(conversationHeading);

  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'messages-container';

  // Render messages
  if (sessionDetails.messages && sessionDetails.messages.length > 0) {
    sessionDetails.messages.forEach((message: any) => {
      const messageDiv = createMessageBubble(message);
      messagesContainer.appendChild(messageDiv);
    });
  } else {
    const emptyState = document.createElement('p');
    emptyState.textContent = 'No messages in this session yet.';
    emptyState.style.textAlign = 'center';
    emptyState.style.color = '#999';
    emptyState.style.padding = '20px';
    messagesContainer.appendChild(emptyState);
  }

  conversationSection.appendChild(messagesContainer);
  container.appendChild(conversationSection);

  return container;
}

/**
 * Create an info item (label + value)
 */
function createInfoItem(label: string, value: string): HTMLElement {
  const div = document.createElement('div');
  div.className = 'info-item';

  const labelElement = document.createElement('span');
  labelElement.className = 'info-label';
  labelElement.textContent = label + ':';
  div.appendChild(labelElement);

  const valueElement = document.createElement('span');
  valueElement.className = 'info-value';
  valueElement.innerHTML = value;
  div.appendChild(valueElement);

  return div;
}


//Create a message bubble
 
function createMessageBubble(message: any): HTMLElement {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-bubble message-${message.role}`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = message.content;
  messageDiv.appendChild(contentDiv);

  const timestampDiv = document.createElement('div');
  timestampDiv.className = 'message-timestamp';
  timestampDiv.textContent = new Date(message.timestamp).toLocaleTimeString();
  messageDiv.appendChild(timestampDiv);

  return messageDiv;
}