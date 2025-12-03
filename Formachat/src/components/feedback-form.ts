// components/feedback-form.ts

export function createFeedbackForm(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'feedback-form';
  
  const heading = document.createElement('h3');
  heading.textContent = 'Share Your Feedback';
  container.appendChild(heading);
  
  const form = document.createElement('form');
  
  // Feedback textarea
  const textarea = document.createElement('textarea');
  textarea.name = 'feedback';
  textarea.placeholder = 'Tell us what you think...';
  textarea.rows = 4;
  textarea.required = true;
  form.appendChild(textarea);
  
  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit Feedback';
  form.appendChild(submitBtn);
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedbackText = textarea.value.trim();
    
    if (!feedbackText) return;
    
    // TODO: Send feedback to backend
    console.log('Feedback submitted:', feedbackText);
    
    // Reset form
    textarea.value = '';
    alert('Thank you for your feedback!');
  });
  
  container.appendChild(form);
  return container;
}