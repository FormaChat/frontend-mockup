// pages/dashboard/channels/detail.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { getBusinessById } from '../../../services/business.service';
import QRCode  from 'qrcode';

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
    
    // Description
    const description = document.createElement('p');
    description.className = 'page-description';
    description.textContent = 'Share your chatbot with customers through multiple channels. Test your bot, generate QR codes, and get shareable links.';
    container.appendChild(description);

    const currentDomain = window.location.origin; // For local testing
    const productionDomain = 'https://formachat.com'; // For sharing with customers
    
    const localChatUrl = `${currentDomain}/#/chat/${business._id}`;
    const prodChatUrl = `${productionDomain}/#/chat/${business._id}`;
    
    
    // ========================================
    // TEST BOT SECTION
    // ========================================
    const testBotSection = document.createElement('section');
    testBotSection.className = 'test-bot-section';
    
    const testBotHeading = document.createElement('h2');
    testBotHeading.textContent = 'Test Your Bot';
    testBotSection.appendChild(testBotHeading);
    
    const testBotDescription = document.createElement('p');
    testBotDescription.textContent = 'See your chatbot in action before sharing it with customers.';
    testBotSection.appendChild(testBotDescription);
    
    const testBotButton = document.createElement('button');
    testBotButton.textContent = '🤖 Try Your Bot';
    testBotButton.className = 'btn-primary';
    testBotButton.addEventListener('click', () => {
      
      window.open(localChatUrl, '_blank', 'width=500,height=600');
    });
    testBotSection.appendChild(testBotButton);
    
    container.appendChild(testBotSection);
    
    // ========================================
    // SHAREABLE URLS SECTION
    // ========================================
    const urlsSection = document.createElement('section');
    urlsSection.className = 'urls-section';
    
    const urlsHeading = document.createElement('h2');
    urlsHeading.textContent = 'Shareable URLs';
    urlsSection.appendChild(urlsHeading);
    
    const urlsDescription = document.createElement('p');
    urlsDescription.textContent = 'Share these links with your customers to start conversations.';
    urlsSection.appendChild(urlsDescription);
    
    // Web Chat URL
    
    const webUrlContainer = createCopyableUrlField(
      'Web Chat Link',
      prodChatUrl,
      'Share this link on your website, social media, or email'
    );
    urlsSection.appendChild(webUrlContainer);
    
  
    const embedSection = document.createElement('section');
    embedSection.className = 'embed-section';

    const embedHeading = document.createElement('h2');
    embedHeading.textContent = 'Embed Options';
    embedSection.appendChild(embedHeading);

    const embedDescription = document.createElement('p');
    embedDescription.textContent = 'Choose how you want to integrate the chatbot on your website.';
    embedSection.appendChild(embedDescription);

    // Option 1: Floating Widget (Recommended)
    const floatingOption = document.createElement('div');
    floatingOption.style.cssText = 'margin: 20px 0; padding: 20px; background: #f9f9f9; border-radius: 8px;';

    const floatingTitle = document.createElement('h3');
    floatingTitle.textContent = '💬 Floating Widget (Recommended)';
    floatingTitle.style.marginBottom = '10px';
    floatingOption.appendChild(floatingTitle);

    const floatingDesc = document.createElement('p');
    floatingDesc.textContent = 'Add an "Intercom-style" chat button that opens/closes in the bottom corner.';
    floatingDesc.style.cssText = 'font-size: 14px; color: #666; margin-bottom: 15px;';
    floatingOption.appendChild(floatingDesc);

    const floatingCode = `<script src="https://formachat.com/widget.js"></script>
    <script>
      FormachatWidget.init({
        businessId: '${business._id}'
      });
    </script>`;


    const floatingCodeContainer = createCopyableUrlField(
      'Widget Script',
      floatingCode,
      'Copy and paste this before the closing </body> tag'
    );
    floatingOption.appendChild(floatingCodeContainer);

    embedSection.appendChild(floatingOption);

    // Option 2: Iframe Embed
    const iframeOption = document.createElement('div');
    iframeOption.style.cssText = 'margin: 20px 0; padding: 20px; background: #f9f9f9; border-radius: 8px;';

    const iframeTitle = document.createElement('h3');
    iframeTitle.textContent = '🖼️ Full Iframe Embed';
    iframeTitle.style.marginBottom = '10px';
    iframeOption.appendChild(iframeTitle);

    const iframeDesc = document.createElement('p');
    iframeDesc.textContent = 'Embed the full chat interface directly on your page.';
    iframeDesc.style.cssText = 'font-size: 14px; color: #666; margin-bottom: 15px;';
    iframeOption.appendChild(iframeDesc);

    const iframeCode = `<iframe src="${prodChatUrl}" width="100%" height="600" frameborder="0"></iframe>`;

    const iframeCodeContainer = createCopyableUrlField(
      'Iframe Code',
      iframeCode,
      'Embed the chatbot directly on any page'
    );
    iframeOption.appendChild(iframeCodeContainer);

    embedSection.appendChild(iframeOption);

    container.appendChild(embedSection);
    
    // ========================================
    // QR CODE SECTION
    // ========================================
    const qrSection = document.createElement('section');
    qrSection.className = 'qr-section';
    
    const qrHeading = document.createElement('h2');
    qrHeading.textContent = 'QR Code';
    qrSection.appendChild(qrHeading);
    
    const qrDescription = document.createElement('p');
    qrDescription.textContent = 'Generate a QR code that customers can scan to start chatting.';
    qrSection.appendChild(qrDescription);
    
    // QR Code placeholder (will be replaced with actual QR code generation later)
    const qrPlaceholder = document.createElement('div');
    qrPlaceholder.className = 'qr-placeholder';
    qrPlaceholder.style.cssText = `
      width: 300px;
      height: 300px;
      border: 2px dashed #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0;
      background: #f9f9f9;
    `;
    qrPlaceholder.textContent = 'Generated image will appear here';
    qrSection.appendChild(qrPlaceholder);
    
    // QR Code actions
    const qrActionsContainer = document.createElement('div');
    qrActionsContainer.className = 'qr-actions';
    qrActionsContainer.style.display = 'flex';
    qrActionsContainer.style.gap = '10px';
    
    const generateQrButton = document.createElement('button');
    generateQrButton.textContent = 'Generate QR Code';
    generateQrButton.className = 'btn-secondary';
    generateQrButton.addEventListener('click', async () => {
      try {
        // Disable button and show loading state
        generateQrButton.disabled = true;
        generateQrButton.textContent = 'Generating...';
        
        // Generate QR code from the web chat URL
        const qrDataUrl = await QRCode.toDataURL(prodChatUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        
        // Replace placeholder with actual QR code image
        qrPlaceholder.innerHTML = '';
        qrPlaceholder.style.border = 'none';
        qrPlaceholder.style.background = 'white';
        
        const qrImage = document.createElement('img');
        qrImage.src = qrDataUrl;
        qrImage.alt = 'QR Code for Chat Bot';
        qrImage.style.cssText = 'width: 100%; height: 100%; display: block;';
        qrPlaceholder.appendChild(qrImage);
        
        // Enable download button
        downloadQrButton.disabled = false;
        
        // Store QR data URL for download
        downloadQrButton.dataset.qrUrl = qrDataUrl;
        
        // Update button text
        generateQrButton.textContent = '✓ QR Code Generated';
        generateQrButton.disabled = false;
        
        console.log('[Channels] QR code generated successfully');
        
      } catch (error) {
        console.error('[Channels] QR code generation failed:', error);
        alert('Failed to generate QR code. Please try again.');
        generateQrButton.textContent = 'Generate QR Code';
        generateQrButton.disabled = false;
      }
    });
    qrActionsContainer.appendChild(generateQrButton);
    
    const downloadQrButton = document.createElement('button');
    downloadQrButton.textContent = 'Download QR Code';
    downloadQrButton.className = 'btn-secondary';
    downloadQrButton.disabled = true; // Enable after QR generation
    downloadQrButton.addEventListener('click', () => {
      try {
        // Get QR data URL from button dataset
        const qrDataUrl = downloadQrButton.dataset.qrUrl;
        
        if (!qrDataUrl) {
          alert('Please generate QR code first');
          return;
        }
        
        // Create download link
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = `${business.basicInfo.businessName.replace(/[^a-z0-9]/gi, '-')}-qr-code.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Visual feedback
        const originalText = downloadQrButton.textContent;
        downloadQrButton.textContent = '✓ Downloaded!';
        
        setTimeout(() => {
          downloadQrButton.textContent = originalText;
        }, 2000);
        
        console.log('[Channels] QR code downloaded');
        
      } catch (error) {
        console.error('[Channels] QR code download failed:', error);
        alert('Failed to download QR code. Please try again.');
      }
    });
    qrActionsContainer.appendChild(downloadQrButton);
    
    qrSection.appendChild(qrActionsContainer);
    
    const qrNote = document.createElement('p');
    qrNote.style.cssText = 'font-size: 14px; color: #666; margin-top: 10px;';
    qrNote.textContent = '💡 Tip: Print this QR code on flyers, business cards, or display it in your store!';
    qrSection.appendChild(qrNote);
    
    container.appendChild(qrSection);
    
    // ========================================
    // INTEGRATION TIPS SECTION
    // ========================================
    const tipsSection = document.createElement('section');
    tipsSection.className = 'tips-section';
    
    const tipsHeading = document.createElement('h2');
    tipsHeading.textContent = 'Integration Tips';
    tipsSection.appendChild(tipsHeading);
    
    const tipsList = document.createElement('ul');
    tipsList.style.cssText = 'list-style: none; padding: 0;';
    
    const tips = [
      'Add the web chat link to your website footer or contact page',
      'Share the QR code at your physical location or on printed materials',
  
      'Add the chat link to your email marketing campaigns',
      ' Share on social media to engage with your audience'
    ];
    
    tips.forEach(tip => {
      const li = document.createElement('li');
      li.style.cssText = 'padding: 10px; margin: 5px 0; background: #f9f9f9; border-radius: 5px;';
      li.textContent = tip;
      tipsList.appendChild(li);
    });
    
    tipsSection.appendChild(tipsList);
    container.appendChild(tipsSection);
    
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

/**
 * Helper: Create a copyable URL field with one-click copy
 */
function createCopyableUrlField(
  label: string,
  url: string,
  description: string
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'url-field-container';
  container.style.cssText = 'margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;';
  
  // Label
  const labelElement = document.createElement('label');
  labelElement.style.cssText = 'display: block; font-weight: 600; margin-bottom: 5px; color: #333;';
  labelElement.textContent = label;
  container.appendChild(labelElement);
  
  // Description
  const descElement = document.createElement('p');
  descElement.style.cssText = 'font-size: 13px; color: #666; margin-bottom: 10px;';
  descElement.textContent = description;
  container.appendChild(descElement);
  
  // Input + Copy button wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.style.cssText = 'display: flex; gap: 10px;';
  
  // URL input (read-only)
  const input = document.createElement('input');
  input.type = 'text';
  input.readOnly = true;
  input.value = url;
  input.style.cssText = `
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    background: white;
  `;
  
  // Click to select all text
  input.addEventListener('click', () => {
    input.select();
  });
  
  inputWrapper.appendChild(input);
  
  // Copy button
  const copyButton = document.createElement('button');
  copyButton.textContent = '📋 Copy';
  copyButton.className = 'btn-secondary';
  copyButton.style.cssText = `
    padding: 10px 20px;
    white-space: nowrap;
  `;
  
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      
      // Visual feedback
      const originalText = copyButton.textContent;
      copyButton.textContent = '✓ Copied!';
      copyButton.style.background = '#28a745';
      copyButton.style.color = 'white';
      
      setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.background = '';
        copyButton.style.color = '';
      }, 2000);
      
    } catch (error) {
      alert('Failed to copy to clipboard');
      console.error('Copy failed:', error);
    }
  });
  
  inputWrapper.appendChild(copyButton);
  container.appendChild(inputWrapper);
  
  return container;
}

