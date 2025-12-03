// components/modal.ts

export interface ModalConfig {
  title: string;
  content: HTMLElement | string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function createModal(config: ModalConfig): HTMLElement {
  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Modal container
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';
  
  const title = document.createElement('h2');
  title.textContent = config.title;
  header.appendChild(title);
  
  // Close button (optional)
  if (config.showCloseButton !== false) {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.className = 'modal-close';
    closeBtn.addEventListener('click', () => {
      closeModal(overlay);
      if (config.onClose) config.onClose();
    });
    header.appendChild(closeBtn);
  }
  
  modal.appendChild(header);
  
  // Content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'modal-content';
  
  if (typeof config.content === 'string') {
    contentDiv.innerHTML = config.content;
  } else {
    contentDiv.appendChild(config.content);
  }
  
  modal.appendChild(contentDiv);
  
  // Append modal to overlay
  overlay.appendChild(modal);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
      if (config.onClose) config.onClose();
    }
  });
  
  return overlay;
}

/**
 * Show modal (append to body)
 */
export function showModal(config: ModalConfig): HTMLElement {
  const modal = createModal(config);
  document.body.appendChild(modal);
  return modal;
}

/**
 * Close and remove modal
 */
export function closeModal(modal: HTMLElement): void {
  modal.remove();
}

/**
 * Close all open modals
 */
export function closeAllModals(): void {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => modal.remove());
}