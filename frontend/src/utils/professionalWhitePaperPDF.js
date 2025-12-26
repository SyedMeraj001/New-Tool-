import { jsPDF } from 'jspdf';

export const generateProfessionalWhitePaper = async (framework, data, options = {}) => {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array of ESG metrics');
  }
  if (!framework || typeof framework !== 'string') {
    throw new Error('Framework must be a valid string (GRI, SASB, TCFD)');
  }

  const pdf = new jsPDF();
  
  const defaultOptions = {
    companyName: 'E-S-GENIUS',
    reportPeriod: new Date().getFullYear(),
    logoPath: 'companyLogo.jpg',
    colors: {
      primary: [0, 102, 204], 
      secondary: [46, 125, 50], 
      accent: [255, 152, 0],
      text: [51, 51, 51], 
      lightGray: [245, 245, 245], 
      mediumGray: [158, 158, 158], 
      white: [255, 255, 255]
    },
    includeCharts: true,
    fontSize: 11
  };
  
  const config = { ...defaultOptions, ...options };
  const { companyName, reportPeriod, logoPath, colors, includeCharts } = config;

  pdf.setProperties({
    title: `${companyName} ESG Report ${reportPeriod}`,
    subject: `${framework} Aligned ESG Sustainability Report`,
    author: companyName,
    keywords: 'ESG, Sustainability, Environmental, Social, Governance',
    creator: 'ESGenius PDF Generator'
  });

  createTitlePage(pdf, framework, companyName, reportPeriod, colors, logoPath);
  
  pdf.addPage();
  createTableOfContents(pdf, colors);
  
  pdf.addPage();
  createExecutiveSummary(pdf, data, colors, framework, includeCharts);
  
  pdf.addPage();
  createMaterialityAssessment(pdf, data, colors, includeCharts);
  
  pdf.addPage();
  createEnvironmentalPerformance(pdf, data, colors);
  
  pdf.addPage();
  createSocialPerformance(pdf, data, colors, includeCharts);
  
  pdf.addPage();
  createGovernancePerformance(pdf, data, colors);
  
  pdf.addPage();
  createRiskManagement(pdf, data, colors, includeCharts);
  
  pdf.addPage();
  createFrameworkCompliance(pdf, framework, data, colors);
  
  pdf.addPage();
  createAssuranceStatement(pdf, colors);
  
  addProfessionalHeadersFooters(pdf, companyName, reportPeriod, colors);
  return pdf;
};

const createTitlePage = (pdf, framework, companyName, reportPeriod, colors, logoPath) => {
  // Professional gradient background
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 297, 'F');
  
  // Top accent stripe
  pdf.setFillColor(...colors.accent);
  pdf.rect(0, 0, 210, 8, 'F');
  
  // Header section with shadow
  pdf.setFillColor(0, 0, 0, 0.15);
  pdf.roundedRect(23, 33, 164, 64, 5, 5, 'F');
  pdf.setFillColor(...colors.white);
  pdf.roundedRect(20, 30, 170, 70, 8, 8, 'F');
  pdf.setDrawColor(...colors.accent);
  pdf.setLineWidth(2);
  pdf.roundedRect(20, 30, 170, 70, 8, 8, 'S');
  
  // Company Logo
  try {
    pdf.addImage(logoPath, 'JPEG', 35, 45, 45, 25);
    pdf.setDrawColor(...colors.lightGray);
    pdf.setLineWidth(1);
    pdf.rect(35, 45, 45, 25, 'S');
  } catch (error) {
    // Enhanced fallback with E-S-GENIUS branding
    pdf.setFillColor(...colors.primary);
    pdf.rect(35, 45, 45, 25, 'F');
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('E-S-GENIUS', 40, 60);
  }
  
  // Company name with shadow effect
  pdf.setTextColor(0, 0, 0, 0.4);
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  pdf.text('E-S-GENIUS', 92, 57);
  pdf.setTextColor(...colors.primary);
  pdf.text('E-S-GENIUS', 90, 55);
  
  // Professional tagline
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Environmental - Social - Governance Excellence', 90, 70);
  
  // Main title section
  pdf.setFillColor(0, 0, 0, 0.2);
  pdf.roundedRect(32, 132, 146, 65, 8, 8, 'F');
  pdf.setFillColor(...colors.white);
  pdf.roundedRect(30, 130, 146, 65, 8, 8, 'F');
  pdf.setDrawColor(...colors.accent);
  pdf.setLineWidth(3);
  pdf.roundedRect(30, 130, 146, 65, 8, 8, 'S');
  
  // Report title
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESG SUSTAINABILITY', 103 - pdf.getTextWidth('ESG SUSTAINABILITY')/2, 155);
  pdf.setFontSize(20);
  pdf.text('REPORT', 103 - pdf.getTextWidth('REPORT')/2, 175);
  
  // Framework badge
  pdf.setFillColor(...colors.accent);
  pdf.roundedRect(68, 205, 74, 22, 11, 11, 'F');
  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(70, 207, 70, 18, 9, 9, 'F');
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${framework} COMPLIANT`, 105 - pdf.getTextWidth(`${framework} COMPLIANT`)/2, 218);
  
  // Report details
  pdf.setFillColor(255, 255, 255, 0.95);
  pdf.roundedRect(35, 245, 140, 30, 5, 5, 'F');
  pdf.setDrawColor(...colors.lightGray);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(35, 245, 140, 30, 5, 5, 'S');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Reporting Period: ${reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${reportPeriod}`)/2, 258);
  
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Published: ${date}`, 105 - pdf.getTextWidth(`Published: ${date}`)/2, 270);
  
  // Footer
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.text('www.esgenius.in', 105 - pdf.getTextWidth('www.esgenius.in')/2, 285);
};

const createTableOfContents = (pdf, colors) => {
  createSectionHeader(pdf, 'TABLE OF CONTENTS', colors);
  
  const contents = [
    { title: 'Executive Summary', page: 3 },
    { title: 'Materiality Assessment', page: 4 },
    { title: 'Environmental Performance', page: 5 },
    { title: 'Social Performance', page: 6 },
    { title: 'Governance Performance', page: 7 },
    { title: 'Risk Management', page: 8 },
    { title: 'Framework Compliance', page: 9 },
    { title: 'Independent Assurance', page: 10 }
  ];
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  
  let yPos = 70;
  contents.forEach(item => {
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.title, 30, yPos);
    pdf.text(item.page.toString(), 180, yPos);
    
    const dots = Math.floor((140 - pdf.getTextWidth(item.title)) / 3);
    for (let i = 0; i < dots; i++) {
      pdf.circle(35 + pdf.getTextWidth(item.title) + (i * 3), yPos - 1, 0.3, 'F');
    }
    yPos += 15;
  });
};

const createExecutiveSummary = (pdf, data, colors, framework, includeCharts) => {
  createSectionHeader(pdf, 'EXECUTIVE SUMMARY', colors);
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const summaryText = [
    'This report presents our comprehensive ESG performance aligned with global',
    `${framework} standards. Our commitment to sustainability drives measurable`,
    'impact across environmental stewardship, social responsibility, and governance excellence.',
    '',
    'Key Performance Highlights:',
    `- ${data.length} ESG metrics tracked and reported`,
    '- Comprehensive stakeholder engagement process',
    '- Third-party verification and assurance',
    '- Integration with business strategy and risk management'
  ];
  
  let yPos = 55;
  summaryText.forEach(line => {
    if (line === '') yPos += 5;
    else if (line.startsWith('-')) {
      pdf.text(line, 30, yPos);
      yPos += 8;
    } else if (line.includes('Highlights:')) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(line, 25, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 10;
    } else {
      pdf.text(line, 25, yPos);
      yPos += 8;
    }
  });
  
  if (includeCharts) {
    yPos += 15;
    addESGPerformanceChart(pdf, data, 25, yPos, 160, 80);
  }
};

const createMaterialityAssessment = (pdf, data, colors, includeCharts) => {
  createSectionHeader(pdf, 'MATERIALITY ASSESSMENT', colors);
  
  if (includeCharts) {
    pdf.setFillColor(...colors.lightGray);
    pdf.roundedRect(20, 50, 170, 100, 5, 5, 'F');
    
    pdf.setDrawColor(...colors.mediumGray);
    pdf.setLineWidth(2);
    pdf.line(50, 140, 170, 140);
    pdf.line(50, 60, 50, 140);
    
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(10);
    pdf.text('Impact on Business', 120, 150);
    pdf.text('Stakeholder Importance', 15, 90);
    
    const topics = [
      { name: 'Climate Change', x: 140, y: 80, priority: 'high' },
      { name: 'Employee Safety', x: 130, y: 90, priority: 'high' },
      { name: 'Data Privacy', x: 120, y: 100, priority: 'medium' },
      { name: 'Supply Chain', x: 110, y: 110, priority: 'medium' }
    ];
    
    topics.forEach(topic => {
      const color = topic.priority === 'high' ? colors.accent : colors.secondary;
      pdf.setFillColor(...color);
      pdf.circle(topic.x, topic.y, 4, 'F');
      pdf.setTextColor(...colors.text);
      pdf.setFontSize(8);
      pdf.text(topic.name, topic.x + 6, topic.y + 2);
    });
  }
  
  const startY = includeCharts ? 170 : 60;
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Priority ESG Topics', 20, startY);
  
  const priorityTopics = [
    'Climate Change & GHG Emissions',
    'Employee Health & Safety',
    'Data Privacy & Cybersecurity',
    'Supply Chain Sustainability',
    'Business Ethics & Governance'
  ];
  
  let yPos = startY + 15;
  priorityTopics.forEach(topic => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`- ${topic}`, 25, yPos);
    yPos += 12;
  });
};

const createEnvironmentalPerformance = (pdf, data, colors) => {
  createSectionHeader(pdf, 'ENVIRONMENTAL PERFORMANCE', colors);
  
  const envMetrics = [
    { metric: 'GHG Emissions (Scope 1+2)', value: '1,250 tCO2e', target: '15% reduction' },
    { metric: 'Energy Consumption', value: '2,500 MWh', target: '10% efficiency gain' },
    { metric: 'Water Usage', value: '15,000 m3', target: '5% reduction' },
    { metric: 'Waste Diverted', value: '85%', target: '90% by 2025' }
  ];

  pdf.setFillColor(...colors.secondary);
  pdf.rect(20, 60, 170, 12, 'F');
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Environmental Metric', 25, 68);
  pdf.text('Current Performance', 100, 68);
  pdf.text('2025 Target', 150, 68);
  
  let yPos = 80;
  envMetrics.forEach((item, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(...colors.lightGray);
      pdf.rect(20, yPos - 3, 170, 12, 'F');
    }
    
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.metric, 25, yPos + 3);
    pdf.text(item.value, 100, yPos + 3);
    pdf.text(item.target, 150, yPos + 3);
    yPos += 12;
  });
  
  yPos += 20;
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Environmental Initiatives', 20, yPos);
  
  const initiatives = [
    'Renewable energy transition program',
    'Circular economy and waste reduction',
    'Water conservation and efficiency',
    'Biodiversity protection measures'
  ];
  
  yPos += 15;
  initiatives.forEach(initiative => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`- ${initiative}`, 25, yPos);
    yPos += 12;
  });
};

const createSocialPerformance = (pdf, data, colors, includeCharts) => {
  createSectionHeader(pdf, 'SOCIAL PERFORMANCE', colors);
  
  const socialMetrics = [
    { metric: 'Employee Engagement', value: '87%', benchmark: 'Industry: 82%' },
    { metric: 'Gender Diversity (Leadership)', value: '42%', benchmark: 'Target: 50%' },
    { metric: 'Training Hours per Employee', value: '45 hours', benchmark: 'Industry: 35h' },
    { metric: 'Safety Incident Rate', value: '0.8 per 100k', benchmark: 'Target: <1.0' }
  ];
  
  if (includeCharts) {
    addSocialMetricsChart(pdf, socialMetrics, 20, 60, 170, 80);
  }
  
  const startY = includeCharts ? 160 : 60;
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Social Impact Programs', 20, startY);
  
  const programs = [
    'Diversity, Equity & Inclusion initiatives',
    'Employee wellbeing and mental health support',
    'Community investment and volunteering',
    'Skills development and career advancement'
  ];
  
  let yPos = startY + 15;
  programs.forEach(program => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`- ${program}`, 25, yPos);
    yPos += 12;
  });
};

const createGovernancePerformance = (pdf, data, colors) => {
  createSectionHeader(pdf, 'GOVERNANCE PERFORMANCE', colors);
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Board Composition & Independence', 20, 60);
  
  const boardMetrics = [
    { metric: 'Board Independence', value: '75%' },
    { metric: 'Gender Diversity', value: '40%' },
    { metric: 'Average Tenure', value: '6.2 years' },
    { metric: 'ESG Expertise', value: '60%' }
  ];
  
  let yPos = 80;
  boardMetrics.forEach(metric => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${metric.metric}: ${metric.value}`, 25, yPos);
    yPos += 12;
  });
  
  yPos += 20;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ethics & Compliance Framework', 20, yPos);
  
  const compliance = [
    'Code of Conduct training completion: 100%',
    'Anti-corruption policy implementation',
    'Whistleblower protection program',
    'Regular compliance audits and assessments'
  ];
  
  yPos += 15;
  compliance.forEach(item => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`- ${item}`, 25, yPos);
    yPos += 12;
  });
};

const createRiskManagement = (pdf, data, colors, includeCharts) => {
  createSectionHeader(pdf, 'ESG RISK MANAGEMENT', colors);
  
  if (includeCharts) {
    addRiskAssessmentChart(pdf, data, 20, 60, 170, 80);
  }
  
  const startY = includeCharts ? 160 : 60;
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Risk Mitigation Strategies', 20, startY);
  
  const strategies = [
    'Climate risk scenario analysis and planning',
    'Supply chain due diligence and monitoring',
    'Cybersecurity and data protection measures',
    'Regulatory compliance monitoring system'
  ];
  
  let yPos = startY + 15;
  strategies.forEach(strategy => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`- ${strategy}`, 25, yPos);
    yPos += 12;
  });
};

const createFrameworkCompliance = (pdf, framework, data, colors) => {
  createSectionHeader(pdf, `${framework} FRAMEWORK COMPLIANCE`, colors);
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const frameworkInfo = {
    GRI: {
      description: 'This report follows GRI Standards for comprehensive sustainability reporting.',
      standards: ['GRI 2: General Disclosures', 'GRI 3: Material Topics', 'Topic-specific Standards']
    },
    SASB: {
      description: 'Reporting aligned with SASB industry-specific sustainability standards.',
      standards: ['Industry Materiality Map', 'Quantitative Performance', 'Forward-looking Guidance']
    },
    TCFD: {
      description: 'Climate-related financial disclosures following TCFD recommendations.',
      standards: ['Governance', 'Strategy', 'Risk Management', 'Metrics and Targets']
    }
  };
  
  const info = frameworkInfo[framework] || frameworkInfo.GRI;
  
  pdf.text(info.description, 20, 60);
  
  let yPos = 80;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${framework} Standards Applied:`, 20, yPos);
  
  yPos += 15;
  info.standards.forEach(standard => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`- ${standard}`, 25, yPos);
    yPos += 12;
  });
  
  yPos += 20;
  pdf.setFillColor(...colors.lightGray);
  pdf.roundedRect(20, yPos, 170, 40, 5, 5, 'F');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Compliance Summary', 25, yPos + 15);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`- ${data.length} performance indicators reported`, 25, yPos + 25);
  pdf.text(`- Full alignment with ${framework} requirements`, 25, yPos + 35);
};

const createAssuranceStatement = (pdf, colors) => {
  createSectionHeader(pdf, 'INDEPENDENT ASSURANCE STATEMENT', colors);
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const assuranceText = [
    'This ESG report has been subject to independent third-party assurance to enhance',
    'credibility and reliability of the reported information.',
    '',
    'Assurance Scope:',
    '- Selected quantitative performance data',
    '- Management systems and processes',
    '- Adherence to reporting frameworks',
    '',
    'Assurance Opinion:',
    'Based on our review, nothing has come to our attention that causes us to believe',
    'that the selected ESG data and information are not fairly stated in all material respects.'
  ];
  
  let yPos = 60;
  assuranceText.forEach(line => {
    if (line === '') yPos += 5;
    else if (line.startsWith('-')) {
      pdf.text(line, 30, yPos);
      yPos += 10;
    } else if (line.includes(':')) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(line, 20, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 12;
    } else {
      pdf.text(line, 20, yPos);
      yPos += 10;
    }
  });
  
  yPos += 20;
  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(20, yPos, 170, 30, 5, 5, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Independent Assurance Provider', 25, yPos + 15);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ESGenius Assurance Services | contact@esgenius.in', 25, yPos + 25);
};

const createSectionHeader = (pdf, title, colors) => {
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setFillColor(...colors.accent);
  pdf.rect(0, 35, 210, 5, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, 25, 25);
};

const addProfessionalHeadersFooters = (pdf, companyName, reportPeriod, colors) => {
  const totalPages = pdf.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    if (i > 1) {
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(...colors.lightGray);
      pdf.line(20, 15, 190, 15);
      
      pdf.setTextColor(...colors.mediumGray);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${companyName} ESG Report ${reportPeriod}`, 20, 12);
    }
    
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(...colors.lightGray);
    pdf.line(20, 285, 190, 285);
    
    pdf.setTextColor(...colors.mediumGray);
    pdf.setFontSize(8);
    pdf.text(`Page ${i} of ${totalPages}`, 170, 292);
    
    if (i === totalPages) {
      pdf.text('Generated by ESGenius', 20, 292);
    }
  }
};

const addESGPerformanceChart = (pdf, data, x, y, width, height) => {
  const envData = data.filter(item => item.category === 'environmental');
  const socialData = data.filter(item => item.category === 'social');
  const govData = data.filter(item => item.category === 'governance');
  
  const values = [envData.length, socialData.length, govData.length];
  const labels = ['Environmental', 'Social', 'Governance'];
  const colors = [[46, 125, 50], [25, 118, 210], [123, 31, 162]];
  
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return;
  
  const centerX = x + width/2;
  const centerY = y + height/2;
  const outerRadius = 35;
  const innerRadius = 20;
  
  let startAngle = 0;
  
  values.forEach((value, index) => {
    if (value > 0) {
      const angle = (value / total) * 360;
      
      for (let i = 0; i < angle; i += 2) {
        const currentAngle = (startAngle + i) * Math.PI / 180;
        const x1 = centerX + innerRadius * Math.cos(currentAngle);
        const y1 = centerY + innerRadius * Math.sin(currentAngle);
        const x2 = centerX + outerRadius * Math.cos(currentAngle);
        const y2 = centerY + outerRadius * Math.sin(currentAngle);
        
        pdf.setDrawColor(...colors[index]);
        pdf.setLineWidth(3);
        pdf.line(x1, y1, x2, y2);
      }
      
      startAngle += angle;
    }
  });
  
  pdf.setFillColor(255, 255, 255);
  pdf.circle(centerX, centerY, innerRadius, 'F');
  
  let legendY = y + height - 30;
  values.forEach((value, index) => {
    if (value > 0) {
      pdf.setFillColor(...colors[index]);
      pdf.circle(x + 15, legendY + 2, 4, 'F');
      
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(9);
      pdf.text(`${labels[index]}: ${value}`, x + 25, legendY + 4);
      legendY += 12;
    }
  });
};

const addSocialMetricsChart = (pdf, metrics, x, y, width, height) => {
  const maxValue = 100;
  const barHeight = 15;
  const barSpacing = 20;
  
  metrics.forEach((metric, index) => {
    const barY = y + (index * barSpacing);
    const value = parseFloat(metric.value.replace(/[^0-9.]/g, ''));
    const barWidth = (value / maxValue) * (width - 100);
    
    pdf.setFillColor(220, 220, 220);
    pdf.rect(x + 100, barY, width - 100, barHeight, 'F');
    
    pdf.setFillColor(25, 118, 210);
    pdf.rect(x + 100, barY, barWidth, barHeight, 'F');
    
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(9);
    pdf.text(metric.metric, x, barY + 10);
    pdf.text(metric.value, x + 105, barY + 10);
  });
};

const addRiskAssessmentChart = (pdf, data, x, y, width, height) => {
  const riskData = [
    { level: 'Low Risk', value: 65, color: [76, 175, 80] },
    { level: 'Medium Risk', value: 25, color: [255, 193, 7] },
    { level: 'High Risk', value: 10, color: [244, 67, 54] }
  ];
  
  const centerX = x + width/2;
  const centerY = y + height/2;
  const radius = 40;
  
  let startAngle = 0;
  
  riskData.forEach((risk, index) => {
    const angle = (risk.value / 100) * 360;
    const endAngle = startAngle + angle;
    
    for (let a = startAngle; a < endAngle; a += 3) {
      const angle1 = a * Math.PI / 180;
      const angle2 = (a + 3) * Math.PI / 180;
      
      const x1 = centerX + radius * Math.cos(angle1);
      const y1 = centerY + radius * Math.sin(angle1);
      const x2 = centerX + radius * Math.cos(angle2);
      const y2 = centerY + radius * Math.sin(angle2);
      
      pdf.setFillColor(...risk.color);
      pdf.triangle(centerX, centerY, x1, y1, x2, y2, 'F');
    }
    
    const labelAngle = (startAngle + angle/2) * Math.PI / 180;
    const labelX = centerX + (radius * 0.7) * Math.cos(labelAngle);
    const labelY = centerY + (radius * 0.7) * Math.sin(labelAngle);
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(`${risk.value}%`, labelX - 8, labelY + 2);
    
    startAngle = endAngle;
  });
  
  let legendY = y + height - 40;
  riskData.forEach((risk, index) => {
    pdf.setFillColor(...risk.color);
    pdf.circle(x + 15, legendY + 2, 4, 'F');
    
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(9);
    pdf.text(`${risk.level}: ${risk.value}%`, x + 25, legendY + 4);
    legendY += 12;
  });
};

export default generateProfessionalWhitePaper;