// components/delete-confirmation.ts

export interface DeleteConfirmationConfig {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function createDeleteConfirmation(config: DeleteConfirmationConfig): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'delete-confirmation-modal';
  
  // Heading
  const heading = document.createElement('h3');
  heading.textContent = 'Confirm Deletion';
  modal.appendChild(heading);
  
  // Message
  const message = document.createElement('p');
  message.textContent = `Are you sure you want to delete "${config.itemName}"? This action cannot be undone.`;
  modal.appendChild(message);
  
  // Buttons container
  const buttons = document.createElement('div');
  buttons.className = 'modal-buttons';
  
  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => {
    config.onCancel();
    overlay.remove();
  });
  buttons.appendChild(cancelBtn);
  
  // Confirm button
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Delete';
  confirmBtn.className = 'btn-danger';
  confirmBtn.addEventListener('click', () => {
    config.onConfirm();
    overlay.remove();
  });
  buttons.appendChild(confirmBtn);
  
  modal.appendChild(buttons);
  overlay.appendChild(modal);
  
  return overlay;
}

export function showDeleteConfirmation(config: DeleteConfirmationConfig): void {
  const modal = createDeleteConfirmation(config);
  document.body.appendChild(modal);
}