// pages/dashboard/channels/detail.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { getBusinessById } from '../../../services/business.service';

export async function renderChannelsDetail(businessId: string): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'channels-detail';
  
  // Show loading spinner
  const spinner = createLoadingSpinner('Loading business details...');
  container.appendChild(spinner);
  
  try {
    // Fetch business details
    const business = await getBusinessById(businessId);
    
    // Remove spinner
    hideLoadingSpinner(spinner);
    
    // Breadcrumb
    const breadcrumb = createBreadcrumb([
      { label: 'Channels', path: '#/dashboard/channels' },
      { label: business.basicInfo.businessName }
    ]);
    container.appendChild(breadcrumb);
    
    // Page heading
    const heading = document.createElement('h1');
    heading.textContent = `Channels - ${business.basicInfo.businessName}`;
    container.appendChild(heading);
    
    // Test Bot Section
    const testBotSection = document.createElement('section');
    testBotSection.className = 'test-bot-section';
    
    const testBotHeading = document.createElement('h2');
    testBotHeading.textContent = 'Test Your Bot';
    testBotSection.appendChild(testBotHeading);
    
    const testBotButton = document.createElement('button');
    testBotButton.textContent = 'Launch Bot Test';
    testBotButton.addEventListener('click', () => {
      // TODO: Open bot testing interface
      alert('Bot testing interface will open here');
    });
    testBotSection.appendChild(testBotButton);
    
    container.appendChild(testBotSection);
    
    // QR Code Section
    const qrSection = document.createElement('section');
    qrSection.className = 'qr-section';
    
    const qrHeading = document.createElement('h2');
    qrHeading.textContent = 'QR Code';
    qrSection.appendChild(qrHeading);
    
    const qrPlaceholder = document.createElement('div');
    qrPlaceholder.className = 'qr-placeholder';
    qrPlaceholder.textContent = '[QR Code will be generated here]';
    qrSection.appendChild(qrPlaceholder);
    
    const downloadQrButton = document.createElement('button');
    downloadQrButton.textContent = 'Download QR Code';
    downloadQrButton.addEventListener('click', () => {
      // TODO: Download QR code
      alert('QR code download will happen here');
    });
    qrSection.appendChild(downloadQrButton);
    
    container.appendChild(qrSection);
    
    // Shareable URLs Section
    const urlsSection = document.createElement('section');
    urlsSection.className = 'urls-section';
    
    const urlsHeading = document.createElement('h2');
    urlsHeading.textContent = 'Shareable URLs';
    urlsSection.appendChild(urlsHeading);
    
    // Web URL
    const webUrlContainer = document.createElement('div');
    webUrlContainer.className = 'url-container';
    
    const webUrlLabel = document.createElement('label');
    webUrlLabel.textContent = 'Web Chat URL:';
    webUrlContainer.appendChild(webUrlLabel);
    
    const webUrlInput = document.createElement('input');
    webUrlInput.type = 'text';
    webUrlInput.readOnly = true;
    webUrlInput.value = `https://formachat.com/bot/${business._id}`;
    webUrlContainer.appendChild(webUrlInput);
    
    const copyWebUrlButton = document.createElement('button');
    copyWebUrlButton.textContent = 'Copy';
    copyWebUrlButton.addEventListener('click', () => {
      navigator.clipboard.writeText(webUrlInput.value);
      alert('URL copied to clipboard!');
    });
    webUrlContainer.appendChild(copyWebUrlButton);
    
    urlsSection.appendChild(webUrlContainer);
    
    // WhatsApp URL
    const whatsappUrlContainer = document.createElement('div');
    whatsappUrlContainer.className = 'url-container';
    
    const whatsappUrlLabel = document.createElement('label');
    whatsappUrlLabel.textContent = 'WhatsApp Link:';
    whatsappUrlContainer.appendChild(whatsappUrlLabel);
    
    const whatsappUrlInput = document.createElement('input');
    whatsappUrlInput.type = 'text';
    whatsappUrlInput.readOnly = true;
    whatsappUrlInput.value = `https://wa.me/1234567890?text=Start`;
    whatsappUrlContainer.appendChild(whatsappUrlInput);
    
    const copyWhatsappUrlButton = document.createElement('button');
    copyWhatsappUrlButton.textContent = 'Copy';
    copyWhatsappUrlButton.addEventListener('click', () => {
      navigator.clipboard.writeText(whatsappUrlInput.value);
      alert('WhatsApp link copied to clipboard!');
    });
    whatsappUrlContainer.appendChild(copyWhatsappUrlButton);
    
    urlsSection.appendChild(whatsappUrlContainer);
    container.appendChild(urlsSection);
    
  } catch (error) {
    hideLoadingSpinner(spinner);
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load business details. Please try again.';
    errorMessage.className = 'error-message';
    container.appendChild(errorMessage);
    
    console.error('Failed to fetch business:', error);
  }
  
  return container;
}