// pages/dashboard/businesses/create.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createBusiness } from '../../../services/business.service';
import type { CreateBusinessRequest } from '../../../types/business';

export async function renderBusinessCreate(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'business-create';
  
  // Breadcrumb
  const breadcrumb = createBreadcrumb([
    { label: 'Businesses', path: '#/dashboard/businesses' },
    { label: 'Create New Business' }
  ]);
  container.appendChild(breadcrumb);
  
  // Page heading
  const heading = document.createElement('h1');
  heading.textContent = 'Create Your Business Bot';
  container.appendChild(heading);
  
  const description = document.createElement('p');
  description.textContent = 'Fill out the questionnaire below to create your AI-powered chatbot.';
  container.appendChild(description);
  
  // Create form
  const form = document.createElement('form');
  form.className = 'business-form';
  
  // ========================================
  // SECTION 1: BASIC INFORMATION
  // ========================================
  
  const section1 = document.createElement('section');
  section1.className = 'form-section';
  
  const section1Title = document.createElement('h2');
  section1Title.textContent = '1. Basic Information';
  section1.appendChild(section1Title);
  
  // Business Name
  const nameField = createFormField('text', 'businessName', 'Business Name', true);
  section1.appendChild(nameField);
  
  // Business Description
  const descField = createFormField('textarea', 'businessDescription', 'Business Description', true, 'Tell us about your business...');
  section1.appendChild(descField);
  
  // Business Type
  const typeField = createSelectField('businessType', 'Business Type', [
    'E-commerce', 'Real Estate', 'Restaurant', 'Hotel', 
    'Service-based', 'Tech/SaaS', 'Healthcare', 'Education', 'Other'
  ], true);
  section1.appendChild(typeField);
  
  // Operating Hours
  const hoursField = createFormField('text', 'operatingHours', 'Operating Hours', true, 'e.g., Mon-Fri 9AM-5PM');
  section1.appendChild(hoursField);
  
  // Location
  const locationField = createFormField('text', 'location', 'Location', true, 'City, Country');
  section1.appendChild(locationField);
  
  form.appendChild(section1);
  
  // ========================================
  // SECTION 2: PRODUCTS & SERVICES
  // ========================================
  
  const section2 = document.createElement('section');
  section2.className = 'form-section';
  
  const section2Title = document.createElement('h2');
  section2Title.textContent = '2. Products & Services';
  section2.appendChild(section2Title);
  
  // Offerings
  const offeringsField = createFormField('textarea', 'offerings', 'What do you offer?', true, 'Describe your products or services...');
  section2.appendChild(offeringsField);
  
  // Service Delivery (checkboxes)
  const deliveryField = createCheckboxGroup('serviceDelivery', 'Service Delivery Options', [
    'Delivery', 'Pickup', 'In-person', 'Online/Virtual'
  ]);
  section2.appendChild(deliveryField);
  
  form.appendChild(section2);
  
  // ========================================
  // SECTION 3: CUSTOMER SUPPORT
  // ========================================
  
  const section3 = document.createElement('section');
  section3.className = 'form-section';
  
  const section3Title = document.createElement('h2');
  section3Title.textContent = '3. Customer Support';
  section3.appendChild(section3Title);
  
  // Chatbot Tone
  const toneField = createSelectField('chatbotTone', 'Chatbot Tone', [
    'Friendly', 'Professional', 'Casual', 'Formal', 'Playful'
  ], true);
  section3.appendChild(toneField);
  
  // Refund Policy
  const refundField = createFormField('textarea', 'refundPolicy', 'Refund Policy', true);
  section3.appendChild(refundField);
  
  form.appendChild(section3);
  
  // ========================================
  // SECTION 4: CONTACT & ESCALATION
  // ========================================
  
  const section4 = document.createElement('section');
  section4.className = 'form-section';
  
  const section4Title = document.createElement('h2');
  section4Title.textContent = '4. Contact & Escalation';
  section4.appendChild(section4Title);
  
  // Contact Method
  const contactMethodField = createSelectField('contactMethod', 'Preferred Contact Method', [
    'Email', 'Phone', 'WhatsApp', 'Live Chat', 'Social Media'
  ], true);
  section4.appendChild(contactMethodField);
  
  // Contact Value
  const contactValueField = createFormField('text', 'contactValue', 'Contact Details', true, 'Enter email, phone, etc.');
  section4.appendChild(contactValueField);
  
  // Escalation Contact Name
  const escalationNameField = createFormField('text', 'escalationName', 'Escalation Contact Name', true);
  section4.appendChild(escalationNameField);
  
  // Escalation Email
  const escalationEmailField = createFormField('email', 'escalationEmail', 'Escalation Contact Email', true);
  section4.appendChild(escalationEmailField);
  
  form.appendChild(section4);
  
  // ========================================
  // SUBMIT BUTTON
  // ========================================
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Create Business Bot';
  submitButton.className = 'btn-primary';
  form.appendChild(submitButton);
  
  // Error message container
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  errorContainer.style.display = 'none';
  form.appendChild(errorContainer);
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleCreateBusiness(form, submitButton, errorContainer);
  });
  
  container.appendChild(form);
  
  return container;
}

/**
 * Handle business creation
 */
async function handleCreateBusiness(
  form: HTMLFormElement,
  submitButton: HTMLButtonElement,
  errorContainer: HTMLElement
): Promise<void> {
  try {
    // Disable form
    submitButton.disabled = true;
    submitButton.textContent = 'Creating...';
    errorContainer.style.display = 'none';
    
    // Get form data
    const formData = new FormData(form);
    
    // Build request object
    const businessData: CreateBusinessRequest = {
      basicInfo: {
        businessName: formData.get('businessName') as string,
        businessDescription: formData.get('businessDescription') as string,
        businessType: formData.get('businessType') as any,
        operatingHours: formData.get('operatingHours') as string,
        location: formData.get('location') as string
      },
      productsServices: {
        offerings: formData.get('offerings') as string,
        popularItems: [], // Empty for now
        serviceDelivery: formData.getAll('serviceDelivery') as any[]
      },
      customerSupport: {
        faqs: [], // Empty for now
        policies: {
          refundPolicy: formData.get('refundPolicy') as string
        },
        chatbotTone: formData.get('chatbotTone') as any
      },
      contactEscalation: {
        contactMethods: [{
          method: formData.get('contactMethod') as any,
          value: formData.get('contactValue') as string
        }],
        escalationContact: {
          name: formData.get('escalationName') as string,
          email: formData.get('escalationEmail') as string
        },
        chatbotCapabilities: [] // Empty for now
      }
    };
    
    // Create business
    await createBusiness(businessData);
    
    // Success - redirect to businesses list
    alert('Business created successfully!');
    window.location.hash = '#/dashboard/businesses';
    
  } catch (error: any) {
    // Show error
    errorContainer.textContent = error.message || 'Failed to create business';
    errorContainer.style.display = 'block';
    
    // Re-enable form
    submitButton.disabled = false;
    submitButton.textContent = 'Create Business Bot';
    
    console.error('Create business error:', error);
  }
}

/**
 * Helper: Create form field
 */
function createFormField(
  type: string,
  name: string,
  label: string,
  required: boolean = false,
  placeholder: string = ''
): HTMLElement {
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'form-field';
  
  const labelElement = document.createElement('label');
  labelElement.textContent = label;
  labelElement.htmlFor = name;
  fieldWrapper.appendChild(labelElement);
  
  let inputElement: HTMLInputElement | HTMLTextAreaElement;
  
  if (type === 'textarea') {
    inputElement = document.createElement('textarea');
    inputElement.rows = 4;
  } else {
    inputElement = document.createElement('input');
    inputElement.type = type;
  }
  
  inputElement.name = name;
  inputElement.id = name;
  inputElement.placeholder = placeholder;
  inputElement.required = required;
  
  fieldWrapper.appendChild(inputElement);
  
  return fieldWrapper;
}

/**
 * Helper: Create select field
 */
function createSelectField(
  name: string,
  label: string,
  options: string[],
  required: boolean = false
): HTMLElement {
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'form-field';
  
  const labelElement = document.createElement('label');
  labelElement.textContent = label;
  labelElement.htmlFor = name;
  fieldWrapper.appendChild(labelElement);
  
  const select = document.createElement('select');
  select.name = name;
  select.id = name;
  select.required = required;
  
  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select --';
  select.appendChild(defaultOption);
  
  // Add options
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
  
  fieldWrapper.appendChild(select);
  
  return fieldWrapper;
}

/**
 * Helper: Create checkbox group
 */
function createCheckboxGroup(
  name: string,
  label: string,
  options: string[]
): HTMLElement {
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'form-field';
  
  const labelElement = document.createElement('label');
  labelElement.textContent = label;
  fieldWrapper.appendChild(labelElement);
  
  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'checkbox-group';
  
  options.forEach(option => {
    const checkboxWrapper = document.createElement('div');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = name;
    checkbox.value = option;
    checkbox.id = `${name}_${option}`;
    
    const checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = option;
    checkboxLabel.htmlFor = `${name}_${option}`;
    
    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(checkboxLabel);
    checkboxContainer.appendChild(checkboxWrapper);
  });
  
  fieldWrapper.appendChild(checkboxContainer);
  
  return fieldWrapper;
}