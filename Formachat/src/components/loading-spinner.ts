export function createLoadingSpinner(message: string = 'Loading...'): HTMLElement {
  const container = document.createElement('div');
  container.className = 'loading-spinner-container';
  
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  
  const text = document.createElement('p');
  text.textContent = message;
  
  container.appendChild(spinner);
  container.appendChild(text);
  
  return container;
}

export function showLoadingSpinner(
  parent: HTMLElement,
  message: string = 'Loading...'
): HTMLElement {
  const spinner = createLoadingSpinner(message);
  parent.appendChild(spinner);
  return spinner;
}

export function hideLoadingSpinner(spinner: HTMLElement): void {
  spinner.remove();
}