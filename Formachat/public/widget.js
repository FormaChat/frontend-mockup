
(function() {
  'use strict';
  
  const FormachatWidget = {
    config: {
      businessId: null,
      position: 'bottom-right', 
      primaryColor: '#667eea',
      baseUrl: 'https://formachat.com'
    },
    
    isOpen: false,
    container: null,
    button: null,
    iframe: null,
    
    /**
     * Initialize the widget
     */
    init: function(options) {
      // Merge options
      this.config = { ...this.config, ...options };
      
      if (!this.config.businessId) {
        console.error('[Formachat Widget] businessId is required');
        return;
      }
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.render());
      } else {
        this.render();
      }
    },
    
    /**
     * Render the widget
     */
    render: function() {
      // Create container
      this.container = document.createElement('div');
      this.container.id = 'formachat-widget-container';
      this.container.style.cssText = this.getContainerStyles();
      
      // Create floating button
      this.button = document.createElement('button');
      this.button.id = 'formachat-widget-button';
      this.button.innerHTML = '💬';
      this.button.style.cssText = this.getButtonStyles();
      this.button.addEventListener('click', () => this.toggle());
      
      // Create iframe (hidden initially)
      this.iframe = document.createElement('iframe');
      this.iframe.id = 'formachat-widget-iframe';
      this.iframe.src = `${this.config.baseUrl}/#/chat/${this.config.businessId}?embed=true`;
      this.iframe.style.cssText = this.getIframeStyles(false);
      this.iframe.setAttribute('frameborder', '0');
      this.iframe.setAttribute('allow', 'clipboard-write');
      
      // Append to container
      this.container.appendChild(this.iframe);
      this.container.appendChild(this.button);
      
      // Append to body
      document.body.appendChild(this.container);
      
      console.log('[Formachat Widget] Initialized');
    },
    
    /**
     * Toggle widget open/close
     */
    toggle: function() {
      this.isOpen = !this.isOpen;
      
      if (this.isOpen) {
        this.open();
      } else {
        this.close();
      }
    },
    
    /**
     * Open widget
     */
    open: function() {
      this.isOpen = true;
      this.iframe.style.cssText = this.getIframeStyles(true);
      this.button.innerHTML = '✕';
      this.button.style.fontSize = '24px';
    },
    
    /**
     * Close widget
     */
    close: function() {
      this.isOpen = false;
      this.iframe.style.cssText = this.getIframeStyles(false);
      this.button.innerHTML = '💬';
      this.button.style.fontSize = '28px';
    },
    
    /**
     * Get container styles
     */
    getContainerStyles: function() {
      const position = this.config.position;
      const right = position.includes('right') ? '20px' : 'auto';
      const left = position.includes('left') ? '20px' : 'auto';
      
      return `
        position: fixed;
        bottom: 20px;
        right: ${right};
        left: ${left};
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
    },
    
    /**
     * Get button styles
     */
    getButtonStyles: function() {
      return `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, ${this.config.primaryColor} 0%, #764ba2 100%);
        color: white;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
        position: relative;
      `;
    },
    
    /**
     * Get iframe styles
     */
    getIframeStyles: function(isOpen) {
      return `
        position: absolute;
        bottom: 80px;
        right: 0;
        width: ${isOpen ? '400px' : '0'};
        height: ${isOpen ? '600px' : '0'};
        max-height: calc(100vh - 120px);
        border-radius: 12px;
        box-shadow: ${isOpen ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none'};
        opacity: ${isOpen ? '1' : '0'};
        visibility: ${isOpen ? 'visible' : 'hidden'};
        transition: all 0.3s ease;
        background: white;
      `;
    }
  };
  
  // Expose globally
  window.FormachatWidget = FormachatWidget;
  
})();