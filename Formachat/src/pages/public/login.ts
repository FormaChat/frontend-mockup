/**
 * ========================================
 * LOGIN PAGE
 * ========================================
 * 
 * User login form with email verification check.
 */

import { login } from '../../services/auth.service';
import { saveTokens, saveUser } from '../../utils/auth.utils';

export function renderLogin(): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = 'max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc;';

  // Title
  const title = document.createElement('h1');
  title.textContent = 'Login';
  container.appendChild(title);

  // Form
  const form = document.createElement('form');

  // Email field
  const emailDiv = document.createElement('div');
  emailDiv.style.marginBottom = '15px';

  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email';
  emailLabel.style.cssText = 'display: block; margin-bottom: 5px;';
  emailDiv.appendChild(emailLabel);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.required = true;
  emailInput.style.cssText = 'width: 100%; padding: 8px; box-sizing: border-box;';
  emailDiv.appendChild(emailInput);

  form.appendChild(emailDiv);

  // Password field
  const passwordDiv = document.createElement('div');
  passwordDiv.style.marginBottom = '15px';

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  passwordLabel.style.cssText = 'display: block; margin-bottom: 5px;';
  passwordDiv.appendChild(passwordLabel);

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.required = true;
  passwordInput.style.cssText = 'width: 100%; padding: 8px; box-sizing: border-box;';
  passwordDiv.appendChild(passwordInput);

  form.appendChild(passwordDiv);

  // Error message
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'display: none; color: red; margin-bottom: 15px;';
  form.appendChild(errorDiv);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Login';
  submitBtn.style.cssText = 'width: 100%; padding: 10px; background: #007bff; color: white; border: none; cursor: pointer;';
  form.appendChild(submitBtn);

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Hide previous errors
    errorDiv.style.display = 'none';

    // Disable form
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      const response = await login({ email, password });

      if (!response.success) {
        // Check for email not verified
        if (response.error.code === 'EMAIL_NOT_VERIFIED') {
          errorDiv.textContent = 'Email not verified. Redirecting to verification page...';
          errorDiv.style.display = 'block';

          sessionStorage.setItem('pendingVerificationEmail', email);

          setTimeout(() => {
            window.location.hash = '#/verify-email';
          }, 1500);
          return;
        }

        errorDiv.textContent = response.error.message || 'Login failed';
        errorDiv.style.display = 'block';
        return;
      }

      // Success
      saveTokens(response.data.tokens);
      saveUser(response.data.user);

      window.location.hash = '#/dashboard';

    } catch (error: any) {
      errorDiv.textContent = 'An unexpected error occurred';
      errorDiv.style.display = 'block';
      console.error('Login error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });

  container.appendChild(form);

  // Register link
  const registerLink = document.createElement('p');
  registerLink.style.cssText = 'margin-top: 20px; text-align: center;';
  registerLink.innerHTML = `Don't have an account? <a href="#/register" style="color: #007bff;">Register</a>`;
  container.appendChild(registerLink);

  return container;
}