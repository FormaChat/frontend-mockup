// pages/dashboard/channels/detail.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { getBusinessById } from '../../../services/business.service';
import QRCode from 'qrcode';

// --- 1. INJECT STYLES ---
function injectChannelStyles() {
  if (document.getElementById('channels-detail-styles')) return;

  const style = document.createElement('style');
  style.id = 'channels-detail-styles';
  style.textContent = `
    :root {
      --primary: #636b2f;
      --primary-hover: #4a5122;
      --secondary: #bac095;
      --text-main: #1a1a1a;
      --text-muted: #666;
      --bg-glass: rgba(255, 255, 255, 0.85);
      --code-bg: #1e293b;
      --code-text: #e2e8f0;
    }

    .channels-detail {
      padding-bottom: 60px;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header */
    .page-header { margin-bottom: 40px; text-align: left; text-align: center; }
    .page-header h1 { font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; }
    .page-description { color: var(--text-muted); font-size: 1.05rem; max-width: 700px; line-height: 1.5; }

    /* Layout Grid */
    .channels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 24px;
      align-items: start;
    }

    /* Glass Cards */
    .glass-card {
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.6);
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .glass-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.06); }

    .card-title {
      font-size: 1.25rem; font-weight: 700; margin: 0 0 10px 0; color: var(--text-main);
      display: flex; align-items: center; gap: 10px;
    }
    .card-desc { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 25px; }

    /* Test Bot Button */
    .test-bot-btn {
      background: var(--primary);
      color: white;
      border: none;
      width: 100%;
      padding: 16px;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      box-shadow: 0 4px 15px rgba(99, 107, 47, 0.3);
      transition: all 0.2s;
    }
    .test-bot-btn:hover { background: var(--primary-hover); transform: scale(1.02); }

    /* Input Groups */
    .input-group {
      display: flex;
      align-items: stretch;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      transition: border-color 0.2s;
    }
    .input-group:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 107, 47, 0.1); }
    
    .url-input {
      flex: 1; border: none; padding: 12px 16px; font-size: 0.95rem; color: var(--text-main); background: white; outline: none;
    }
    .copy-btn {
      background: #f8fafc; border: none; border-left: 1px solid #e2e8f0; padding: 0 20px;
      cursor: pointer; font-weight: 600; color: var(--primary); transition: all 0.2s;
    }
    .copy-btn:hover { background: #f1f5f9; }

    /* Code Blocks */
    .code-block-wrapper {
      background: var(--code-bg);
      border-radius: 8px;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
    }
    .code-content {
      color: var(--code-text);
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 0.85rem;
      padding: 15px;
      margin: 0;
      overflow-x: auto;
      white-space: pre-wrap;
      line-height: 1.5;
    }
    .code-copy-btn {
      position: absolute; top: 8px; right: 8px;
      background: rgba(255,255,255,0.1); color: white; border: none;
      padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; cursor: pointer;
    }
    .code-copy-btn:hover { background: rgba(255,255,255,0.2); }

    /* QR Code */
    .qr-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: white; border-radius: 12px; padding: 20px; border: 2px dashed #e2e8f0;
      min-height: 250px; margin-bottom: 20px;
    }
    .qr-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
    .btn-secondary {
      background: white; border: 1px solid #e2e8f0; color: var(--text-main);
      padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s;
    }
    .btn-secondary:hover:not(:disabled) { background: #f8fafc; border-color: var(--secondary); }
    .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Tips */
    .tips-list { list-style: none; padding: 0; margin: 0; }
    .tip-item {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px; background: rgba(255,255,255,0.6); border-radius: 8px; margin-bottom: 8px;
      font-size: 0.95rem; color: var(--text-main);
    }
    .tip-icon { color: var(--secondary); font-size: 1.1rem; }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .channels-grid { grid-template-columns: 1fr; }
      .page-header h1 { font-size: 1.6rem; }
    }
  `;
  document.head.appendChild(style);
}

export async function renderChannelsDetail(businessId: string): Promise<HTMLElement> {
  injectChannelStyles();

  const container = document.createElement('div');
  container.className = 'channels-detail';
  
  // Loading State
  const spinner = createLoadingSpinner('Loading business details...');
  container.appendChild(spinner);
  
  try {
    const business = await getBusinessById(businessId);
    hideLoadingSpinner(spinner);
    
    // 1. Breadcrumb
    const breadcrumb = createBreadcrumb([
      { label: 'Channels', path: '#/dashboard/channels' },
      { label: business.basicInfo.businessName }
    ]);
    container.appendChild(breadcrumb);
    
    // 2. Header
    const header = document.createElement('div');
    header.className = 'page-header';
    
    
    const description = document.createElement('p');
    description.className = 'page-description';
    description.textContent = 'Manage your chatbot distribution. Test your bot instantly, generate shareable assets, or grab the integration code for your website.';
    header.appendChild(description);
    
    container.appendChild(header);

    // --- MAIN GRID LAYOUT ---
    const grid = document.createElement('div');
    grid.className = 'channels-grid';

    // === LEFT COLUMN ===
    const leftColumn = document.createElement('div');
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    leftColumn.style.gap = '24px';

    // A. Test Bot Card
    const currentDomain = window.location.origin;
    const productionDomain = 'https://formachat.com'; 
    const localChatUrl = `${currentDomain}/#/chat/${business._id}`;
    const prodChatUrl = `${productionDomain}/#/chat/${business._id}`;

    const testCard = document.createElement('section');
    testCard.className = 'glass-card';
    testCard.innerHTML = `
        <h2 class="card-title">🤖 Live Simulator</h2>
        <p class="card-desc">Interact with your chatbot in a sandbox environment before sharing it with the world.</p>
    `;
    const testBtn = document.createElement('button');
    testBtn.className = 'test-bot-btn';
    testBtn.innerHTML = `<span>Launch Test Chat</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
    testBtn.addEventListener('click', () => {
        window.open(localChatUrl, '_blank', 'width=500,height=700');
    });
    testCard.appendChild(testBtn);
    leftColumn.appendChild(testCard);

    // B. Share Links Card
    const shareCard = document.createElement('section');
    shareCard.className = 'glass-card';
    shareCard.innerHTML = `
        <h2 class="card-title">🔗 Shareable Links</h2>
        <p class="card-desc">Direct links to start a conversation. Perfect for social media bios or email signatures.</p>
    `;
    shareCard.appendChild(createInputGroup('Direct Chat Link', prodChatUrl));
    leftColumn.appendChild(shareCard);

    // C. Embed Options Card
    const embedCard = document.createElement('section');
    embedCard.className = 'glass-card';
    
    embedCard.innerHTML = `
        <h2 class="card-title">💻 Website Integration</h2>
        <p class="card-desc">Copy and paste these snippets to add the bot to your site.</p>
        
        <h3 style="font-size: 1rem; margin-bottom: 10px;">Floating Widget (Recommended)</h3>
    `;
    
    const widgetScript = `<script src="http://localhost:5173/widget.js"></script>
<script>
  FormachatWidget.init({ businessId: '${business._id}' });
</script>`;
    embedCard.appendChild(createCodeBlock(widgetScript));

    const iframeTitle = document.createElement('h3');
    iframeTitle.style.cssText = 'font-size: 1rem; margin: 20px 0 10px 0;';
    iframeTitle.textContent = 'Full Page Iframe';
    embedCard.appendChild(iframeTitle);

    const iframeScript = `<iframe src="${prodChatUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    embedCard.appendChild(createCodeBlock(iframeScript));

    leftColumn.appendChild(embedCard);
    
    // === RIGHT COLUMN ===
    const rightColumn = document.createElement('div');
    rightColumn.style.display = 'flex';
    rightColumn.style.flexDirection = 'column';
    rightColumn.style.gap = '24px';

    // D. QR Code Card
    const qrCard = document.createElement('section');
    qrCard.className = 'glass-card';
    
    const qrHeader = document.createElement('div');
    qrHeader.innerHTML = `
        <h2 class="card-title">📱 QR Code</h2>
        <p class="card-desc">Generate a code for flyers, business cards, or in-store displays.</p>
    `;
    qrCard.appendChild(qrHeader);

    // Placeholder / Canvas
    const qrPlaceholder = document.createElement('div');
    qrPlaceholder.className = 'qr-container';
    qrPlaceholder.innerHTML = '<span style="color: #999;">Click Generate to create QR</span>';
    qrCard.appendChild(qrPlaceholder);

    // Actions
    const qrActions = document.createElement('div');
    qrActions.className = 'qr-actions';

    const btnGenerate = document.createElement('button');
    btnGenerate.className = 'btn-secondary';
    btnGenerate.textContent = 'Generate QR';
    
    const btnDownload = document.createElement('button');
    btnDownload.className = 'btn-secondary';
    btnDownload.textContent = 'Download PNG';
    btnDownload.disabled = true;

    // QR Logic
    btnGenerate.addEventListener('click', async () => {
        try {
            btnGenerate.textContent = 'Generating...';
            btnGenerate.disabled = true;
            
            const url = await QRCode.toDataURL(prodChatUrl, {
                width: 300, margin: 2,
                color: { dark: '#000000', light: '#FFFFFF' }
            });

            qrPlaceholder.innerHTML = `<img src="${url}" alt="QR Code" style="width: 100%; height: auto; display: block;">`;
            qrPlaceholder.style.border = 'none'; // Remove dashed border
            
            // Enable download
            btnDownload.disabled = false;
            btnDownload.dataset.url = url;
            
            btnGenerate.textContent = 'Regenerate';
            btnGenerate.disabled = false;
        } catch (e) {
            console.error(e);
            alert('Failed to generate QR');
            btnGenerate.textContent = 'Generate QR';
            btnGenerate.disabled = false;
        }
    });

    btnDownload.addEventListener('click', () => {
        const url = btnDownload.dataset.url;
        if(!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = `${business.basicInfo.businessName}-qr.png`;
        link.click();
    });

    qrActions.appendChild(btnGenerate);
    qrActions.appendChild(btnDownload);
    qrCard.appendChild(qrActions);

    rightColumn.appendChild(qrCard);

    // E. Tips Card
    const tipsCard = document.createElement('section');
    tipsCard.className = 'glass-card';
    tipsCard.innerHTML = `
        <h2 class="card-title">💡 Pro Tips</h2>
        <ul class="tips-list">
            <li class="tip-item"><span class="tip-icon">✓</span> Add the web chat link to your email signature.</li>
            <li class="tip-item"><span class="tip-icon">✓</span> Print the QR code on your restaurant menu or receipt.</li>
            <li class="tip-item"><span class="tip-icon">✓</span> Post the link on your Instagram Bio.</li>
        </ul>
    `;
    rightColumn.appendChild(tipsCard);

    // Assemble Grid
    grid.appendChild(leftColumn);
    grid.appendChild(rightColumn);
    container.appendChild(grid);

  } catch (error) {
    hideLoadingSpinner(spinner);
    const err = document.createElement('div');
    err.className = 'glass-card';
    err.style.color = 'var(--text-main)';
    err.style.textAlign = 'center';
    err.textContent = 'Failed to load channel details. Please try again.';
    container.appendChild(err);
    console.error(error);
  }
  
  return container;
}

/**
 * Helper: Create a Modern Input Group
 */
function createInputGroup(label: string, value: string): HTMLElement {
    const wrapper = document.createElement('div');
    
    const lbl = document.createElement('label');
    lbl.style.display = 'block';
    lbl.style.marginBottom = '8px';
    lbl.style.fontWeight = '600';
    lbl.style.fontSize = '0.9rem';
    lbl.textContent = label;
    wrapper.appendChild(lbl);

    const group = document.createElement('div');
    group.className = 'input-group';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'url-input';
    input.readOnly = true;
    input.value = value;
    input.addEventListener('click', () => input.select());

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(value);
        btn.textContent = 'Copied!';
        btn.style.color = '#059669'; // Success green
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.style.color = '';
        }, 2000);
    });

    group.appendChild(input);
    group.appendChild(btn);
    wrapper.appendChild(group);

    return wrapper;
}

/**
 * Helper: Create a Styled Code Block
 */
function createCodeBlock(code: string): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    const pre = document.createElement('pre');
    pre.className = 'code-content';
    pre.textContent = code;

    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(code);
        btn.textContent = '✓';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });

    wrapper.appendChild(pre);
    wrapper.appendChild(btn);
    return wrapper;
}