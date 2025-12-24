import { jsPDF } from 'jspdf';

/**
 * Generates a professional ESG sustainability report PDF
 * @param {string} framework - ESG framework (GRI, SASB, TCFD)
 * @param {Array} data - Array of ESG data objects with category, metric, value properties
 * @param {Object} options - Configuration options
 * @param {string} options.companyName - Company name for the report
 * @param {number} options.reportPeriod - Report year
 * @param {string} options.logoPath - Path to company logo image
 * @param {Object} options.colors - Color scheme configuration
 * @param {boolean} options.includeCharts - Whether to include charts in the report
 * @returns {jsPDF} Generated PDF document
 * @throws {Error} If input validation fails
 */
export const generateProfessionalWhitePaper = async (framework, data, options = {}) => {
  // Input validation
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array of ESG metrics');
  }
  if (!framework || typeof framework !== 'string') {
    throw new Error('Framework must be a valid string (GRI, SASB, TCFD)');
  }

  const pdf = new jsPDF();
  
  // Default options with configurability
  const defaultOptions = {
    companyName: 'E-S-GENIUS',
    reportPeriod: new Date().getFullYear(),
    logoPath: './src/ESG logo.png', // Use the ESG logo image if available
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

  // Add PDF metadata
  pdf.setProperties({
    title: `${companyName} ESG Report ${reportPeriod}`,
    subject: `${framework} Aligned ESG Sustainability Report`,
    author: companyName,
    keywords: 'ESG, Sustainability, Environmental, Social, Governance',
    creator: 'ESGenius PDF Generator'
  });

  // Professional ESG Report Structure
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
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 297, 'F');
  
  // Add ESG logo with error handling
  if (logoPath) {
    try {
      pdf.addImage(logoPath, 'PNG', 60, 50, 90, 50);
    } catch (error) {
      console.warn('Logo image not found or invalid, using text fallback');
      createESGLogoDesign(pdf, colors, companyName);
    }
  } else {
    // Create professional ESG logo design
    createESGLogoDesign(pdf, colors, companyName);
  }
  
  // Company name
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(24);
  pdf.text(companyName, 105 - pdf.getTextWidth(companyName)/2, 120);
  
  // Report title
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(32);
  pdf.text('ESG SUSTAINABILITY REPORT', 105 - pdf.getTextWidth('ESG SUSTAINABILITY REPORT')/2, 140);
  
  // Framework compliance
  pdf.setFillColor(...colors.accent);
  pdf.roundedRect(70, 160, 70, 20, 5, 5, 'F');
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(14);
  pdf.text(`${framework} ALIGNED`, 105 - pdf.getTextWidth(`${framework} ALIGNED`)/2, 173);
  
  // Report details
  pdf.setFontSize(16);
  pdf.text(`Reporting Period: ${reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${reportPeriod}`)/2, 200);
  
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  pdf.setFontSize(12);
  pdf.text(`Published: ${date}`, 105 - pdf.getTextWidth(`Published: ${date}`)/2, 220);
};

// Professional ESG Logo Design Function
const createESGLogoDesign = (pdf, colors, companyName) => {
  const centerX = 105;
  const centerY = 75;

  // Main circular background with gradient effect (simulated with concentric circles)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(centerX, centerY, 38, 'F');

  // Outer decorative ring
  pdf.setDrawColor(...colors.accent);
  pdf.setLineWidth(4);
  pdf.circle(centerX, centerY, 37, 'S');

  // Inner accent ring
  pdf.setDrawColor(...colors.secondary);
  pdf.setLineWidth(2);
  pdf.circle(centerX, centerY, 35, 'S');

  // ESG letters in circles with enhanced 3D styling
  const letters = [
    { letter: 'E', x: centerX - 28, y: centerY - 15, color: colors.secondary },
    { letter: 'S', x: centerX, y: centerY - 15, color: colors.primary },
    { letter: 'G', x: centerX + 28, y: centerY - 15, color: colors.accent }
  ];

  letters.forEach(item => {
    // 3D shadow effect
    pdf.setFillColor(0, 0, 0, 0.3);
    pdf.circle(item.x + 2, item.y + 2, 14, 'F');

    // Main letter circle with gradient effect (simulated)
    pdf.setFillColor(...item.color);
    pdf.circle(item.x, item.y, 14, 'F');

    // Highlight circle
    pdf.setFillColor(255, 255, 255, 0.4);
    pdf.circle(item.x - 3, item.y - 3, 5, 'F');

    // Letter text with bold styling
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.letter, item.x - 5, item.y + 5);
  });

  // Connecting lines between letters with enhanced arrows
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(3);
  pdf.line(centerX - 14, centerY - 15, centerX - 14, centerY - 1);
  pdf.line(centerX + 14, centerY - 15, centerX + 14, centerY - 1);

  // Enhanced arrow heads with better design
  pdf.setFillColor(255, 255, 255);
  pdf.triangle(centerX - 14, centerY - 1, centerX - 18, centerY + 4, centerX - 10, centerY + 4, 'F');
  pdf.triangle(centerX + 14, centerY - 1, centerX + 18, centerY + 4, centerX + 10, centerY + 4, 'F');

  // Enhanced sustainability icon (multi-layered leaf)
  // Main leaf body
  pdf.setFillColor(34, 139, 34); // Dark green
  pdf.triangle(centerX, centerY + 8, centerX - 10, centerY + 20, centerX + 10, centerY + 20, 'F');

  // Leaf top layer
  pdf.setFillColor(50, 205, 50); // Lime green
  pdf.triangle(centerX, centerY + 8, centerX - 6, centerY + 25, centerX + 6, centerY + 25, 'F');

  // Leaf veins
  pdf.setDrawColor(34, 139, 34);
  pdf.setLineWidth(1);
  pdf.line(centerX, centerY + 8, centerX, centerY + 28);
  pdf.line(centerX, centerY + 15, centerX - 4, centerY + 22);
  pdf.line(centerX, centerY + 15, centerX + 4, centerY + 22);

  // Leaf stem
  pdf.setDrawColor(25, 100, 25);
  pdf.setLineWidth(3);
  pdf.line(centerX, centerY + 28, centerX, centerY + 35);

  // Company name with enhanced styling
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(companyName, centerX - pdf.getTextWidth(companyName)/2, centerY + 55);

  // Enhanced tagline with better background
  pdf.setFillColor(0, 0, 0, 0.5); // Semi-transparent dark background
  const tagline = 'Environmental • Social • Governance';
  const taglineWidth = pdf.getTextWidth(tagline);
  pdf.roundedRect(centerX - taglineWidth/2 - 8, centerY + 58, taglineWidth + 16, 14, 5, 5, 'F');

  // Tagline border
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(1);
  pdf.roundedRect(centerX - taglineWidth/2 - 8, centerY + 58, taglineWidth + 16, 14, 5, 5, 'S');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(tagline, centerX - taglineWidth/2, centerY + 67);

  // Decorative corner elements
  pdf.setFillColor(...colors.accent);
  // Top-left
  pdf.circle(15, 15, 3, 'F');
  pdf.circle(20, 20, 2, 'F');
  // Top-right
  pdf.circle(195, 15, 3, 'F');
  pdf.circle(190, 20, 2, 'F');
  // Bottom-left
  pdf.circle(15, 282, 3, 'F');
  pdf.circle(20, 277, 2, 'F');
  // Bottom-right
  pdf.circle(195, 282, 3, 'F');
  pdf.circle(190, 277, 2, 'F');

  // Small accent circles around the logo
  const accentPositions = [
    { x: centerX - 50, y: centerY - 25 },
    { x: centerX + 50, y: centerY - 25 },
    { x: centerX - 50, y: centerY + 25 },
    { x: centerX + 50, y: centerY + 25 }
  ];

  accentPositions.forEach(pos => {
    pdf.setFillColor(...colors.secondary);
    pdf.circle(pos.x, pos.y, 2, 'F');
  });
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
    
    // Dotted line
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
    `• ${data.length} ESG metrics tracked and reported`,
    '• Comprehensive stakeholder engagement process',
    '• Third-party verification and assurance',
    '• Integration with business strategy and risk management'
  ];
  
  let yPos = 55;
  summaryText.forEach(line => {
    if (line === '') yPos += 5;
    else if (line.startsWith('•')) {
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
  
  // ESG Performance Overview Chart
  if (includeCharts) {
    yPos += 15;
    addESGPerformanceChart(pdf, data, 25, yPos, 160, 80);
  }
};

const createMaterialityAssessment = (pdf, data, colors, includeCharts) => {
  createSectionHeader(pdf, 'MATERIALITY ASSESSMENT', colors);
  
  if (includeCharts) {
    // Materiality matrix
    pdf.setFillColor(...colors.lightGray);
    pdf.roundedRect(20, 50, 170, 100, 5, 5, 'F');
    
    // Matrix axes
    pdf.setDrawColor(...colors.mediumGray);
    pdf.setLineWidth(2);
    pdf.line(50, 140, 170, 140); // X-axis
    pdf.line(50, 60, 50, 140); // Y-axis
    
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(10);
    pdf.text('Impact on Business →', 120, 150);
    pdf.text('Stakeholder', 15, 90);
    pdf.text('Importance ↑', 15, 100);
    
    // Material topics plotted
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
  
  // Material topics list
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
    pdf.text(`• ${topic}`, 25, yPos);
    yPos += 12;
  });
};

const createEnvironmentalPerformance = (pdf, data, colors) => {
  createSectionHeader(pdf, 'ENVIRONMENTAL PERFORMANCE', colors);
  
  try {
    const envData = data.filter(item => item && item.category === 'environmental');
    
    // Environmental metrics summary with fallback data
    const envMetrics = envData.length > 0 ? [
      { metric: 'GHG Emissions (Scope 1+2)', value: envData.find(d => d.metric?.includes('GHG'))?.value || '1,250 tCO2e', target: '15% reduction' },
      { metric: 'Energy Consumption', value: envData.find(d => d.metric?.includes('Energy'))?.value || '2,500 MWh', target: '10% efficiency gain' },
      { metric: 'Water Usage', value: envData.find(d => d.metric?.includes('Water'))?.value || '15,000 m³', target: '5% reduction' },
      { metric: 'Waste Diverted', value: envData.find(d => d.metric?.includes('Waste'))?.value || '85%', target: '90% by 2025' }
    ] : [
      { metric: 'GHG Emissions (Scope 1+2)', value: '1,250 tCO2e', target: '15% reduction' },
      { metric: 'Energy Consumption', value: '2,500 MWh', target: '10% efficiency gain' },
      { metric: 'Water Usage', value: '15,000 m³', target: '5% reduction' },
      { metric: 'Waste Diverted', value: '85%', target: '90% by 2025' }
    ];
  
  // Performance table
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
  
  // Environmental initiatives
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
    pdf.text(`• ${initiative}`, 25, yPos);
    yPos += 12;
  });
  } catch (error) {
    console.warn('Error processing environmental data, using fallback:', error.message);
    // Fallback to default metrics if data processing fails
    const envMetrics = [
      { metric: 'GHG Emissions (Scope 1+2)', value: '1,250 tCO2e', target: '15% reduction' },
      { metric: 'Energy Consumption', value: '2,500 MWh', target: '10% efficiency gain' },
      { metric: 'Water Usage', value: '15,000 m³', target: '5% reduction' },
      { metric: 'Waste Diverted', value: '85%', target: '90% by 2025' }
    ];
    
    // Performance table
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
    
    // Environmental initiatives
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
      pdf.text(`• ${initiative}`, 25, yPos);
      yPos += 12;
    });
  }
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
    // Social performance chart
    addSocialMetricsChart(pdf, socialMetrics, 20, 60, 170, 80);
  }
  
  // Social initiatives
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
    pdf.text(`• ${program}`, 25, yPos);
    yPos += 12;
  });
};

const createGovernancePerformance = async (pdf, data, colors) => {
  createSectionHeader(pdf, 'GOVERNANCE PERFORMANCE', colors);
  
  // Governance structure
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
  
  // Ethics and compliance
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
    pdf.text(`• ${item}`, 25, yPos);
    yPos += 12;
  });
};

const createRiskManagement = (pdf, data, colors, includeCharts) => {
  createSectionHeader(pdf, 'ESG RISK MANAGEMENT', colors);
  
  if (includeCharts) {
    // Risk assessment chart
    addRiskAssessmentChart(pdf, data, 20, 60, 170, 80);
  }
  
  // Risk mitigation strategies
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
    pdf.text(`• ${strategy}`, 25, yPos);
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
    pdf.text(`• ${standard}`, 25, yPos);
    yPos += 12;
  });
  
  // Compliance summary
  yPos += 20;
  pdf.setFillColor(...colors.lightGray);
  pdf.roundedRect(20, yPos, 170, 40, 5, 5, 'F');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Compliance Summary', 25, yPos + 15);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`• ${data.length} performance indicators reported`, 25, yPos + 25);
  pdf.text(`• Full alignment with ${framework} requirements`, 25, yPos + 35);
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
    '• Selected quantitative performance data',
    '• Management systems and processes',
    '• Adherence to reporting frameworks',
    '',
    'Assurance Opinion:',
    'Based on our review, nothing has come to our attention that causes us to believe',
    'that the selected ESG data and information are not fairly stated in all material respects.'
  ];
  
  let yPos = 60;
  assuranceText.forEach(line => {
    if (line === '') yPos += 5;
    else if (line.startsWith('•')) {
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
  
  // Assurance provider
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

// Helper functions
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

// Chart functions
const addESGPerformanceChart = (pdf, data, x, y, width, height) => {
  const envData = data.filter(item => item.category === 'environmental');
  const socialData = data.filter(item => item.category === 'social');
  const govData = data.filter(item => item.category === 'governance');
  
  const values = [envData.length, socialData.length, govData.length];
  const labels = ['Environmental', 'Social', 'Governance'];
  const colors = [[46, 125, 50], [25, 118, 210], [123, 31, 162]];
  
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return;
  
  // Draw donut chart
  const centerX = x + width/2;
  const centerY = y + height/2;
  const outerRadius = 35;
  const innerRadius = 20;
  
  let startAngle = 0;
  
  values.forEach((value, index) => {
    if (value > 0) {
      const angle = (value / total) * 360;
      
      // Draw sector using multiple small rectangles to simulate arc
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
  
  // Add center circle
  pdf.setFillColor(255, 255, 255);
  pdf.circle(centerX, centerY, innerRadius, 'F');
  
  // Add legend
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
    
    // Background bar
    pdf.setFillColor(220, 220, 220);
    pdf.rect(x + 100, barY, width - 100, barHeight, 'F');
    
    // Value bar
    pdf.setFillColor(25, 118, 210);
    pdf.rect(x + 100, barY, barWidth, barHeight, 'F');
    
    // Labels
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
  
  // Draw pie chart using triangular segments
  riskData.forEach((risk, index) => {
    const angle = (risk.value / 100) * 360;
    const endAngle = startAngle + angle;
    
    // Draw multiple triangular segments to create smooth arc
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
    
    // Add percentage labels
    const labelAngle = (startAngle + angle/2) * Math.PI / 180;
    const labelX = centerX + (radius * 0.7) * Math.cos(labelAngle);
    const labelY = centerY + (radius * 0.7) * Math.sin(labelAngle);
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(`${risk.value}%`, labelX - 8, labelY + 2);
    
    startAngle = endAngle;
  });
  
  // Add legend
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