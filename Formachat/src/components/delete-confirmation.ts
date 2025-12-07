export interface DeleteConfirmationConfig {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// --- INJECT STYLES (The High-End UI) ---
function injectDeleteStyles() {
  if (document.getElementById('delete-modal-styles')) return;

  const style = document.createElement('style');
  style.id = 'delete-modal-styles';
  style.textContent = `
    :root {
      --danger-red: #dc2626;
      --danger-bg: #fef2f2;
      --text-main: #1a1a1a;
    }

    /* 1. The Reality Blur Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(25, 25, 25, 0.4); /* Darker dim */
      backdrop-filter: blur(12px); /* heavy blur */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    }

    /* 2. The Modal Card */
    .delete-confirmation-modal {
      background: rgba(255, 255, 255, 0.95);
      width: 90%;
      max-width: 400px;
      padding: 30px;
      border-radius: 24px; /* Super rounded modern look */
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.5);
      text-align: center;
      transform: scale(0.9);
      opacity: 0;
      animation: springPopup 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.1s;
      position: relative;
      overflow: hidden;
    }

    /* Top Red Line */
    .delete-confirmation-modal::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 6px;
      background: linear-gradient(90deg, #ef4444, #b91c1c);
    }

    /* 3. The Pulsing Warning Beacon */
    .icon-wrapper {
      width: 70px;
      height: 70px;
      background: var(--danger-bg);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
      color: var(--danger-red);
      position: relative;
    }

    /* The Pulse Ring Animation */
    .icon-wrapper::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid var(--danger-red);
      opacity: 0;
      animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    .warning-icon {
      width: 32px;
      height: 32px;
    }

    /* 4. Typography */
    .modal-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }

    .modal-message {
      color: #666;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    
    .highlight-item {
      color: var(--text-main);
      font-weight: 700;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* 5. Buttons */
    .modal-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .btn-modal {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      flex: 1;
    }

    .btn-cancel {
      background: white;
      border: 1px solid #e5e7eb;
      color: #374151;
    }
    .btn-cancel:hover {
      background: #f9fafb;
      transform: translateY(-1px);
    }

    .btn-danger {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
    }
    .btn-danger:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 20px rgba(220, 38, 38, 0.5);
    }

    /* Animations */
    @keyframes fadeIn { to { opacity: 1; } }
    @keyframes springPopup { 
      to { opacity: 1; transform: scale(1); } 
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export function createDeleteConfirmation(config: DeleteConfirmationConfig): HTMLElement {
  injectDeleteStyles();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      config.onCancel();
      removeModal(overlay);
    }
  });

  const modal = document.createElement('div');
  modal.className = 'delete-confirmation-modal';
  
  // --- 1. The Pulsing Icon ---
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'icon-wrapper';
  // SVG Exclamation Mark
  iconWrapper.innerHTML = `
    <svg class="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  `;
  modal.appendChild(iconWrapper);

  // --- 2. Content ---
  const heading = document.createElement('h3');
  heading.className = 'modal-title';
  heading.textContent = 'Delete this item?';
  modal.appendChild(heading);

  const message = document.createElement('p');
  message.className = 'modal-message';
  message.innerHTML = `This action cannot be undone. <br/>You are about to delete <span class="highlight-item">${config.itemName}</span> permanently.`;
  modal.appendChild(message);

  // --- 3. Actions ---
  const buttons = document.createElement('div');
  buttons.className = 'modal-buttons';

  // Cancel Button (Auto-focus for safety)
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Keep it';
  cancelBtn.className = 'btn-modal btn-cancel';
  cancelBtn.onclick = () => {
    config.onCancel();
    removeModal(overlay);
  };
  buttons.appendChild(cancelBtn);

  // Delete Button
  const confirmBtn = document.createElement('button');
  confirmBtn.innerHTML = 'Yes, Delete it'; // Stronger language
  confirmBtn.className = 'btn-modal btn-danger';
  confirmBtn.onclick = () => {
    confirmBtn.innerHTML = 'Deleting...'; // Instant feedback
    confirmBtn.style.opacity = '0.7';
    config.onConfirm();
    removeModal(overlay);
  };
  buttons.appendChild(confirmBtn);

  modal.appendChild(buttons);
  overlay.appendChild(modal);

  // Accessibility: Trap focus or focus cancel by default
  setTimeout(() => cancelBtn.focus(), 100);

  return overlay;
}

// Helper to animate out before removing
function removeModal(overlay: HTMLElement) {
  overlay.style.transition = 'opacity 0.2s';
  overlay.style.opacity = '0';
  setTimeout(() => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }, 200);
}

export function showDeleteConfirmation(config: DeleteConfirmationConfig): void {
  const modal = createDeleteConfirmation(config);
  document.body.appendChild(modal);
}