// components/empty-state.ts

export interface EmptyStateConfig {
  message: string;
  buttonText?: string;
  buttonPath?: string;
}

export function createEmptyState(config: EmptyStateConfig): HTMLElement {
  const container = document.createElement('div');
  container.className = 'empty-state';
  
  // Message
  const message = document.createElement('p');
  message.textContent = config.message;
  container.appendChild(message);
  
  // Optional button
  if (config.buttonText && config.buttonPath) {
    const button = document.createElement('button');
    button.textContent = config.buttonText;
    button.addEventListener('click', () => {
      window.location.hash = config.buttonPath!;
    });
    container.appendChild(button);
  }
  
  return container;
}