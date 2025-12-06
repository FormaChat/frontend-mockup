// pages/public/chat-widget.ts
import { getBusinessById } from '../../services/business.service';
import { 
  createChatSession, 
  sendChatMessage,
  endChatSession
} from '../../services/chat.service';

export async function renderChatWidget(businessId: string, embedMode: boolean = false): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'chat-widget-container';
  
  // Check BOTH: router param OR URL param (for direct access AND widget.js)
  const urlParams = new URLSearchParams(window.location.search);
  const isEmbedMode = embedMode || urlParams.get('embed') === 'true';
  
  container.style.cssText = `
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${isEmbedMode ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  `;
  
  console.log('[Chat Widget] Embed mode:', isEmbedMode, '(router:', embedMode, ', URL:', urlParams.get('embed'), ')');
  
  // Show loading
  const loadingDiv = createLoadingView();
  container.appendChild(loadingDiv);
  
  try {
    // Fetch business details
    const business = await getBusinessById(businessId);
    
    // Check if business is available
    if (!business.isActive || business.freezeInfo?.isFrozen) {
      container.removeChild(loadingDiv);
      const errorView = createErrorView(
        '⚠️ Service Unavailable',
        'This chatbot is currently unavailable. Please try again later.'
      );
      container.appendChild(errorView);
      return container;
    }
    
    // Create chat session
    const session = await createChatSession(businessId);
    
    // Remove loading, show chat
    container.removeChild(loadingDiv);
    
    // Build chat UI - use combined isEmbedMode
    const chatUI = createChatUI(business, session, isEmbedMode);
    container.appendChild(chatUI);
    
  } catch (error: any) {
    console.error('[Chat Widget] Initialization failed:', error);
    container.removeChild(loadingDiv);
    
    const errorView = createErrorView(
      '❌ Connection Error',
      error.message || 'Failed to start chat. Please refresh and try again.'
    );
    container.appendChild(errorView);
  }
  
  return container;
}

/**
 * Create loading view
 */
function createLoadingView(): HTMLElement {
  const loading = document.createElement('div');
  loading.style.cssText = `
    text-align: center;
    color: white;
  `;
  loading.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 20px;">🤖</div>
    <div style="font-size: 18px; font-weight: 600;">Starting chat...</div>
  `;
  return loading;
}

/**
 * Create error view
 */
function createErrorView(title: string, message: string): HTMLElement {
  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = `
    text-align: center;
    color: white;
    max-width: 400px;
    padding: 40px;
  `;
  
  errorContainer.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 20px;">${title.includes('⚠️') ? '⚠️' : '❌'}</div>
    <h2 style="font-size: 24px; margin-bottom: 10px;">${title}</h2>
    <p style="font-size: 16px; opacity: 0.9;">${message}</p>
  `;
  
  return errorContainer;
}

/**
 * Create the main chat UI
 */
function createChatUI(
  business: any,
  session: { sessionId: string; businessInfo: any },
  isEmbedMode: boolean
): HTMLElement {
  const chatContainer = document.createElement('div');
  chatContainer.className = 'chat-ui';
  chatContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${isEmbedMode ? '100%' : '600px'};
    height: ${isEmbedMode ? '100%' : '100vh'};
    background: white;
    border-radius: ${isEmbedMode ? '0' : '0'};
    overflow: hidden;
    box-shadow: ${isEmbedMode ? 'none' : '0 8px 32px rgba(0,0,0,0.2)'};
  `;
  
  // Header
  const header = createChatHeader(business, session.sessionId);
  chatContainer.appendChild(header);
  
  // Messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'chat-messages';
  messagesContainer.id = 'chat-messages';
  messagesContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f5f5f5;
  `;
  chatContainer.appendChild(messagesContainer);
  
  // Show greeting
  const greeting = session.businessInfo?.chatbotGreeting || 
    `Hi! Welcome to ${business.basicInfo.businessName}. How can I help you today?`;
  
  addMessageToUI(messagesContainer, greeting, 'bot');
  
  // Input area
  const inputArea = createInputArea(session.sessionId, messagesContainer);
  chatContainer.appendChild(inputArea);
  
  return chatContainer;
}

/**
 * Create chat header
 */
function createChatHeader(business: any, sessionId: string): HTMLElement {
  const header = document.createElement('div');
  header.className = 'chat-header';
  header.style.cssText = `
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;
  
  // Left side: Avatar + Info
  const leftSide = document.createElement('div');
  leftSide.style.cssText = 'display: flex; align-items: center; gap: 15px;';
  
  const avatar = document.createElement('div');
  avatar.style.cssText = `
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  `;
  avatar.textContent = '🤖';
  leftSide.appendChild(avatar);
  
  const info = document.createElement('div');
  const name = document.createElement('div');
  name.style.cssText = 'font-weight: 600; font-size: 16px;';
  name.textContent = business.basicInfo.businessName;
  info.appendChild(name);
  
  const status = document.createElement('div');
  status.style.cssText = 'font-size: 12px; opacity: 0.9;';
  status.textContent = '🟢 Online';
  info.appendChild(status);
  
  leftSide.appendChild(info);
  header.appendChild(leftSide);
  
  // Right side: End Chat button
  const endButton = document.createElement('button');
  endButton.textContent = 'End Chat';
  endButton.style.cssText = `
    padding: 8px 16px;
    background: rgba(255,255,255,0.2);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;
  
  endButton.addEventListener('mouseover', () => {
    endButton.style.background = 'rgba(255,255,255,0.3)';
  });
  
  endButton.addEventListener('mouseout', () => {
    endButton.style.background = 'rgba(255,255,255,0.2)';
  });
  
  endButton.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to end this chat?')) return;
    
    try {
      await endChatSession(sessionId);
      
      // Show end message
      const messagesContainer = document.getElementById('chat-messages');
      if (messagesContainer) {
        addMessageToUI(messagesContainer, '✓ Chat session ended. Thank you!', 'system');
      }
      
      // Disable input
      const input = document.getElementById('chat-input') as HTMLInputElement;
      const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
      if (input) input.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      
      endButton.disabled = true;
      endButton.textContent = 'Chat Ended';
      
    } catch (error: any) {
      alert('Failed to end chat: ' + error.message);
    }
  });
  
  header.appendChild(endButton);
  
  return header;
}

/**
 * Create input area
 */
function createInputArea(sessionId: string, messagesContainer: HTMLElement): HTMLElement {
  const inputContainer = document.createElement('div');
  inputContainer.className = 'chat-input-area';
  inputContainer.style.cssText = `
    padding: 15px 20px;
    background: white;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 10px;
  `;
  
  // Input field
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'chat-input';
  input.placeholder = 'Type your message...';
  input.style.cssText = `
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  `;
  
  input.addEventListener('focus', () => {
    input.style.borderColor = '#667eea';
  });
  
  input.addEventListener('blur', () => {
    input.style.borderColor = '#e0e0e0';
  });
  
  inputContainer.appendChild(input);
  
  // Send button
  const sendButton = document.createElement('button');
  sendButton.id = 'send-btn';
  sendButton.textContent = '➤';
  sendButton.style.cssText = `
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  `;
  
  sendButton.addEventListener('mouseover', () => {
    sendButton.style.transform = 'scale(1.05)';
  });
  
  sendButton.addEventListener('mouseout', () => {
    sendButton.style.transform = 'scale(1)';
  });
  
  sendButton.disabled = true;
  sendButton.style.opacity = '0.5';
  
  inputContainer.appendChild(sendButton);
  
  // Enable/disable send button based on input
  input.addEventListener('input', () => {
    const hasText = input.value.trim().length > 0;
    sendButton.disabled = !hasText;
    sendButton.style.opacity = hasText ? '1' : '0.5';
  });
  
  // Handle send
  const handleSend = async () => {
    const message = input.value.trim();
    if (!message) return;
    
    // Disable input
    input.disabled = true;
    sendButton.disabled = true;
    
    // Show user message
    addMessageToUI(messagesContainer, message, 'user');
    input.value = '';
    
    // Show typing indicator
    const typingId = addTypingIndicator(messagesContainer);
    
    try {
      // Send to backend
      const response = await sendChatMessage(sessionId, message);
      
      // Remove typing
      removeTypingIndicator(typingId);
      
      // Show bot response
      addMessageToUI(messagesContainer, response.message.content, 'bot');
      
      // Show contact captured message if applicable
      if (response.contactCaptured) {
        addMessageToUI(messagesContainer, '✓ Contact information saved', 'system');
      }
      
    } catch (error: any) {
      console.error('[Chat Widget] Send failed:', error);
      removeTypingIndicator(typingId);
      addMessageToUI(
        messagesContainer,
        'Sorry, something went wrong. Please try again.',
        'system'
      );
    } finally {
      // Re-enable input
      input.disabled = false;
      input.focus();
    }
  };
  
  // Send on button click
  sendButton.addEventListener('click', handleSend);
  
  // Send on Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendButton.disabled) {
      handleSend();
    }
  });
  
  return inputContainer;
}

/**
 * Add message to UI
 */
function addMessageToUI(container: HTMLElement, text: string, type: 'user' | 'bot' | 'system'): void {
  const bubble = document.createElement('div');
  bubble.className = `message-bubble message-${type}`;
  bubble.style.cssText = `
    margin-bottom: 12px;
    display: flex;
    ${type === 'user' ? 'justify-content: flex-end' : 'justify-content: flex-start'};
    ${type === 'system' ? 'justify-content: center' : ''};
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    max-width: ${type === 'system' ? '90%' : '70%'};
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    ${
      type === 'user'
        ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-bottom-right-radius: 4px;'
        : type === 'bot'
        ? 'background: white; color: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-bottom-left-radius: 4px;'
        : 'background: #fff3cd; color: #856404; text-align: center; font-size: 13px;'
    }
  `;
  content.textContent = text;
  bubble.appendChild(content);
  
  container.appendChild(bubble);
  scrollToBottom(container);
}

/**
 * Add typing indicator
 */
let typingCounter = 0;
function addTypingIndicator(container: HTMLElement): string {
  const id = `typing-${typingCounter++}`;
  
  const indicator = document.createElement('div');
  indicator.id = id;
  indicator.style.cssText = `
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-start;
  `;
  
  const dots = document.createElement('div');
  dots.style.cssText = `
    padding: 12px 16px;
    border-radius: 18px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    font-size: 20px;
  `;
  dots.textContent = '...';
  indicator.appendChild(dots);
  
  container.appendChild(indicator);
  scrollToBottom(container);
  
  return id;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator(id: string): void {
  const indicator = document.getElementById(id);
  if (indicator) indicator.remove();
}

/**
 * Scroll to bottom
 */
function scrollToBottom(container: HTMLElement): void {
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 10);
}