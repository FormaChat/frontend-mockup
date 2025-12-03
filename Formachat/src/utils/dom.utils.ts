/**
 * ========================================
 * DOM MANIPULATION HELPERS
 * ========================================
 * 
 * Utility functions for common DOM operations.
 * 
 * Functions:
 * - Element selection
 * - Element creation
 * - Show/hide elements
 * - Clear content
 * - Form handling
 * - Loading states
 */

/**
 * Get element by ID (with type safety)
 */
export const getElementById = <T extends HTMLElement = HTMLElement>(id: string): T | null => {
  return document.getElementById(id) as T | null;
};

/**
 * Query selector (with type safety)
 */
export const querySelector = <T extends HTMLElement = HTMLElement>(selector: string): T | null => {
  return document.querySelector(selector) as T | null;
};

/**
 * Query all elements (with type safety)
 */
export const querySelectorAll = <T extends HTMLElement = HTMLElement>(
  selector: string
): NodeListOf<T> => {
  return document.querySelectorAll(selector) as NodeListOf<T>;
};

/**
 * Create element with optional attributes and content
 */
export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    id?: string;
    textContent?: string;
    innerHTML?: string;
    attributes?: Record<string, string>;
    style?: Partial<CSSStyleDeclaration>;
  }
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);

  if (options?.className) element.className = options.className;
  if (options?.id) element.id = options.id;
  if (options?.textContent) element.textContent = options.textContent;
  if (options?.innerHTML) element.innerHTML = options.innerHTML;

  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options?.style) {
    Object.assign(element.style, options.style);
  }

  return element;
};

/**
 * Show element
 */
export const show = (element: HTMLElement): void => {
  element.style.display = '';
};

/**
 * Hide element
 */
export const hide = (element: HTMLElement): void => {
  element.style.display = 'none';
};

/**
 * Toggle element visibility
 */
export const toggle = (element: HTMLElement): void => {
  if (element.style.display === 'none') {
    show(element);
  } else {
    hide(element);
  }
};

/**
 * Clear element content
 */
export const clearContent = (element: HTMLElement): void => {
  element.innerHTML = '';
};

/**
 * Render content to element (replaces existing content)
 */
export const renderTo = (element: HTMLElement, content: string | HTMLElement): void => {
  if (typeof content === 'string') {
    element.innerHTML = content;
  } else {
    clearContent(element);
    element.appendChild(content);
  }
};

/**
 * Append content to element
 */
export const appendTo = (element: HTMLElement, content: string | HTMLElement): void => {
  if (typeof content === 'string') {
    element.insertAdjacentHTML('beforeend', content);
  } else {
    element.appendChild(content);
  }
};

/**
 * Get form data as object
 */
export const getFormData = (form: HTMLFormElement): Record<string, any> => {
  const formData = new FormData(form);
  const data: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Handle checkboxes (multiple values with same name)
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });

  return data;
};

/**
 * Set form values from object
 */
export const setFormData = (form: HTMLFormElement, data: Record<string, any>): void => {
  Object.entries(data).forEach(([key, value]) => {
    const element = form.elements.namedItem(key) as HTMLInputElement | null;
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = !!value;
      } else {
        element.value = String(value);
      }
    }
  });
};

/**
 * Disable form (show loading state)
 */
export const disableForm = (form: HTMLFormElement): void => {
  const elements = form.querySelectorAll('input, button, select, textarea');
  elements.forEach((el) => {
    (el as HTMLInputElement).disabled = true;
  });
};

/**
 * Enable form (remove loading state)
 */
export const enableForm = (form: HTMLFormElement): void => {
  const elements = form.querySelectorAll('input, button, select, textarea');
  elements.forEach((el) => {
    (el as HTMLInputElement).disabled = false;
  });
};

/**
 * Show error message in element
 */
export const showError = (element: HTMLElement, message: string): void => {
  element.textContent = message;
  element.style.color = 'red';
  element.style.fontSize = '14px';
  element.style.marginTop = '8px';
  show(element);
};

/**
 * Hide error message
 */
export const hideError = (element: HTMLElement): void => {
  hide(element);
  element.textContent = '';
};

/**
 * Show success message in element
 */
export const showSuccess = (element: HTMLElement, message: string): void => {
  element.textContent = message;
  element.style.color = 'green';
  element.style.fontSize = '14px';
  element.style.marginTop = '8px';
  show(element);
};

/**
 * Set loading state on button
 */
export const setButtonLoading = (button: HTMLButtonElement, loading: boolean): void => {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent || '';
    button.textContent = 'Loading...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
    delete button.dataset.originalText;
  }
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Add event listener with cleanup
 */
export const addListener = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void
): () => void => {
  element.addEventListener(event, handler as EventListener);
  
  // Return cleanup function
  return () => {
    element.removeEventListener(event, handler as EventListener);
  };
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime for display
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | undefined;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
};

/**
 * Confirm action with user
 */
export const confirm = (message: string): boolean => {
  return window.confirm(message);
};

/**
 * Alert user
 */
export const alert = (message: string): void => {
  window.alert(message);
};