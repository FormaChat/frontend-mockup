export interface EmptyStateConfig {
  message: string;
  buttonText?: string;
  buttonPath?: string;
}

// --- INJECT STYLES ---
function injectEmptyStateStyles() {
  if (document.getElementById('empty-state-styles')) return;

  const style = document.createElement('style');
  style.id = 'empty-state-styles';
  style.textContent = `
    :root {
      --primary: #636b2f;
      --secondary: #bac095;
      --bg-glass: rgba(255, 255, 255, 0.6);
    }

    /* 1. The Container (The "Drop Zone" Vibe) */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      margin: 20px 0;
      
      /* Glass Background */
      background: var(--bg-glass);
      backdrop-filter: blur(5px);
      
      /* Dashed Border = "Placeholder" */
      border: 2px dashed #d1d5db; 
      border-radius: 20px;
      
      text-align: center;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      min-height: 300px;
    }

    /* Hover Interaction: The whole zone wakes up */
    .empty-state:hover {
      border-color: var(--secondary);
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }

    /* 2. The Abstract Illustration */
    .empty-illustration {
      width: 120px;
      height: 120px;
      margin-bottom: 24px;
      position: relative;
      animation: float-y 4s ease-in-out infinite;
    }

    /* The SVG Icon styling */
    .empty-icon-svg {
      width: 100%;
      height: 100%;
      color: var(--secondary);
      opacity: 0.8;
      transition: transform 0.3s ease, color 0.3s ease;
    }

    .empty-state:hover .empty-icon-svg {
      transform: scale(1.1) rotate(-5deg);
      color: var(--primary);
      opacity: 1;
    }

    /* 3. Typography */
    .empty-message {
      font-size: 1.1rem;
      color: #666;
      max-width: 400px;
      line-height: 1.6;
      margin-bottom: 30px;
      font-weight: 500;
    }

    /* 4. Action Button */
    .btn-empty-action {
      padding: 12px 30px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 50px; /* Pill shape */
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      
      /* Button Glow */
      box-shadow: 0 4px 15px rgba(99, 107, 47, 0.3);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-empty-action:hover {
      background: #4f5625;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 107, 47, 0.4);
    }

    /* Plus icon in button */
    .btn-icon-plus {
      font-size: 1.2em;
      line-height: 1;
    }

    /* Animation Keyframes */
    @keyframes float-y {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
}

export function createEmptyState(config: EmptyStateConfig): HTMLElement {
  injectEmptyStateStyles();

  const container = document.createElement('div');
  container.className = 'empty-state';
  
  // --- 1. Visual Illustration (SVG) ---
  const visualContainer = document.createElement('div');
  visualContainer.className = 'empty-illustration';
  
  // Abstract "Open Box" / Search SVG
  visualContainer.innerHTML = `
    <svg class="empty-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `;
  container.appendChild(visualContainer);

  // --- 2. Message ---
  const message = document.createElement('p');
  message.className = 'empty-message';
  message.textContent = config.message;
  container.appendChild(message);
  
  // --- 3. Optional Button ---
  if (config.buttonText && config.buttonPath) {
    const button = document.createElement('button');
    button.className = 'btn-empty-action';
    
    // Add a "+" symbol to make it feel constructive
    button.innerHTML = `<span class="btn-icon-plus">+</span> ${config.buttonText}`;
    
    button.addEventListener('click', () => {
      window.location.hash = config.buttonPath!;
    });
    container.appendChild(button);
  }
  
  return container;
}