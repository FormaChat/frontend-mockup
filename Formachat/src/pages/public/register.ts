/**
 * ========================================
 * REGISTER PAGE
 * ========================================
 * 
 * Two-step registration with OTP verification
 */

import { register, verifyEmail, resendOTP } from '../../services/auth.service';
import { OTPType } from '../../types/auth.types';

let registeredEmail = '';

export function renderRegister(): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = 'max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc;';

  // Title
  const title = document.createElement('h1');
  title.textContent = 'Register';
  container.appendChild(title);

  // Registration form
  const registerForm = createRegisterForm(container);
  container.appendChild(registerForm);

  // OTP section (hidden initially)
  const otpSection = createOTPSection();
  otpSection.style.display = 'none';
  container.appendChild(otpSection);

  // Login link
  const loginLink = document.createElement('p');
  loginLink.style.cssText = 'margin-top: 20px; text-align: center;';
  loginLink.innerHTML = `Already have an account? <a href="#/login" style="color: #007bff;">Login</a>`;
  container.appendChild(loginLink);

  return container;
}

function createRegisterForm(container: HTMLElement): HTMLElement {
  const form = document.createElement('form');

  // First Name
  const firstNameDiv = createFormField('text', 'firstName', 'First Name', true);
  form.appendChild(firstNameDiv);

  // Last Name
  const lastNameDiv = createFormField('text', 'lastName', 'Last Name', true);
  form.appendChild(lastNameDiv);

  // Email
  const emailDiv = createFormField('email', 'email', 'Email', true);
  form.appendChild(emailDiv);

  // Password
  const passwordDiv = createFormField('password', 'password', 'Password', true);
  const passwordInput = passwordDiv.querySelector('input') as HTMLInputElement;
  passwordInput.minLength = 8;
  
  const passwordHint = document.createElement('small');
  passwordHint.textContent = 'Minimum 8 characters';
  passwordHint.style.color = '#666';
  passwordDiv.appendChild(passwordHint);
  
  form.appendChild(passwordDiv);

  // Error message
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'display: none; color: red; margin-bottom: 15px;';
  form.appendChild(errorDiv);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Register';
  submitBtn.style.cssText = 'width: 100%; padding: 10px; background: #28a745; color: white; border: none; cursor: pointer;';
  form.appendChild(submitBtn);

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    errorDiv.style.display = 'none';

    if (password.length < 8) {
      errorDiv.textContent = 'Password must be at least 8 characters';
      errorDiv.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';

    try {
      const response = await register({ email, password, firstName, lastName });

      if (!response.success) {
        errorDiv.textContent = response.error.message || 'Registration failed';
        errorDiv.style.display = 'block';
        return;
      }

      // Store email and show OTP section
      registeredEmail = email;
      form.style.display = 'none';
      
      const otpSection = container.querySelector('#otpSection') as HTMLElement;
      if (otpSection) {
        otpSection.style.display = 'block';
      }

    } catch (error) {
      errorDiv.textContent = 'An unexpected error occurred';
      errorDiv.style.display = 'block';
      console.error('Register error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register';
    }
  });

  return form;
}

function createOTPSection(): HTMLElement {
  const section = document.createElement('div');
  section.id = 'otpSection';

  const successMsg = document.createElement('p');
  successMsg.style.cssText = 'margin-top: 20px; color: #28a745;';
  successMsg.textContent = '✓ Registration successful! Check your email for verification code.';
  section.appendChild(successMsg);

  const form = document.createElement('form');

  // OTP field
  const otpDiv = document.createElement('div');
  otpDiv.style.marginBottom = '15px';

  const otpLabel = document.createElement('label');
  otpLabel.textContent = 'Verification Code (OTP)';
  otpLabel.style.cssText = 'display: block; margin-bottom: 5px;';
  otpDiv.appendChild(otpLabel);

  const otpInput = document.createElement('input');
  otpInput.type = 'text';
  otpInput.name = 'otp';
  otpInput.required = true;
  otpInput.maxLength = 6;
  otpInput.placeholder = 'Enter 6-digit code';
  otpInput.style.cssText = 'width: 100%; padding: 8px; box-sizing: border-box; font-size: 18px; letter-spacing: 2px;';
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

  // Verify submission
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
        email: registeredEmail,
        otp,
        type: OTPType.EMAIL_VERIFICATION
      });

      if (!response.success) {
        errorDiv.textContent = response.error.message || 'Invalid code';
        errorDiv.style.display = 'block';
        return;
      }

      successDiv.textContent = 'Email verified! Redirecting to login...';
      successDiv.style.display = 'block';

      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2000);

    } catch (error) {
      errorDiv.textContent = 'Verification failed';
      errorDiv.style.display = 'block';
      console.error('OTP verification error:', error);
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
      const response = await resendOTP(registeredEmail);

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

  section.appendChild(form);
  return section;
}

function createFormField(type: string, name: string, label: string, required: boolean): HTMLElement {
  const div = document.createElement('div');
  div.style.marginBottom = '15px';

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  labelEl.style.cssText = 'display: block; margin-bottom: 5px;';
  div.appendChild(labelEl);

  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.required = required;
  input.style.cssText = 'width: 100%; padding: 8px; box-sizing: border-box;';
  div.appendChild(input);

  return div;
}