// pages/dashboard/businesses/edit.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { getBusinessById, updateBusiness } from '../../../services/business.service';
import type { UpdateBusinessRequest, Business } from '../../../types/business.types';

export async function renderBusinessEdit(businessId: string): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'business-edit';
  
  const spinner = createLoadingSpinner('Loading business...');
  container.appendChild(spinner);
  
  try {
    const business = await getBusinessById(businessId);
    hideLoadingSpinner(spinner);
    
    const breadcrumb = createBreadcrumb([
      { label: 'Businesses', path: '#/dashboard/businesses' },
      { label: business.basicInfo.businessName }
    ]);
    container.appendChild(breadcrumb);
    
    const heading = document.createElement('h1');
    heading.textContent = `Edit: ${business.basicInfo.businessName}`;
    container.appendChild(heading);
    
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

function createEditForm(business: Business): HTMLElement {
  const form = document.createElement('form');
  form.className = 'business-form';
  
  // ========================================
  // SECTION 1: BASIC INFORMATION
  // ========================================
  
  const section1 = createSection('1. Basic Information');
  
  const nameField = createFormField({
    type: 'text',
    name: 'businessName',
    label: 'Business Name',
    required: true,
    maxLength: 100,
    value: business.basicInfo.businessName,
    helpText: 'The official name of your business'
  });
  section1.appendChild(nameField);
  
  const descField = createFormField({
    type: 'textarea',
    name: 'businessDescription',
    label: 'Business Description',
    required: true,
    maxLength: 500,
    value: business.basicInfo.businessDescription,
    helpText: 'A brief overview of what your business does'
  });
  section1.appendChild(descField);
  
  // Business Type with conditional "Other" input
  const typeWrapper = document.createElement('div');
  typeWrapper.className = 'form-field-group';
  
  const knownTypes = ['E-commerce', 'Real Estate', 'Restaurant', 'Hotel', 'Service-based', 'Tech/SaaS', 'Healthcare', 'Education'];
  const isOtherType = !knownTypes.includes(business.basicInfo.businessType);
  
  const typeField = createSelectField({
    name: 'businessType',
    label: 'Business Type',
    options: [...knownTypes, 'Other'],
    required: true,
    selectedValue: isOtherType ? 'Other' : business.basicInfo.businessType
  });
  typeWrapper.appendChild(typeField);
  
  const otherTypeField = createFormField({
    type: 'text',
    name: 'businessTypeOther',
    label: 'Please specify',
    placeholder: 'Enter your business type',
    value: isOtherType ? business.basicInfo.businessType : ''
  });
  otherTypeField.style.display = isOtherType ? 'block' : 'none';
  otherTypeField.dataset.conditional = 'true';
  typeWrapper.appendChild(otherTypeField);
  
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
  
  const hoursField = createFormField({
    type: 'text',
    name: 'operatingHours',
    label: 'Operating Hours',
    required: true,
    value: business.basicInfo.operatingHours,
    helpText: 'When is your business available?'
  });
  section1.appendChild(hoursField);
  
  const locationField = createFormField({
    type: 'text',
    name: 'location',
    label: 'Location',
    required: true,
    value: business.basicInfo.location,
    helpText: 'Primary business location'
  });
  section1.appendChild(locationField);
  
  const timezoneField = createSelectField({
    name: 'timezone',
    label: 'Timezone (Optional)',
    options: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'],
    required: false,
    selectedValue: business.basicInfo.timezone || ''
  });
  section1.appendChild(timezoneField);
  
  form.appendChild(section1);
  
  // ========================================
  // SECTION 2: PRODUCTS & SERVICES
  // ========================================
  
  const section2 = createSection('2. Products & Services');
  
  const offeringsField = createFormField({
    type: 'textarea',
    name: 'offerings',
    label: 'What do you offer?',
    required: true,
    maxLength: 1000,
    value: business.productsServices.offerings,
    helpText: 'Detailed description of your offerings'
  });
  section2.appendChild(offeringsField);
  
  const popularItemsSection = createDynamicArraySection({
    title: 'Popular Items (Optional)',
    name: 'popularItems',
    fields: [
      { type: 'text', name: 'name', label: 'Item Name', required: true },
      { type: 'textarea', name: 'description', label: 'Description', required: false },
      { type: 'number', name: 'price', label: 'Price', required: false, placeholder: '0.00' }
    ],
    helpText: 'Add your most popular products or services',
    existingData: business.productsServices.popularItems
  });
  section2.appendChild(popularItemsSection);
  
  const deliveryField = createCheckboxGroup({
    name: 'serviceDelivery',
    label: 'Service Delivery Options',
    options: ['Delivery', 'Pickup', 'In-person', 'Online/Virtual'],
    checkedValues: business.productsServices.serviceDelivery,
    helpText: 'How do customers receive your products/services?'
  });
  section2.appendChild(deliveryField);
  
  // Pricing Display
  const pricingWrapper = document.createElement('div');
  pricingWrapper.className = 'form-field-group';
  
  const canDiscussPricing = business.productsServices.pricingDisplay?.canDiscussPricing ?? true;
  
  const pricingToggle = createCheckboxField({
    name: 'canDiscussPricing',
    label: 'Allow chatbot to discuss pricing',
    defaultChecked: canDiscussPricing,
    helpText: 'Enable if you want the chatbot to share pricing information'
  });
  pricingWrapper.appendChild(pricingToggle);
  
  const pricingNoteField = createFormField({
    type: 'textarea',
    name: 'pricingNote',
    label: 'Pricing Note (Optional)',
    placeholder: 'e.g., Bulk discounts available, Custom quotes for enterprise...',
    value: business.productsServices.pricingDisplay?.pricingNote || ''
  });
  pricingNoteField.style.display = canDiscussPricing ? 'block' : 'none';
  
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
  
  const faqsSection = createDynamicArraySection({
    title: 'Frequently Asked Questions (Optional)',
    name: 'faqs',
    fields: [
      { type: 'text', name: 'question', label: 'Question', required: true },
      { type: 'textarea', name: 'answer', label: 'Answer', required: true }
    ],
    helpText: 'Add common questions your customers ask',
    existingData: business.customerSupport.faqs
  });
  section3.appendChild(faqsSection);
  
  const refundField = createFormField({
    type: 'textarea',
    name: 'refundPolicy',
    label: 'Refund Policy',
    required: true,
    value: business.customerSupport.policies.refundPolicy,
    helpText: 'How do you handle refunds?'
  });
  section3.appendChild(refundField);
  
  const cancellationField = createFormField({
    type: 'textarea',
    name: 'cancellationPolicy',
    label: 'Cancellation Policy (Optional)',
    value: business.customerSupport.policies.cancellationPolicy || ''
  });
  section3.appendChild(cancellationField);
  
  const importantPoliciesField = createFormField({
    type: 'textarea',
    name: 'importantPolicies',
    label: 'Other Important Policies (Optional)',
    value: business.customerSupport.policies.importantPolicies || ''
  });
  section3.appendChild(importantPoliciesField);
  
  const toneField = createSelectField({
    name: 'chatbotTone',
    label: 'Chatbot Tone',
    options: ['Friendly', 'Professional', 'Casual', 'Formal', 'Playful'],
    required: true,
    selectedValue: business.customerSupport.chatbotTone,
    helpText: 'How should your chatbot communicate?'
  });
  section3.appendChild(toneField);
  
  const greetingField = createFormField({
    type: 'textarea',
    name: 'chatbotGreeting',
    label: 'Custom Greeting (Optional)',
    value: business.customerSupport.chatbotGreeting || '',
    helpText: 'Customize the first message customers see'
  });
  section3.appendChild(greetingField);
  
  const restrictionsField = createFormField({
    type: 'textarea',
    name: 'chatbotRestrictions',
    label: 'Chatbot Restrictions (Optional)',
    value: business.customerSupport.chatbotRestrictions || '',
    helpText: 'What should the chatbot NOT do or promise?'
  });
  section3.appendChild(restrictionsField);
  
  form.appendChild(section3);
  
  // ========================================
  // SECTION 4: CONTACT & ESCALATION
  // ========================================
  
  const section4 = createSection('4. Contact & Escalation');
  
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
    minItems: 1,
    existingData: business.contactEscalation.contactMethods
  });
  section4.appendChild(contactMethodsSection);
  
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
    value: business.contactEscalation.escalationContact.name
  });
  section4.appendChild(escalationNameField);
  
  const escalationEmailField = createFormField({
    type: 'email',
    name: 'escalationEmail',
    label: 'Contact Email',
    required: true,
    value: business.contactEscalation.escalationContact.email
  });
  section4.appendChild(escalationEmailField);
  
  const escalationPhoneField = createFormField({
    type: 'tel',
    name: 'escalationPhone',
    label: 'Contact Phone (Optional)',
    value: business.contactEscalation.escalationContact.phone || ''
  });
  section4.appendChild(escalationPhoneField);
  
  const capabilitiesField = createCheckboxGroup({
    name: 'chatbotCapabilities',
    label: 'Chatbot Capabilities',
    options: ['Answer FAQs', 'Book apointments', 'Generate leads', 'Handle Complaints', 'Provide product info', 'Process orders'],
    checkedValues: business.contactEscalation.chatbotCapabilities,
    helpText: 'What should your chatbot be able to do?'
  });
  section4.appendChild(capabilitiesField);
  
  form.appendChild(section4);
  
  // ========================================
  // SUBMIT BUTTON
  // ========================================
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Save Changes';
  submitButton.className = 'btn-primary';
  form.appendChild(submitButton);
  
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  errorContainer.style.display = 'none';
  form.appendChild(errorContainer);
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleUpdateBusiness(business._id, form, submitButton, errorContainer);
  });
  
  return form;
}

async function handleUpdateBusiness(
  businessId: string,
  form: HTMLFormElement,
  submitButton: HTMLButtonElement,
  errorContainer: HTMLElement
): Promise<void> {
  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    errorContainer.style.display = 'none';
    
    const formData = new FormData(form);
    
    let businessType = formData.get('businessType') as string;
    if (businessType === 'Other') {
      businessType = formData.get('businessTypeOther') as string;
    }
    
    const updateData: UpdateBusinessRequest = {
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
    
    await updateBusiness(businessId, updateData);
    
    alert('Business updated successfully!');
    window.location.hash = '#/dashboard/businesses';
    
  } catch (error: any) {
    errorContainer.textContent = error.message || 'Failed to update business';
    errorContainer.style.display = 'block';
    submitButton.disabled = false;
    submitButton.textContent = 'Save Changes';
    console.error('Update business error:', error);
  }
}

// ========================================
// HELPER FUNCTIONS (Same as create.ts)
// ========================================

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
    
    const counter = document.createElement('span');
    counter.className = 'char-counter';
    counter.textContent = `${value.length}/${maxLength}`;
    
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
  existingData?: any[];
}

function createDynamicArraySection(options: DynamicArrayOptions): HTMLElement {
  const { title, name, fields, helpText, minItems = 0, existingData = [] } = options;
  
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
  
  // Pre-populate with existing data
  if (existingData.length > 0) {
    existingData.forEach((data) => {
      const item = createDynamicArrayItem(name, fields, itemsContainer, minItems, data);
      itemsContainer.appendChild(item);
    });
  } else if (minItems > 0) {
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
  minItems: number,
  existingData?: any
): HTMLElement {
  const item = document.createElement('div');
  item.className = 'dynamic-array-item';
  
  const index = container.children.length;
  
  fields.forEach(field => {
    const fieldName = `${arrayName}[${index}][${field.name}]`;
    const fieldValue = existingData ? (existingData[field.name] || '') : '';
    
    if (field.type === 'select' && field.options) {
      const selectField = createSelectField({
        name: fieldName,
        label: field.label,
        options: field.options,
        required: field.required,
        selectedValue: fieldValue
      });
      item.appendChild(selectField);
    } else {
      const formField = createFormField({
        type: field.type,
        name: fieldName,
        label: field.label,
        required: field.required,
        placeholder: field.placeholder,
        value: String(fieldValue)
      });
      item.appendChild(formField);
    }
  });
  
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'btn-remove';
  removeButton.textContent = 'Remove';
  
  removeButton.addEventListener('click', () => {
    if (container.children.length > minItems) {
      item.remove();
      reindexArrayItems(container, arrayName);
    }
  });
  
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