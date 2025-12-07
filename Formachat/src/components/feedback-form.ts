export function createFeedbackForm(): HTMLElement {
  if (!document.getElementById('feedback-form-styles')) {
    const style = document.createElement('style');
    style.id = 'feedback-form-styles';
    style.textContent = `
      :root {
        --primary: #636b2f;
        --text-main: #1a1a1a;
        --text-muted: #666;
      }

      .feedback-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: none;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 12px;
        padding: 30px;
        max-width: 100%;
        margin: 10 auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }

      .feedback-header {
        margin-bottom: 20px;
        text-align: center;
      }

      .feedback-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text-main);
        margin: 0 0 8px 0;
      }

      .feedback-subtitle {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin: 0;
      }

      .modern-textarea {
        width: 100%;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 14px;
        font-family: inherit;
        font-size: 0.95rem;
        color: var(--text-main);
        resize: vertical;
        min-height: 120px;
        box-sizing: border-box;
        transition: all 0.2s ease;
        outline: none;
      }

      .modern-textarea:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(99, 107, 47, 0.1);
      }
      
      .modern-textarea::placeholder {
        color: #9ca3af;
      }

      .form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        gap: 12px;
      }

      .btn-send {
        background: var(--primary);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.25s ease;
        box-shadow: 0 4px 12px rgba(99, 107, 47, 0.3);
        white-space: nowrap;
      }

      .btn-send:hover {
        background: #4f5625;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(99, 107, 47, 0.4);
      }
      
      .btn-send:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .success-msg {
        color: #059669;
        font-weight: 600;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .success-visible {
        opacity: 1;
      }

      @media (max-width: 768px) {
        .feedback-container {
          padding: 24px 20px;
        }

        .feedback-title {
          font-size: 1.2rem;
        }

        .form-actions {
          flex-direction: column-reverse;
          align-items: stretch;
        }

        .btn-send {
          width: 100%;
          justify-content: center;
        }

        .success-msg {
          text-align: center;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const container = document.createElement('div');
  container.className = 'feedback-container';
  
  const header = document.createElement('div');
  header.className = 'feedback-header';
  
  const heading = document.createElement('h3');
  heading.className = 'feedback-title';
  heading.textContent = 'Share Your Feedback';
  header.appendChild(heading);
  
  const subtitle = document.createElement('p');
  subtitle.className = 'feedback-subtitle';
  subtitle.textContent = 'Help us improve your experience';
  header.appendChild(subtitle);
  
  container.appendChild(header);
  
  const form = document.createElement('form');
  
  const textarea = document.createElement('textarea');
  textarea.name = 'feedback';
  textarea.className = 'modern-textarea';
  textarea.placeholder = 'Share your thoughts, suggestions, or report issues...';
  textarea.required = true;
  form.appendChild(textarea);
  
  const actions = document.createElement('div');
  actions.className = 'form-actions';
  
  const successMsg = document.createElement('span');
  successMsg.className = 'success-msg';
  successMsg.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>Sent successfully!</span>
  `;
  actions.appendChild(successMsg);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-send';
  submitBtn.innerHTML = `
    <span>Send Feedback</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  `;
  actions.appendChild(submitBtn);
  
  form.appendChild(actions);
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedbackText = textarea.value.trim();
    
    if (!feedbackText) return;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Feedback sent:', feedbackText);
    
    submitBtn.innerHTML = '<span>Sent!</span>';
    successMsg.classList.add('success-visible');
    textarea.value = '';
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Send Feedback</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;
      successMsg.classList.remove('success-visible');
    }, 3000);
  });
  
  container.appendChild(form);
  return container;
}