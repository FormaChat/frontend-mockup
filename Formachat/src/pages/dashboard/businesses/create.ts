// pages/dashboard/businesses/create.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createBusiness } from '../../../services/business.service';
import type { CreateBusinessRequest } from '../../../types/business.types';

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
  description.className = 'page-description';
  container.appendChild(description);
  
  // Progress indicator
  const progressBar = createProgressBar(4);
  container.appendChild(progressBar);
  
  // Create form
  const form = document.createElement('form');
  form.className = 'business-form';
  
  // ========================================
  // SECTION 1: BASIC INFORMATION
  // ========================================
  
  const section1 = createSection('1. Basic Information');
  
  // Business Name
  const nameField = createFormField({
    type: 'text',
    name: 'businessName',
    label: 'Business Name',
    required: true,
    maxLength: 100,
    helpText: 'The official name of your business'
  });
  section1.appendChild(nameField);
  
  // Business Description
  const descField = createFormField({
    type: 'textarea',
    name: 'businessDescription',
    label: 'Business Description',
    required: true,
    maxLength: 500,
    placeholder: 'Tell us about your business...',
    helpText: 'A brief overview of what your business does'
  });
  section1.appendChild(descField);
  
  // Business Type with conditional "Other" input
  const typeWrapper = document.createElement('div');
  typeWrapper.className = 'form-field-group';
  
  const typeField = createSelectField({
    name: 'businessType',
    label: 'Business Type',
    options: ['E-commerce', 'Real Estate', 'Restaurant', 'Hotel', 'Service-based', 'Tech/SaaS', 'Healthcare', 'Education', 'Other'],
    required: true
  });
  typeWrapper.appendChild(typeField);
  
  // Conditional "Other" input
  const otherTypeField = createFormField({
    type: 'text',
    name: 'businessTypeOther',
    label: 'Please specify',
    placeholder: 'Enter your business type'
  });
  otherTypeField.style.display = 'none';
  otherTypeField.dataset.conditional = 'true';
  typeWrapper.appendChild(otherTypeField);
  
  // Add change listener for businessType
  const typeSelect = typeField.querySelector('select') as HTMLSelectElement;
  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'Other') {
      otherTypeField.style.display = 'block';
      (otherTypeField.querySelector('input') as HTMLInputElement).required = true;
    } else {
      otherTypeField.style.display = 'none';
      (otherTypeField.querySelector('input') as HTMLInputElement).required = false;
    }
  });
  
  section1.appendChild(typeWrapper);
  
  // Operating Hours
  const hoursField = createFormField({
    type: 'text',
    name: 'operatingHours',
    label: 'Operating Hours',
    required: true,
    placeholder: 'e.g., Mon-Fri 9AM-5PM',
    helpText: 'When is your business available?'
  });
  section1.appendChild(hoursField);
  
  // Location
  const locationField = createFormField({
    type: 'text',
    name: 'location',
    label: 'Location',
    required: true,
    placeholder: 'City, Country',
    helpText: 'Primary business location'
  });
  section1.appendChild(locationField);
  
  // Timezone (optional)
  const timezoneField = createSelectField({
    name: 'timezone',
    label: 'Timezone (Optional)',
    options: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'],
    required: false
  });
  section1.appendChild(timezoneField);
  
  form.appendChild(section1);
  
  // ========================================
  // SECTION 2: PRODUCTS & SERVICES
  // ========================================
  
  const section2 = createSection('2. Products & Services');
  
  // Offerings
  const offeringsField = createFormField({
    type: 'textarea',
    name: 'offerings',
    label: 'What do you offer?',
    required: true,
    maxLength: 1000,
    placeholder: 'Describe your products or services...',
    helpText: 'Detailed description of your offerings'
  });
  section2.appendChild(offeringsField);
  
  // Popular Items (Dynamic Array)
  const popularItemsSection = createDynamicArraySection({
    title: 'Popular Items (Optional)',
    name: 'popularItems',
    fields: [
      { type: 'text', name: 'name', label: 'Item Name', required: true },
      { type: 'textarea', name: 'description', label: 'Description', required: false },
      { type: 'number', name: 'price', label: 'Price', required: false, placeholder: '0.00' }
    ],
    helpText: 'Add your most popular products or services'
  });
  section2.appendChild(popularItemsSection);
  
  // Service Delivery (checkboxes)
  const deliveryField = createCheckboxGroup({
    name: 'serviceDelivery',
    label: 'Service Delivery Options',
    options: ['Delivery', 'Pickup', 'In-person', 'Online/Virtual'],
    helpText: 'How do customers receive your products/services?'
  });
  section2.appendChild(deliveryField);
  
  // Pricing Display
  const pricingWrapper = document.createElement('div');
  pricingWrapper.className = 'form-field-group';
  
  const pricingToggle = createCheckboxField({
    name: 'canDiscussPricing',
    label: 'Allow chatbot to discuss pricing',
    defaultChecked: true,
    helpText: 'Enable if you want the chatbot to share pricing information'
  });
  pricingWrapper.appendChild(pricingToggle);
  
  const pricingNoteField = createFormField({
    type: 'textarea',
    name: 'pricingNote',
    label: 'Pricing Note (Optional)',
    placeholder: 'e.g., Bulk discounts available, Custom quotes for enterprise...'
  });
  
  // Show/hide pricing note based on toggle
  const pricingCheckbox = pricingToggle.querySelector('input') as HTMLInputElement;
  pricingCheckbox.addEventListener('change', () => {
    pricingNoteField.style.display = pricingCheckbox.checked ? 'block' : 'none';
  });
  
  pricingWrapper.appendChild(pricingNoteField);
  section2.appendChild(pricingWrapper);
  
  form.appendChild(section2);
  
  // ========================================
  // SECTION 3: CUSTOMER SUPPORT
  // ========================================
  
  const section3 = createSection('3. Customer Support');
  
  // FAQs (Dynamic Array)
  const faqsSection = createDynamicArraySection({
    title: 'Frequently Asked Questions (Optional)',
    name: 'faqs',
    fields: [
      { type: 'text', name: 'question', label: 'Question', required: true },
      { type: 'textarea', name: 'answer', label: 'Answer', required: true }
    ],
    helpText: 'Add common questions your customers ask'
  });
  section3.appendChild(faqsSection);
  
  // Policies
  const refundField = createFormField({
    type: 'textarea',
    name: 'refundPolicy',
    label: 'Refund Policy',
    required: true,
    placeholder: 'Describe your refund policy...',
    helpText: 'How do you handle refunds?'
  });
  section3.appendChild(refundField);
  
  const cancellationField = createFormField({
    type: 'textarea',
    name: 'cancellationPolicy',
    label: 'Cancellation Policy (Optional)',
    placeholder: 'Describe your cancellation policy...'
  });
  section3.appendChild(cancellationField);
  
  const importantPoliciesField = createFormField({
    type: 'textarea',
    name: 'importantPolicies',
    label: 'Other Important Policies (Optional)',
    placeholder: 'Any other policies customers should know...'
  });
  section3.appendChild(importantPoliciesField);
  
  // Chatbot Tone
  const toneField = createSelectField({
    name: 'chatbotTone',
    label: 'Chatbot Tone',
    options: ['Friendly', 'Professional', 'Casual', 'Formal', 'Playful'],
    required: true,
    helpText: 'How should your chatbot communicate?'
  });
  section3.appendChild(toneField);
  
  // Chatbot Greeting
  const greetingField = createFormField({
    type: 'textarea',
    name: 'chatbotGreeting',
    label: 'Custom Greeting (Optional)',
    placeholder: 'e.g., Hi! Welcome to [Business]. How can I help you today?',
    helpText: 'Customize the first message customers see'
  });
  section3.appendChild(greetingField);
  
  // Chatbot Restrictions
  const restrictionsField = createFormField({
    type: 'textarea',
    name: 'chatbotRestrictions',
    label: 'Chatbot Restrictions (Optional)',
    placeholder: 'e.g., Do not make guarantees about delivery times...',
    helpText: 'What should the chatbot NOT do or promise?'
  });
  section3.appendChild(restrictionsField);
  
  form.appendChild(section3);
  
  // ========================================
  // SECTION 4: CONTACT & ESCALATION
  // ========================================
  
  const section4 = createSection('4. Contact & Escalation');
  
  // Contact Methods (Dynamic Array)
  const contactMethodsSection = createDynamicArraySection({
    title: 'Contact Methods',
    name: 'contactMethods',
    fields: [
      { 
        type: 'select', 
        name: 'method', 
        label: 'Method', 
        required: true,
        options: ['Email', 'Phone', 'WhatsApp', 'Live Chat', 'Social Media']
      },
      { type: 'text', name: 'value', label: 'Contact Details', required: true, placeholder: 'Enter email, phone, etc.' }
    ],
    helpText: 'How can customers reach you?',
    minItems: 1
  });
  section4.appendChild(contactMethodsSection);
  
  // Escalation Contact
  const escalationTitle = document.createElement('h3');
  escalationTitle.textContent = 'Escalation Contact';
  escalationTitle.className = 'subsection-title';
  section4.appendChild(escalationTitle);
  
  const escalationHelp = document.createElement('p');
  escalationHelp.textContent = 'Who should be contacted for complex issues the chatbot cannot handle?';
  escalationHelp.className = 'help-text';
  section4.appendChild(escalationHelp);
  
  const escalationNameField = createFormField({
    type: 'text',
    name: 'escalationName',
    label: 'Contact Name',
    required: true,
    placeholder: 'John Doe'
  });
  section4.appendChild(escalationNameField);
  
  const escalationEmailField = createFormField({
    type: 'email',
    name: 'escalationEmail',
    label: 'Contact Email',
    required: true,
    placeholder: 'john@example.com'
  });
  section4.appendChild(escalationEmailField);
  
  const escalationPhoneField = createFormField({
    type: 'tel',
    name: 'escalationPhone',
    label: 'Contact Phone (Optional)',
    placeholder: '+1-555-123-4567'
  });
  section4.appendChild(escalationPhoneField);
  
  // Chatbot Capabilities
  const capabilitiesField = createCheckboxGroup({
    name: 'chatbotCapabilities',
    label: 'Chatbot Capabilities',
    options: ['Answer FAQs', 'Book apointments', 'Generate leads', 'Handle Complaints', 'Provide product info', 'Process orders'],
    helpText: 'What should your chatbot be able to do?'
  });
  section4.appendChild(capabilitiesField);
  
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
    submitButton.disabled = true;
    submitButton.textContent = 'Creating...';
    errorContainer.style.display = 'none';
    
    const formData = new FormData(form);
    
    // Handle business type "Other"
    let businessType = formData.get('businessType') as string;
    if (businessType === 'Other') {
      businessType = formData.get('businessTypeOther') as string;
    }
    
    // Build request object
    const businessData: CreateBusinessRequest = {
      basicInfo: {
        businessName: formData.get('businessName') as string,
        businessDescription: formData.get('businessDescription') as string,
        businessType: businessType as any,
        operatingHours: formData.get('operatingHours') as string,
        location: formData.get('location') as string,
        timezone: (formData.get('timezone') as string) || undefined
      },
      productsServices: {
        offerings: formData.get('offerings') as string,
        popularItems: collectArrayData(form, 'popularItems'),
        serviceDelivery: formData.getAll('serviceDelivery') as any[],
        pricingDisplay: {
          canDiscussPricing: formData.get('canDiscussPricing') === 'on',
          pricingNote: (formData.get('pricingNote') as string) || undefined
        }
      },
      customerSupport: {
        faqs: collectArrayData(form, 'faqs'),
        policies: {
          refundPolicy: formData.get('refundPolicy') as string,
          cancellationPolicy: (formData.get('cancellationPolicy') as string) || undefined,
          importantPolicies: (formData.get('importantPolicies') as string) || undefined
        },
        chatbotTone: formData.get('chatbotTone') as any,
        chatbotGreeting: (formData.get('chatbotGreeting') as string) || undefined,
        chatbotRestrictions: (formData.get('chatbotRestrictions') as string) || undefined
      },
      contactEscalation: {
        contactMethods: collectArrayData(form, 'contactMethods'),
        escalationContact: {
          name: formData.get('escalationName') as string,
          email: formData.get('escalationEmail') as string,
          phone: (formData.get('escalationPhone') as string) || undefined
        },
        chatbotCapabilities: formData.getAll('chatbotCapabilities') as any[]
      }
    };
    
    await createBusiness(businessData);
    
    alert('Business created successfully!');
    window.location.hash = '#/dashboard/businesses';
    
  } catch (error: any) {
    errorContainer.textContent = error.message || 'Failed to create business';
    errorContainer.style.display = 'block';
    submitButton.disabled = false;
    submitButton.textContent = 'Create Business Bot';
    console.error('Create business error:', error);
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function createProgressBar(totalSteps: number): HTMLElement {
  const progress = document.createElement('div');
  progress.className = 'progress-bar';
  progress.innerHTML = `
    <div class="progress-steps">
      ${Array.from({ length: totalSteps }, (_, i) => `
        <div class="progress-step">
          <div class="step-number">${i + 1}</div>
          <div class="step-label">Step ${i + 1}</div>
        </div>
      `).join('')}
    </div>
  `;
  return progress;
}

function createSection(title: string): HTMLElement {
  const section = document.createElement('section');
  section.className = 'form-section';
  
  const titleElement = document.createElement('h2');
  titleElement.textContent = title;
  section.appendChild(titleElement);
  
  return section;
}

interface FormFieldOptions {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  helpText?: string;
  value?: string;
}

function createFormField(options: FormFieldOptions): HTMLElement {
  const { type, name, label, required = false, maxLength, placeholder = '', helpText, value = '' } = options;
  
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'form-field';
  
  const labelElement = document.createElement('label');
  labelElement.textContent = label + (required ? ' *' : '');
  labelElement.htmlFor = name;
  fieldWrapper.appendChild(labelElement);
  
  if (helpText) {
    const helpElement = document.createElement('span');
    helpElement.className = 'help-text';
    helpElement.textContent = helpText;
    fieldWrapper.appendChild(helpElement);
  }
  
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
  
  if (maxLength) {
    inputElement.maxLength = maxLength;
    
    // Add character counter
    const counter = document.createElement('span');
    counter.className = 'char-counter';
    counter.textContent = `0/${maxLength}`;
    
    inputElement.addEventListener('input', () => {
      counter.textContent = `${inputElement.value.length}/${maxLength}`;
    });
    
    fieldWrapper.appendChild(inputElement);
    fieldWrapper.appendChild(counter);
  } else {
    fieldWrapper.appendChild(inputElement);
  }
  
  return fieldWrapper;
}

interface SelectFieldOptions {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  helpText?: string;
  selectedValue?: string;
}

function createSelectField(options: SelectFieldOptions): HTMLElement {
  const { name, label, options: selectOptions, required = false, helpText, selectedValue = '' } = options;
  
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'form-field';
  
  const labelElement = document.createElement('label');
  labelElement.textContent = label + (required ? ' *' : '');
  labelElement.htmlFor = name;
  fieldWrapper.appendChild(labelElement);
  
  if (helpText) {
    const helpElement = document.createElement('span');
    helpElement.className = 'help-text';
    helpElement.textContent = helpText;
    fieldWrapper.appendChild(helpElement);
  }
  
  const select = document.createElement('select');
  select.name = name;
  select.id = name;
  select.required = required;
  
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select --';
  select.appendChild(defaultOption);
  
  selectOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    optionElement.selected = option === selectedValue;
    select.appendChild(optionElement);
  });
  
  fieldWrapper.appendChild(select);
  
  return fieldWrapper;
}

interface CheckboxGroupOptions {
  name: string;
  label: string;
  options: string[];
  helpText?: string;
  checkedValues?: string[];
}

function createCheckboxGroup(options: CheckboxGroupOptions): HTMLElement {
  const { name, label, options: checkboxOptions, helpText, checkedValues = [] } = options;
  
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'form-field';
  
  const labelElement = document.createElement('label');
  labelElement.textContent = label;
  fieldWrapper.appendChild(labelElement);
  
  if (helpText) {
    const helpElement = document.createElement('span');
    helpElement.className = 'help-text';
    helpElement.textContent = helpText;
    fieldWrapper.appendChild(helpElement);
  }
  
  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'checkbox-group';
  
  checkboxOptions.forEach(option => {
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'checkbox-item';
    
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

function createCheckboxField(options: { name: string; label: string; defaultChecked?: boolean; helpText?: string }): HTMLElement {
  const { name, label, defaultChecked = false, helpText } = options;
  
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'form-field checkbox-field';
  
  const checkboxWrapper = document.createElement('div');
  checkboxWrapper.className = 'checkbox-item';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = name;
  checkbox.id = name;
  checkbox.checked = defaultChecked;
  
  const checkboxLabel = document.createElement('label');
  checkboxLabel.textContent = label;
  checkboxLabel.htmlFor = name;
  
  checkboxWrapper.appendChild(checkbox);
  checkboxWrapper.appendChild(checkboxLabel);
  fieldWrapper.appendChild(checkboxWrapper);
  
  if (helpText) {
    const helpElement = document.createElement('span');
    helpElement.className = 'help-text';
    helpElement.textContent = helpText;
    fieldWrapper.appendChild(helpElement);
  }
  
  return fieldWrapper;
}

interface DynamicArrayField {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface DynamicArrayOptions {
  title: string;
  name: string;
  fields: DynamicArrayField[];
  helpText?: string;
  minItems?: number;
}

function createDynamicArraySection(options: DynamicArrayOptions): HTMLElement {
  const { title, name, fields, helpText, minItems = 0 } = options;
  
  const section = document.createElement('div');
  section.className = 'dynamic-array-section';
  section.dataset.arrayName = name;
  
  const header = document.createElement('div');
  header.className = 'dynamic-array-header';
  
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  header.appendChild(titleElement);
  
  if (helpText) {
    const helpElement = document.createElement('p');
    helpElement.className = 'help-text';
    helpElement.textContent = helpText;
    header.appendChild(helpElement);
  }
  
  section.appendChild(header);
  
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'dynamic-array-items';
  section.appendChild(itemsContainer);
  
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'btn-secondary';
  addButton.textContent = `+ Add ${title.replace(/\s*\(Optional\)/, '')}`;
  
  addButton.addEventListener('click', () => {
    const item = createDynamicArrayItem(name, fields, itemsContainer, minItems);
    itemsContainer.appendChild(item);
  });
  
  section.appendChild(addButton);
  
  // Add first item if minItems > 0
  if (minItems > 0) {
    for (let i = 0; i < minItems; i++) {
      const item = createDynamicArrayItem(name, fields, itemsContainer, minItems);
      itemsContainer.appendChild(item);
    }
  }
  
  return section;
}

function createDynamicArrayItem(
  arrayName: string,
  fields: DynamicArrayField[],
  container: HTMLElement,
  minItems: number
): HTMLElement {
  const item = document.createElement('div');
  item.className = 'dynamic-array-item';
  
  const index = container.children.length;
  
  fields.forEach(field => {
    const fieldName = `${arrayName}[${index}][${field.name}]`;
    
    if (field.type === 'select' && field.options) {
      const selectField = createSelectField({
        name: fieldName,
        label: field.label,
        options: field.options,
        required: field.required
      });
      item.appendChild(selectField);
    } else {
      const formField = createFormField({
        type: field.type,
        name: fieldName,
        label: field.label,
        required: field.required,
        placeholder: field.placeholder
      });
      item.appendChild(formField);
    }
  });
  
  // Remove button
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'btn-remove';
  removeButton.textContent = 'Remove';
  
  removeButton.addEventListener('click', () => {
    if (container.children.length > minItems) {
      item.remove();
      // Re-index remaining items
      reindexArrayItems(container, arrayName);
    }
  });
  
  // Only show remove button if not required or if there are more than minItems
  if (minItems === 0 || container.children.length >= minItems) {
    item.appendChild(removeButton);
  }
  
  return item;
}

function reindexArrayItems(container: HTMLElement, arrayName: string): void {
  Array.from(container.children).forEach((item, newIndex) => {
    const inputs = item.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const nameAttr = (input as HTMLInputElement).name;
      const fieldName = nameAttr.match(/\[([^\]]+)\]$/)?.[1];
      if (fieldName) {
        (input as HTMLInputElement).name = `${arrayName}[${newIndex}][${fieldName}]`;
      }
    });
  });
}

function collectArrayData(form: HTMLFormElement, arrayName: string): any[] {
  const items: any[] = [];
  const formData = new FormData(form);
  
  // Find the highest index
  let maxIndex = -1;
  for (const key of formData.keys()) {
    if (key.startsWith(`${arrayName}[`)) {
      const match = key.match(/\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        if (index > maxIndex) maxIndex = index;
      }
    }
  }
  
  // Collect data for each index
  for (let i = 0; i <= maxIndex; i++) {
    const item: any = {};
    let hasData = false;
    
    for (const key of formData.keys()) {
      if (key.startsWith(`${arrayName}[${i}]`)) {
        const fieldMatch = key.match(/\[([^\]]+)\]$/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          const value = formData.get(key);
          if (value) {
            item[fieldName] = fieldName === 'price' ? parseFloat(value as string) : value;
            hasData = true;
          }
        }
      }
    }
    
    if (hasData) {
      items.push(item);
    }
  }
  
  return items;
}