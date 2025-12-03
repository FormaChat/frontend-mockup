// pages/dashboard/businesses/edit.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { getBusinessById, updateBusiness } from '../../../services/business.service';
import type { UpdateBusinessRequest, Business } from '../../../types/business';

export async function renderBusinessEdit(businessId: string): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'business-edit';
  
  // Show loading spinner while fetching business
  const spinner = createLoadingSpinner('Loading business...');
  container.appendChild(spinner);
  
  try {
    // Fetch business data
    const business = await getBusinessById(businessId);
    
    // Remove spinner
    hideLoadingSpinner(spinner);
    
    // Breadcrumb
    const breadcrumb = createBreadcrumb([
      { label: 'Businesses', path: '#/dashboard/businesses' },
      { label: business.basicInfo.businessName }
    ]);
    container.appendChild(breadcrumb);
    
    // Page heading
    const heading = document.createElement('h1');
    heading.textContent = `Edit: ${business.basicInfo.businessName}`;
    container.appendChild(heading);
    
    // Create form with pre-filled data
    const form = createEditForm(business);
    container.appendChild(form);
    
  } catch (error: any) {
    hideLoadingSpinner(spinner);
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load business. Please try again.';
    errorMessage.className = 'error-message';
    container.appendChild(errorMessage);
    
    console.error('Failed to fetch business:', error);
  }
  
  return container;
}

/**
 * Create edit form with pre-filled data
 */
function createEditForm(business: Business): HTMLElement {
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
  const nameField = createFormField('text', 'businessName', 'Business Name', true, '', business.basicInfo.businessName);
  section1.appendChild(nameField);
  
  // Business Description
  const descField = createFormField('textarea', 'businessDescription', 'Business Description', true, '', business.basicInfo.businessDescription);
  section1.appendChild(descField);
  
  // Business Type
  const typeField = createSelectField('businessType', 'Business Type', [
    'E-commerce', 'Real Estate', 'Restaurant', 'Hotel', 
    'Service-based', 'Tech/SaaS', 'Healthcare', 'Education', 'Other'
  ], true, business.basicInfo.businessType);
  section1.appendChild(typeField);
  
  // Operating Hours
  const hoursField = createFormField('text', 'operatingHours', 'Operating Hours', true, '', business.basicInfo.operatingHours);
  section1.appendChild(hoursField);
  
  // Location
  const locationField = createFormField('text', 'location', 'Location', true, '', business.basicInfo.location);
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
  const offeringsField = createFormField('textarea', 'offerings', 'What do you offer?', true, '', business.productsServices.offerings);
  section2.appendChild(offeringsField);
  
  // Service Delivery (checkboxes)
  const deliveryField = createCheckboxGroup('serviceDelivery', 'Service Delivery Options', [
    'Delivery', 'Pickup', 'In-person', 'Online/Virtual'
  ], business.productsServices.serviceDelivery);
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
  ], true, business.customerSupport.chatbotTone);
  section3.appendChild(toneField);
  
  // Refund Policy
  const refundField = createFormField('textarea', 'refundPolicy', 'Refund Policy', true, '', business.customerSupport.policies.refundPolicy);
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
  const primaryContact = business.contactEscalation.contactMethods[0];
  const contactMethodField = createSelectField('contactMethod', 'Preferred Contact Method', [
    'Email', 'Phone', 'WhatsApp', 'Live Chat', 'Social Media'
  ], true, primaryContact?.method);
  section4.appendChild(contactMethodField);
  
  // Contact Value
  const contactValueField = createFormField('text', 'contactValue', 'Contact Details', true, '', primaryContact?.value);
  section4.appendChild(contactValueField);
  
  // Escalation Contact Name
  const escalationNameField = createFormField('text', 'escalationName', 'Escalation Contact Name', true, '', business.contactEscalation.escalationContact.name);
  section4.appendChild(escalationNameField);
  
  // Escalation Email
  const escalationEmailField = createFormField('email', 'escalationEmail', 'Escalation Contact Email', true, '', business.contactEscalation.escalationContact.email);
  section4.appendChild(escalationEmailField);
  
  form.appendChild(section4);
  
  // ========================================
  // SUBMIT BUTTON
  // ========================================
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Save Changes';
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
    await handleUpdateBusiness(business._id, form, submitButton, errorContainer);
  });
  
  return form;
}

/**
 * Handle business update
 */
async function handleUpdateBusiness(
  businessId: string,
  form: HTMLFormElement,
  submitButton: HTMLButtonElement,
  errorContainer: HTMLElement
): Promise<void> {
  try {
    // Disable form
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    errorContainer.style.display = 'none';
    
    // Get form data
    const formData = new FormData(form);
    
    // Build update request object
    const updateData: UpdateBusinessRequest = {
      basicInfo: {
        businessName: formData.get('businessName') as string,
        businessDescription: formData.get('businessDescription') as string,
        businessType: formData.get('businessType') as any,
        operatingHours: formData.get('operatingHours') as string,
        location: formData.get('location') as string
      },
      productsServices: {
        offerings: formData.get('offerings') as string,
        serviceDelivery: formData.getAll('serviceDelivery') as any[]
      },
      customerSupport: {
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
        }
      }
    };
    
    // Update business
    await updateBusiness(businessId, updateData);
    
    // Success - redirect to businesses list
    alert('Business updated successfully!');
    window.location.hash = '#/dashboard/businesses';
    
  } catch (error: any) {
    // Show error
    errorContainer.textContent = error.message || 'Failed to update business';
    errorContainer.style.display = 'block';
    
    // Re-enable form
    submitButton.disabled = false;
    submitButton.textContent = 'Save Changes';
    
    console.error('Update business error:', error);
  }
}

/**
 * Helper: Create form field with value
 */
function createFormField(
  type: string,
  name: string,
  label: string,
  required: boolean = false,
  placeholder: string = '',
  value: string = ''
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
  inputElement.value = value;
  
  fieldWrapper.appendChild(inputElement);
  
  return fieldWrapper;
}

/**
 * Helper: Create select field with selected value
 */
function createSelectField(
  name: string,
  label: string,
  options: string[],
  required: boolean = false,
  selectedValue: string = ''
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
    optionElement.selected = option === selectedValue;
    select.appendChild(optionElement);
  });
  
  fieldWrapper.appendChild(select);
  
  return fieldWrapper;
}

/**
 * Helper: Create checkbox group with checked values
 */
function createCheckboxGroup(
  name: string,
  label: string,
  options: string[],
  checkedValues: string[] = []
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
    checkbox.checked = checkedValues.includes(option);
    
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