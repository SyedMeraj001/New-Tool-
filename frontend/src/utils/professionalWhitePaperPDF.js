import jsPDF from 'jspdf';
import { Chart } from 'chart.js/auto';

/**
 * Professional ESG White Paper Generator
 * Based on Lingaro Group ESG Reporting Best Practices format
 */
export const generateProfessionalWhitePaper = async (framework, data, options = {}) => {
  // Ensure data is always an array
  if (!Array.isArray(data)) {
    data = [];
  }
  
  const pdf = new jsPDF();
  const {
    companyName = 'E-S-GENIUS',
    reportPeriod = new Date().getFullYear(),
    authorName = 'ESG Team',
    authorTitle = 'Sustainability Director',
    sector = 'General',
    region = 'Global',
    logoPath = null
  } = options;

  // Professional color scheme matching Lingaro format
  const colors = {
    primary: [0, 102, 204],        // Professional Blue
    secondary: [46, 125, 50],      // ESG Green
    accent: [255, 152, 0],         // Orange Accent
    text: [51, 51, 51],            // Dark Gray
    lightGray: [245, 245, 245],    // Light Background
    mediumGray: [158, 158, 158],   // Medium Gray
    white: [255, 255, 255],        // White
    darkBlue: [25, 118, 210]       // Dark Blue
  };

  let currentPage = 1;
  
  // Create title page
  createTitlePage(pdf, framework, data, companyName, reportPeriod, authorName, authorTitle, colors, logoPath);
  
  // Add content pages
  pdf.addPage();
  currentPage++;
  await createExecutiveSummary(pdf, data, colors, options, framework);
  
  pdf.addPage();
  currentPage++;
  await createESGFrameworkSection(pdf, data, colors);
  
  pdf.addPage();
  currentPage++;
  createMaterialitySection(pdf, data, colors);
  
  pdf.addPage();
  currentPage++;
  await createPerformanceAnalysis(pdf, data, colors);
  
  pdf.addPage();
  currentPage++;
  await createDataAnalyticsSection(pdf, data, colors);
  
  pdf.addPage();
  currentPage++;
  createReferencesAndContact(pdf, colors, options);
  
  // Add professional headers and footers
  const totalPages = 6; // Title + 5 content pages
  addProfessionalHeadersFooters(pdf, totalPages, companyName, reportPeriod, colors);
  
  return pdf;
};

const createTitlePage = (pdf, framework, data, companyName, reportPeriod, authorName, authorTitle, colors, logoPath) => {
  // Try to add actual ESG logo image if available
  try {
    if (logoPath) {
      pdf.addImage(logoPath, 'PNG', 45, 60, 120, 60);
    } else {
      throw new Error('No logo path provided');
    }
  } catch (error) {
    // Fallback to E-S-Genius logo design
    const logoX = 105;
    const logoY = 90;
    
    pdf.setFillColor(46, 125, 50);
    pdf.circle(logoX - 50, logoY, 25, 'F');
    pdf.setFillColor(255, 255, 255);
    pdf.circle(logoX - 50, logoY, 20, 'F');
    pdf.setFillColor(46, 125, 50);
    pdf.ellipse(logoX - 55, logoY - 5, 8, 4, 'F');
    pdf.setFillColor(25, 118, 210);
    pdf.rect(logoX - 45, logoY - 8, 4, 12, 'F');
    pdf.rect(logoX - 38, logoY - 12, 4, 16, 'F');
    pdf.rect(logoX - 31, logoY - 6, 4, 10, 'F');
    pdf.setTextColor(46, 125, 50);
    pdf.setFontSize(48);
    pdf.setFont('helvetica', 'bold');
    pdf.text('E-S-Genius', logoX - 15, logoY - 10);
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Tech Solutions', logoX - 15, logoY + 15);
  }
  
  // ESG Report title
  pdf.setTextColor(51, 51, 51);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESG SUSTAINABILITY REPORT', 105 - pdf.getTextWidth('ESG SUSTAINABILITY REPORT')/2, 160);
  
  // Framework badge
  pdf.setFillColor(46, 125, 50);
  pdf.roundedRect(75, 180, 60, 15, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${framework} COMPLIANT`, 105 - pdf.getTextWidth(`${framework} COMPLIANT`)/2, 190);
  
  // Report period
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Reporting Period: ${reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${reportPeriod}`)/2, 210);
  
  // Publication date
  const pubDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(`Published: ${pubDate}`, 105 - pdf.getTextWidth(`Published: ${pubDate}`)/2, 225);
};

const createExecutiveSummary = async (pdf, data, colors, options, framework) => {
  // Section header
  createSectionHeader(pdf, 'EXECUTIVE SUMMARY', colors);
  
  // Professional opening paragraph
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setLineHeightFactor(1.4);
  
  const summaryText = [
    'ESG reporting involves the disclosure of a company\'s performance in environmental, social,',
    'and governance aspects and allows stakeholders to assess its sustainability efforts. The rising',
    'importance of ESG reporting for companies is a direct response to the increasing demand from',
    'stakeholders and consumers for greater transparency and accountability in business practices.',
    '',
    `This comprehensive ESG report presents ${options.companyName || 'our organization'}\'s`,
    `environmental, social, and governance performance for ${options.reportPeriod || new Date().getFullYear()}.`,
    'Our commitment to sustainable business practices drives measurable impact across all ESG pillars.'
  ];
  
  let yPos = 55;
  summaryText.forEach(line => {
    if (line === '') {
      yPos += 5;
    } else {
      pdf.text(line, 25, yPos);
      yPos += 8;
    }
  });
  
  // Add ESG Performance Chart
  yPos += 15;
  await addESGPerformanceChart(pdf, data, 25, yPos, 160, 80);
  yPos += 90;
  
  // Key achievements section
  pdf.setFillColor(248, 249, 250);
  pdf.roundedRect(25, yPos, 160, 55, 5, 5, 'F');
  pdf.setDrawColor(...colors.lightGray);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(25, yPos, 160, 55, 5, 5, 'S');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESG PERFORMANCE HIGHLIGHTS', 30, yPos + 15);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const achievements = [
    `Comprehensive tracking of ${data.length} ESG performance indicators`,
    `${framework} framework compliance and reporting standards alignment`,
    'Data-driven sustainability strategy implementation and monitoring',
    'Stakeholder engagement and materiality assessment completion'
  ];
  
  let achievementY = yPos + 25;
  achievements.forEach(achievement => {
    pdf.setTextColor(...colors.text);
    pdf.text(`• ${achievement}`, 30, achievementY);
    achievementY += 8;
  });
};

const createESGFrameworkSection = async (pdf, data, colors) => {
  createSectionHeader(pdf, 'ESG FRAMEWORK & METHODOLOGY', colors);
  
  // Add Category Distribution Chart
  await addCategoryDistributionChart(pdf, data, 20, 50, 170, 80);
  
  // Methodology section
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Our ESG Approach', 20, 150);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const methodology = [
    '1. Stakeholder Identification & Engagement',
    '   • Internal and external stakeholder mapping',
    '   • Regular consultation and feedback collection',
    '',
    '2. Materiality Assessment',
    '   • Double materiality analysis implementation',
    '   • Risk and opportunity identification',
    '',
    '3. Metrics & KPI Definition',
    '   • Industry-specific indicator selection',
    '   • Baseline establishment and target setting',
    '',
    '4. Data Collection & Management',
    '   • Systematic data gathering processes',
    '   • Quality assurance and verification protocols'
  ];
  
  let yPos = 165;
  methodology.forEach(line => {
    if (line.match(/^\d+\./)) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(line, 20, yPos);
      pdf.setFont('helvetica', 'normal');
    } else if (line.startsWith('   •')) {
      pdf.text(line, 25, yPos);
    } else {
      pdf.text(line, 20, yPos);
    }
    yPos += 7;
  });
};

const createMaterialitySection = (pdf, data, colors) => {
  createSectionHeader(pdf, 'MATERIALITY ASSESSMENT', colors);
  
  // Double materiality diagram
  pdf.setFillColor(...colors.lightGray);
  pdf.roundedRect(20, 50, 170, 70, 5, 5, 'F');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Figure 2: Double Materiality Matrix', 25, 65);
  
  // Matrix axes
  pdf.setLineWidth(1);
  pdf.setDrawColor(...colors.mediumGray);
  pdf.line(50, 110, 150, 110); // X-axis
  pdf.line(100, 80, 100, 110); // Y-axis
  
  pdf.setFontSize(8);
  pdf.text('Financial Impact →', 120, 115);
  pdf.text('Impact on', 55, 85);
  pdf.text('Society/Environment', 55, 90);
  
  // Material topics
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Material ESG Topics', 20, 140);
  
  const materialTopics = {
    'High Priority': [
      'Climate Change & GHG Emissions',
      'Energy Management & Efficiency',
      'Employee Health & Safety',
      'Data Privacy & Cybersecurity',
      'Business Ethics & Anti-Corruption'
    ],
    'Medium Priority': [
      'Water Resource Management',
      'Waste Management & Circular Economy',
      'Diversity, Equity & Inclusion',
      'Supply Chain Sustainability',
      'Community Relations & Investment'
    ]
  };
  
  let yPos = 155;
  Object.entries(materialTopics).forEach(([priority, topics]) => {
    const priorityColor = priority === 'High Priority' ? colors.accent : colors.primary;
    
    pdf.setFillColor(...priorityColor);
    pdf.roundedRect(20, yPos - 3, 170, 10, 2, 2, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(priority.toUpperCase(), 25, yPos + 3);
    
    yPos += 15;
    
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    
    topics.forEach(topic => {
      pdf.text(`• ${topic}`, 25, yPos);
      yPos += 7;
    });
    
    yPos += 5;
  });
};

const createPerformanceAnalysis = async (pdf, data, colors) => {
  createSectionHeader(pdf, 'PERFORMANCE ANALYSIS & RESULTS', colors);
  
  // Add Performance Trends Chart
  await addPerformanceTrendsChart(pdf, data, 20, 50, 170, 80);
  
  // Performance summary table
  const categories = ['Environmental', 'Social', 'Governance'];
  const categoryData = categories.map(cat => {
    const catData = data.filter(item => item.category === cat.toLowerCase());
    return {
      category: cat,
      metrics: catData.length,
      coverage: catData.length > 0 ? 'Complete' : 'In Progress',
      trend: catData.length > 5 ? 'Improving' : 'Stable'
    };
  });
  
  // Table header
  pdf.setFillColor(...colors.primary);
  pdf.rect(20, 140, 170, 12, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Category', 25, 148);
  pdf.text('Metrics', 80, 148);
  pdf.text('Coverage', 120, 148);
  pdf.text('Trend', 160, 148);
  
  // Table rows
  let yPos = 155;
  categoryData.forEach((row, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(...colors.lightGray);
      pdf.rect(20, yPos - 3, 170, 10, 'F');
    }
    
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(row.category, 25, yPos + 2);
    pdf.text(row.metrics.toString(), 80, yPos + 2);
    pdf.text(row.coverage, 120, yPos + 2);
    
    // Trend with color
    const trendColor = row.trend === 'Improving' ? colors.secondary : colors.mediumGray;
    pdf.setTextColor(...trendColor);
    pdf.text(row.trend, 160, yPos + 2);
    
    yPos += 10;
  });
  
  // Key insights
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Performance Insights', 20, 210);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const insights = [
    `• Comprehensive ESG data collection across ${data.length} key performance indicators`,
    '• Strong performance in governance metrics with full transparency implementation',
    '• Environmental initiatives showing measurable impact on carbon footprint reduction',
    '• Social programs demonstrating positive community and workforce outcomes',
    '• Continuous improvement processes established for all ESG categories'
  ];
  
  yPos = 225;
  insights.forEach(insight => {
    pdf.text(insight, 25, yPos);
    yPos += 10;
  });
  
  // Call-out box
  pdf.setFillColor(...colors.secondary);
  pdf.roundedRect(20, 190, 170, 40, 5, 5, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SUSTAINABILITY COMMITMENT', 25, 205);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Our data-driven approach to ESG management enables continuous improvement', 25, 218);
  pdf.text('and demonstrates our commitment to creating long-term sustainable value.', 25, 225);
};

const createDataAnalyticsSection = async (pdf, data, colors) => {
  createSectionHeader(pdf, 'THE ROLE OF DATA & ANALYTICS', colors);
  
  // Add Risk Assessment Chart
  await addRiskAssessmentChart(pdf, data, 20, 50, 170, 80);
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const analyticsText = [
    'Advanced analytics and data management are fundamental to credible ESG reporting.',
    'Our comprehensive approach ensures data accuracy, consistency, and transparency.',
    '',
    'Data Collection & Management:',
    'Automated data collection systems for real-time monitoring',
    'Standardized measurement protocols across all business units',
    'Regular data quality audits and validation processes',
    'Secure data storage with full audit trail capabilities',
    '',
    'Analytics & Insights:',
    'Trend analysis and performance benchmarking',
    'Predictive modeling for target achievement',
    'Risk assessment and scenario planning',
    'Stakeholder impact analysis and reporting'
  ];
  
  let yPos = 140;
  analyticsText.forEach(line => {
    if (line.endsWith(':')) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(line, 20, yPos);
      pdf.setFont('helvetica', 'normal');
    } else if (line.startsWith('•')) {
      pdf.text(line, 25, yPos);
    } else {
      pdf.text(line, 20, yPos);
    }
    yPos += 8;
  });
  
  // Technology stack box
  pdf.setFillColor(...colors.lightGray);
  pdf.roundedRect(20, 240, 170, 60, 5, 5, 'F');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESG TECHNOLOGY STACK', 25, 255);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const techStack = [
    'ESGenius Platform - Comprehensive ESG data management and reporting',
    'Automated data collection and validation systems',
    'Advanced analytics and visualization tools',
    'Framework compliance monitoring and reporting',
    'Stakeholder engagement and communication platforms'
  ];
  
  yPos = 265;
  techStack.forEach(item => {
    pdf.text(`• ${item}`, 25, yPos);
    yPos += 8;
  });
};

const createReferencesAndContact = (pdf, colors, options) => {
  createSectionHeader(pdf, 'REFERENCES & CONTACT', colors);
  
  // References section
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('References', 20, 50);
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  const references = [
    '1. Global Reporting Initiative (GRI). "GRI Standards." https://www.globalreporting.org',
    '2. Sustainability Accounting Standards Board (SASB). "SASB Standards." https://www.sasb.org',
    '3. Task Force on Climate-related Financial Disclosures (TCFD). "TCFD Recommendations." https://www.fsb-tcfd.org',
    '4. European Commission. "Corporate Sustainability Reporting Directive." https://ec.europa.eu',
    '5. McKinsey & Company. "The ESG premium: New perspectives on value and performance." 2020.',
    '6. Harvard Business Review. "The Investor Revolution." January-February 2020.',
    '7. Forbes. "ESG Investing: What You Need To Know." https://www.forbes.com',
    '8. Deloitte. "ESG reporting: Navigating the evolving landscape." 2021.'
  ];
  
  let yPos = 65;
  references.forEach(ref => {
    pdf.text(ref, 20, yPos);
    yPos += 10;
  });
  
  // Enhanced Contact section with modern design
  // Main contact card with gradient effect
  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(20, 170, 170, 80, 8, 8, 'F');
  
  // Accent stripe
  pdf.setFillColor(...colors.accent);
  pdf.roundedRect(20, 170, 170, 8, 8, 8, 'F');
  pdf.rect(20, 174, 170, 4, 'F');
  
  // Contact header
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONTACT INFORMATION', 30, 190);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('For more information about this report or our ESG initiatives:', 30, 205);
  
  // Contact details
  const contactDetails = [
    { label: 'Email:', value: 'contact@esgeniustechsolutions@gmail.com', y: 220 },
    { label: 'Website:', value: 'www.esgenius.in', y: 230 },
    { label: 'Phone:', value: '+91 080 4165 3016', y: 240 }
  ];
  
  pdf.setFontSize(9);
  contactDetails.forEach(contact => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(contact.label, 30, contact.y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(contact.value, 70, contact.y);
  });
  
  
  // Social media section
  pdf.setFillColor(...colors.lightGray);
  pdf.roundedRect(20, 255, 170, 20, 5, 5, 'F');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Follow Us:', 25, 267);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('LinkedIn: ESGenius Tech Solutions', 70, 267);
  pdf.text('Twitter: @ESGeniusTech', 140, 267);
  
  // Footer disclaimer with better formatting
  pdf.setTextColor(...colors.mediumGray);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.text('This report contains forward-looking statements. Actual results may differ from projections.', 20, 285);
  pdf.text(`© ${new Date().getFullYear()} ESGenius Tech Solutions. All rights reserved. | Confidential & Proprietary`, 20, 292);
};

// Helper functions
const createSectionHeader = (pdf, title, colors) => {
  // Professional header with gradient background
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 40, 'F');
  
  // Header accent line
  pdf.setFillColor(...colors.accent);
  pdf.rect(0, 35, 210, 5, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, 25, 25);
  
  // Add subtle shadow effect
  pdf.setFillColor(0, 0, 0, 0.1);
  pdf.rect(0, 40, 210, 2, 'F');
};

const addProfessionalHeadersFooters = (pdf, totalPages, companyName, reportPeriod, colors) => {
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    if (i > 1) { // Skip header on title page
      // Header line
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(...colors.lightGray);
      pdf.line(20, 15, 190, 15);
      
      // Company name in header
      pdf.setTextColor(...colors.mediumGray);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${companyName} - E-S-GENIUS  ${reportPeriod}`, 20, 12);
    }
    
    // Footer
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(...colors.lightGray);
    pdf.line(20, 285, 190, 285);
    
    pdf.setTextColor(...colors.mediumGray);
    pdf.setFontSize(8);
    pdf.text(`Page ${i} of ${totalPages}`, 170, 292);
    
    if (i === totalPages) {
      pdf.text('Generated by ESGenius ', 20, 292);
    }
  }
};

// Chart generation functions
const addESGPerformanceChart = async (pdf, data, x, y, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  const envData = data.filter(item => item.category === 'environmental');
  const socialData = data.filter(item => item.category === 'social');
  const govData = data.filter(item => item.category === 'governance');
  
  const chartData = {
    labels: ['Environmental', 'Social', 'Governance'],
    datasets: [{
      data: [envData.length, socialData.length, govData.length],
      backgroundColor: ['#2e7d32', '#1976d2', '#7b1fa2'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
  
  const chart = new Chart(ctx, {
    type: 'pie',
    data: chartData,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12 } }
        }
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 100));
  const imageData = canvas.toDataURL('image/png');
  pdf.addImage(imageData, 'PNG', x, y, width, height);
  chart.destroy();
};

const addCategoryDistributionChart = async (pdf, data, x, y, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  const categoryCount = { environmental: 0, social: 0, governance: 0 };
  data.forEach(item => {
    if (categoryCount[item.category] !== undefined) {
      categoryCount[item.category]++;
    }
  });
  
  const chartData = {
    labels: ['Environmental', 'Social', 'Governance'],
    datasets: [{
      label: 'Data Points',
      data: [categoryCount.environmental, categoryCount.social, categoryCount.governance],
      backgroundColor: ['#2e7d32', '#1976d2', '#7b1fa2'],
      borderWidth: 1
    }]
  };
  
  const chart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: false,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 100));
  const imageData = canvas.toDataURL('image/png');
  pdf.addImage(imageData, 'PNG', x, y, width, height);
  chart.destroy();
};

const addPerformanceTrendsChart = async (pdf, data, x, y, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  const yearlyData = {};
  data.forEach(item => {
    const year = new Date(item.timestamp || Date.now()).getFullYear();
    if (!yearlyData[year]) yearlyData[year] = 0;
    yearlyData[year]++;
  });
  
  const years = Object.keys(yearlyData).sort();
  const values = years.map(year => yearlyData[year]);
  
  const chartData = {
    labels: years,
    datasets: [{
      label: 'ESG Data Points',
      data: values,
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 100));
  const imageData = canvas.toDataURL('image/png');
  pdf.addImage(imageData, 'PNG', x, y, width, height);
  chart.destroy();
};

const addRiskAssessmentChart = async (pdf, data, x, y, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  const riskLevels = {
    high: data.filter(item => item.category === 'environmental').length < 5 ? 3 : 1,
    medium: data.filter(item => item.category === 'social').length < 5 ? 2 : 1,
    low: data.filter(item => item.category === 'governance').length >= 5 ? 4 : 2
  };
  
  const chartData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [{
      data: [riskLevels.high, riskLevels.medium, riskLevels.low],
      backgroundColor: ['#d32f2f', '#f57c00', '#388e3c'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
  
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12 } }
        }
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 100));
  const imageData = canvas.toDataURL('image/png');
  pdf.addImage(imageData, 'PNG', x, y, width, height);
  chart.destroy();
};

export default generateProfessionalWhitePaper;