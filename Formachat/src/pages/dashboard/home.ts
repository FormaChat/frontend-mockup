// pages/dashboard/home.ts
import { createFeedbackForm } from '../../components/feedback-form';
import type { Feature } from '../../components/features-section';
import { createFeaturesSection } from '../../components/features-section';

export function renderDashboardHome(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'dashboard-home';
  
  // Hero Section
  const heroSection = document.createElement('section');
  heroSection.className = 'hero-section';
  
  const heroText = document.createElement('h1');
  heroText.textContent = 'Create intelligent chatbots powered by your business knowledge';
  heroSection.appendChild(heroText);
  
  const ctaButton = document.createElement('button');
  ctaButton.textContent = 'Create Business Bot';
  ctaButton.className = 'cta-button';
  ctaButton.addEventListener('click', () => {
    window.location.hash = '#/dashboard/businesses/create';
  });
  heroSection.appendChild(ctaButton);
  
  container.appendChild(heroSection);
  
  // Features/Pricing Section
  const features: Feature[] = [
    {
      title: 'AI-Powered Conversations',
      description: 'Build chatbots that understand and respond naturally to your customers',
      status: 'available'
    },
    {
      title: 'Multi-Channel Support',
      description: 'Deploy your bot across web, WhatsApp, and more',
      status: 'available'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track sessions, leads, and conversation metrics in real-time',
      status: 'available'
    },
    {
      title: 'Advanced Integrations',
      description: 'Connect with your CRM, email marketing, and other tools',
      status: 'coming-soon'
    }
  ];
  
  const featuresSection = createFeaturesSection(features);
  container.appendChild(featuresSection);
  
  // Feedback Section
  const feedbackSection = createFeedbackForm();
  container.appendChild(feedbackSection);
  
  return container;
}