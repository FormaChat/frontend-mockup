/**
 * ========================================
 * EMAIL VERIFICATION PAGE
 * ========================================
 * 
 * Standalone page for email verification
 */

import { verifyEmail, resendOTP } from '../../services/auth.service';
import { OTPType } from '../../types/auth.types';

export function renderVerifyEmail(): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = 'max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc;';

  // Get email from session storage
  const email = sessionStorage.getItem('pendingVerificationEmail');

  if (!email) {
    // No pending verification
    const errorTitle = document.createElement('h2');
    errorTitle.textContent = 'Error';
    container.appendChild(errorTitle);

    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'No pending verification found. Please login or register first.';
    container.appendChild(errorMsg);

    const loginLink = document.createElement('a');
    loginLink.href = '#/login';
    loginLink.textContent = 'Go to Login';
    loginLink.style.color = '#007bff';
    container.appendChild(loginLink);

    return container;
  }

  // Title
  const title = document.createElement('h1');
  title.textContent = 'Verify Your Email';
  container.appendChild(title);

  // Email display
  const emailInfo = document.createElement('p');
  emailInfo.style.cssText = 'color: #666; margin-bottom: 20px;';
  emailInfo.innerHTML = `We sent a verification code to:<br><strong>${email}</strong>`;
  container.appendChild(emailInfo);

  // Form
  const form = document.createElement('form');

  // OTP field
  const otpDiv = document.createElement('div');
  otpDiv.style.marginBottom = '15px';

  const otpLabel = document.createElement('label');
  otpLabel.textContent = 'Verification Code';
  otpLabel.style.cssText = 'display: block; margin-bottom: 5px;';
  otpDiv.appendChild(otpLabel);

  const otpInput = document.createElement('input');
  otpInput.type = 'text';
  otpInput.name = 'otp';
  otpInput.required = true;
  otpInput.maxLength = 6;
  otpInput.placeholder = 'Enter 6-digit code';
  otpInput.style.cssText = 'width: 100%; padding: 12px; box-sizing: border-box; font-size: 18px; letter-spacing: 3px; text-align: center;';
  otpDiv.appendChild(otpInput);

  form.appendChild(otpDiv);

  // Messages
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'display: none; color: red; margin-bottom: 10px;';
  form.appendChild(errorDiv);

  const successDiv = document.createElement('div');
  successDiv.style.cssText = 'display: none; color: green; margin-bottom: 10px;';
  form.appendChild(successDiv);

  // Verify button
  const verifyBtn = document.createElement('button');
  verifyBtn.type = 'submit';
  verifyBtn.textContent = 'Verify Email';
  verifyBtn.style.cssText = 'width: 100%; padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; margin-bottom: 10px;';
  form.appendChild(verifyBtn);

  // Resend button
  const resendBtn = document.createElement('button');
  resendBtn.type = 'button';
  resendBtn.textContent = 'Resend Code';
  resendBtn.style.cssText = 'width: 100%; padding: 8px; background: white; color: #007bff; border: 1px solid #007bff; cursor: pointer;';
  form.appendChild(resendBtn);

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const otp = otpInput.value;

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (otp.length !== 6) {
      errorDiv.textContent = 'Please enter a valid 6-digit code';
      errorDiv.style.display = 'block';
      return;
    }

    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';

    try {
      const response = await verifyEmail({
        email,
        otp,
        type: OTPType.EMAIL_VERIFICATION
      });

      if (!response.success) {
        errorDiv.textContent = response.error.message || 'Invalid code';
        errorDiv.style.display = 'block';
        return;
      }

      // Clear session storage
      sessionStorage.removeItem('pendingVerificationEmail');

      successDiv.textContent = 'Email verified! Redirecting to login...';
      successDiv.style.display = 'block';

      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2000);

    } catch (error) {
      errorDiv.textContent = 'Verification failed';
      errorDiv.style.display = 'block';
      console.error('Verification error:', error);
    } finally {
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify Email';
    }
  });

  // Resend handler
  resendBtn.addEventListener('click', async () => {
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    try {
      const response = await resendOTP(email);

      if (!response.success) {
        errorDiv.textContent = 'Failed to resend code';
        errorDiv.style.display = 'block';
        return;
      }

      successDiv.textContent = 'Code resent! Check your email.';
      successDiv.style.display = 'block';

    } catch (error) {
      errorDiv.textContent = 'Failed to resend code';
      errorDiv.style.display = 'block';
    } finally {
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend Code';
    }
  });

  container.appendChild(form);

  // Helper text
  const helperText = document.createElement('p');
  helperText.style.cssText = 'margin-top: 20px; text-align: center; font-size: 14px; color: #666;';
  helperText.textContent = 'Check your spam folder if you don\'t see the email.';
  container.appendChild(helperText);

  // Back to login link
  const loginLink = document.createElement('p');
  loginLink.style.cssText = 'margin-top: 20px; text-align: center;';
  loginLink.innerHTML = '<a href="#/login" style="color: #007bff;">Back to Login</a>';
  container.appendChild(loginLink);

  return container;
}