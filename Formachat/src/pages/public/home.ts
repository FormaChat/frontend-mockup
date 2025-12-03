/**
 * ========================================
 * HOME PAGE (Landing Page)
 * ========================================
 * 
 * Simple landing page for unauthenticated users.
 * Shows links to login/register.
 */

export function renderHome(): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = 'max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;';

  // Title
  const title = document.createElement('h1');
  title.textContent = 'Welcome to FormaChat';
  container.appendChild(title);

  // Subtitle
  const subtitle = document.createElement('p');
  subtitle.style.cssText = 'font-size: 18px; margin: 20px 0;';
  subtitle.textContent = 'AI-Powered Customer Support for Your Business';
  container.appendChild(subtitle);

  // Buttons section
  const buttonSection = document.createElement('div');
  buttonSection.style.marginTop = '40px';

  // Login button
  const loginBtn = document.createElement('a');
  loginBtn.href = '#/login';
  loginBtn.textContent = 'Login';
  loginBtn.style.cssText = `
    display: inline-block;
    padding: 12px 30px;
    margin: 10px;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  `;
  buttonSection.appendChild(loginBtn);

  // Register button
  const registerBtn = document.createElement('a');
  registerBtn.href = '#/register';
  registerBtn.textContent = 'Get Started';
  registerBtn.style.cssText = `
    display: inline-block;
    padding: 12px 30px;
    margin: 10px;
    background: #28a745;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  `;
  buttonSection.appendChild(registerBtn);

  container.appendChild(buttonSection);

  // Features section
  const featuresSection = document.createElement('div');
  featuresSection.style.cssText = 'margin-top: 60px; color: #666;';

  const featuresTitle = document.createElement('h3');
  featuresTitle.textContent = 'Features';
  featuresSection.appendChild(featuresTitle);

  const featuresList = document.createElement('ul');
  featuresList.style.cssText = 'list-style: none; padding: 0;';

  const features = [
    '✓ AI-powered chatbot for customer support',
    '✓ Multi-channel integration',
    '✓ Real-time analytics',
    '✓ Lead capture and management'
  ];

  features.forEach(feature => {
    const li = document.createElement('li');
    li.style.margin = '10px 0';
    li.textContent = feature;
    featuresList.appendChild(li);
  });

  featuresSection.appendChild(featuresList);
  container.appendChild(featuresSection);

  return container;
}