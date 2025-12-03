// pages/dashboard/analytics/detail.ts
import { createBreadcrumb } from '../../../components/breadcrumb';
import { createLoadingSpinner, hideLoadingSpinner } from '../../../components/loading-spinner';
import { getBusinessById } from '../../../services/business.service';

export async function renderAnalyticsDetail(businessId: string): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'analytics-detail';
  
  // Show loading spinner
  const spinner = createLoadingSpinner('Loading analytics...');
  container.appendChild(spinner);
  
  try {
    // Fetch business details
    const business = await getBusinessById(businessId);
    
    // Remove spinner
    hideLoadingSpinner(spinner);
    
    // Breadcrumb
    const breadcrumb = createBreadcrumb([
      { label: 'Analytics', path: '#/dashboard/analytics' },
      { label: business.basicInfo.businessName }
    ]);
    container.appendChild(breadcrumb);
    
    // Page heading
    const heading = document.createElement('h1');
    heading.textContent = `Analytics - ${business.basicInfo.businessName}`;
    container.appendChild(heading);
    
    // Stats Overview Section
    const statsSection = document.createElement('section');
    statsSection.className = 'stats-section';
    
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    
    // Sessions stat
    const sessionsCard = createStatCard('Total Sessions', '1,234', '+12% from last month');
    statsGrid.appendChild(sessionsCard);
    
    // Leads stat
    const leadsCard = createStatCard('Total Leads', '456', '+8% from last month');
    statsGrid.appendChild(leadsCard);
    
    // Messages stat
    const messagesCard = createStatCard('Total Messages', '5,678', '+15% from last month');
    statsGrid.appendChild(messagesCard);
    
    // Conversion rate stat
    const conversionCard = createStatCard('Conversion Rate', '37%', '+3% from last month');
    statsGrid.appendChild(conversionCard);
    
    statsSection.appendChild(statsGrid);
    container.appendChild(statsSection);
    
    // Charts Section
    const chartsSection = document.createElement('section');
    chartsSection.className = 'charts-section';
    
    const chartsHeading = document.createElement('h2');
    chartsHeading.textContent = 'Performance Over Time';
    chartsSection.appendChild(chartsHeading);
    
    const chartPlaceholder = document.createElement('div');
    chartPlaceholder.className = 'chart-placeholder';
    chartPlaceholder.textContent = '[Chart will be rendered here]';
    chartsSection.appendChild(chartPlaceholder);
    
    container.appendChild(chartsSection);
    
    // Recent Activity Section
    const activitySection = document.createElement('section');
    activitySection.className = 'activity-section';
    
    const activityHeading = document.createElement('h2');
    activityHeading.textContent = 'Recent Activity';
    activitySection.appendChild(activityHeading);
    
    const activityList = document.createElement('ul');
    activityList.className = 'activity-list';
    
    // Sample activity items
    const activities = [
      { time: '2 hours ago', message: 'New lead captured from web chat' },
      { time: '5 hours ago', message: 'Session started via WhatsApp' },
      { time: '1 day ago', message: 'New lead captured from QR code scan' }
    ];
    
    activities.forEach(activity => {
      const li = document.createElement('li');
      
      const time = document.createElement('span');
      time.className = 'activity-time';
      time.textContent = activity.time;
      li.appendChild(time);
      
      const message = document.createElement('span');
      message.className = 'activity-message';
      message.textContent = activity.message;
      li.appendChild(message);
      
      activityList.appendChild(li);
    });
    
    activitySection.appendChild(activityList);
    container.appendChild(activitySection);
    
  } catch (error) {
    hideLoadingSpinner(spinner);
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load analytics. Please try again.';
    errorMessage.className = 'error-message';
    container.appendChild(errorMessage);
    
    console.error('Failed to fetch analytics:', error);
  }
  
  return container;
}

// Helper function to create stat cards
function createStatCard(label: string, value: string, change: string): HTMLElement {
  const card = document.createElement('div');
  card.className = 'stat-card';
  
  const labelElement = document.createElement('p');
  labelElement.className = 'stat-label';
  labelElement.textContent = label;
  card.appendChild(labelElement);
  
  const valueElement = document.createElement('h3');
  valueElement.className = 'stat-value';
  valueElement.textContent = value;
  card.appendChild(valueElement);
  
  const changeElement = document.createElement('p');
  changeElement.className = 'stat-change';
  changeElement.textContent = change;
  card.appendChild(changeElement);
  
  return card;
}