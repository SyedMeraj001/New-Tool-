import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateEnhancedProfessionalPDF = async (data, options = {}) => {
  const pdf = new jsPDF();
  const {
    title = 'ESG Sustainability Report',
    companyName = 'Company Name',
    reportPeriod = new Date().getFullYear(),
    framework = 'GRI',
    includeCharts = true,
    includeAnalysis = true
  } = options;
  
  const colors = {
    primary: [46, 125, 50],
    secondary: [25, 118, 210],
    accent: [255, 152, 0],
    text: [51, 51, 51],
    lightGray: [248, 249, 250],
    mediumGray: [189, 189, 189],
    white: [255, 255, 255]
  };
  
  // Cover page
  await createEnhancedCoverPage(pdf, title, companyName, reportPeriod, framework, colors);
  
  // Table of contents
  pdf.addPage();
  createTableOfContents(pdf, colors);
  
  // Executive summary
  pdf.addPage();
  await createEnhancedExecutiveSummary(pdf, data, colors, options);
  
  // Performance analysis
  if (includeAnalysis && data && data.length > 0) {
    pdf.addPage();
    await createPerformanceAnalysis(pdf, data, colors);
  }
  
  // Data appendix
  if (data && data.length > 0) {
    pdf.addPage();
    createDataAppendix(pdf, data, colors);
  }
  
  return pdf;
};

const createEnhancedCoverPage = async (pdf, title, companyName, reportPeriod, framework, colors) => {
  // Gradient background
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 297, 'F');
  
  // Add subtle pattern
  pdf.setDrawColor(255, 255, 255, 0.1);
  for (let i = 0; i < 210; i += 20) {
    pdf.line(i, 0, i, 297);
  }
  
  // Company logo placeholder
  pdf.setFillColor(...colors.white);
  pdf.circle(105, 80, 30, 'F');
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LOGO', 105 - pdf.getTextWidth('LOGO')/2, 85);
  
  // Company name
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text(companyName, 105 - pdf.getTextWidth(companyName)/2, 130);
  
  // Title
  pdf.setFontSize(36);
  pdf.text(title, 105 - pdf.getTextWidth(title)/2, 160);
  
  // Framework compliance badge
  pdf.setFillColor(...colors.accent);
  pdf.roundedRect(70, 180, 70, 25, 5, 5, 'F');
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${framework} COMPLIANT`, 105 - pdf.getTextWidth(`${framework} COMPLIANT`)/2, 197);
  
  // Report details
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Reporting Period: ${reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${reportPeriod}`)/2, 220);
  
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(`Published: ${date}`, 105 - pdf.getTextWidth(`Published: ${date}`)/2, 235);
  
  // Footer
  pdf.setFontSize(10);
  pdf.text('Confidential - For Stakeholder Review', 105 - pdf.getTextWidth('Confidential - For Stakeholder Review')/2, 280);
};

const createTableOfContents = (pdf, colors) => {
  // Header
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 50, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Table of Contents', 20, 30);
  
  // Contents
  const contents = [
    { title: 'Executive Summary', page: 3 },
    { title: 'ESG Framework & Methodology', page: 4 },
    { title: 'Performance Analysis', page: 5 },
    { title: 'Environmental Performance', page: 6 },
    { title: 'Social Performance', page: 7 },
    { title: 'Governance Performance', page: 8 },
    { title: 'Data Appendix', page: 9 }
  ];
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  let yPos = 70;
  contents.forEach(item => {
    pdf.text(item.title, 30, yPos);
    pdf.text(item.page.toString(), 180, yPos);
    
    // Dotted line
    pdf.setDrawColor(...colors.mediumGray);
    const dots = Math.floor((150 - pdf.getTextWidth(item.title)) / 3);
    for (let i = 0; i < dots; i++) {
      pdf.circle(30 + pdf.getTextWidth(item.title) + 5 + (i * 3), yPos - 1, 0.3, 'F');
    }
    
    yPos += 15;
  });
};

const createEnhancedExecutiveSummary = async (pdf, data, colors, options) => {
  // Header
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 50, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Executive Summary', 20, 30);
  
  // Content with professional styling
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setLineHeightFactor(1.4);
  
  const summaryText = [
    'ESG reporting represents a fundamental shift in how organizations communicate their',
    'value creation to stakeholders. This comprehensive report demonstrates our commitment',
    'to transparency, accountability, and sustainable business practices.',
    '',
    `Our ${options.framework || 'multi-framework'} approach ensures alignment with global standards`,
    'while addressing the specific needs of our stakeholders and industry context.',
    '',
    'Key Performance Highlights:',
    `• ${data.length} ESG metrics tracked and reported`,
    '• Comprehensive stakeholder engagement process',
    '• Third-party verification and assurance',
    '• Integration with business strategy and risk management'
  ];
  
  let yPos = 70;
  summaryText.forEach(line => {
    if (line === '') {
      yPos += 5;
    } else if (line.startsWith('•')) {
      pdf.setFont('helvetica', 'normal');
      pdf.text(line, 25, yPos);
      yPos += 8;
    } else if (line.includes('Highlights:')) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(line, 20, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 10;
    } else {
      pdf.text(line, 20, yPos);
      yPos += 8;
    }
  });
  
  // Performance summary box
  yPos += 10;
  pdf.setFillColor(...colors.lightGray);
  pdf.roundedRect(20, yPos, 170, 60, 5, 5, 'F');
  pdf.setDrawColor(...colors.mediumGray);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(20, yPos, 170, 60, 5, 5, 'S');
  
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESG Performance Overview', 25, yPos + 15);
  
  // Performance metrics
  const categories = ['Environmental', 'Social', 'Governance'];
  const categoryData = categories.map(cat => {
    const catData = data.filter(item => item.category === cat.toLowerCase());
    return {
      category: cat,
      metrics: catData.length,
      status: catData.length > 0 ? 'Reported' : 'In Progress'
    };
  });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  let metricY = yPos + 30;
  categoryData.forEach(cat => {
    pdf.text(`${cat.category}: ${cat.metrics} metrics (${cat.status})`, 25, metricY);
    metricY += 10;
  });
};

const createPerformanceAnalysis = async (pdf, data, colors) => {
  // Header
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 50, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Analysis', 20, 30);
  
  // Analysis content
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const analysisText = [
    'Our ESG performance analysis reveals significant progress across all three pillars',
    'of sustainability. The following analysis provides insights into our performance',
    'trends, benchmarking results, and areas for continued improvement.',
    '',
    'Methodology:',
    '• Data collection through automated systems and manual verification',
    '• Third-party validation of key performance indicators',
    '• Benchmarking against industry peers and best practices',
    '• Integration with financial performance metrics'
  ];
  
  let yPos = 70;
  analysisText.forEach(line => {
    if (line === '') {
      yPos += 5;
    } else if (line.startsWith('•')) {
      pdf.text(line, 25, yPos);
      yPos += 8;
    } else if (line.includes('Methodology:')) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(line, 20, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 10;
    } else {
      pdf.text(line, 20, yPos);
      yPos += 8;
    }
  });
  
  // Performance summary table
  yPos += 20;
  const categories = ['Environmental', 'Social', 'Governance'];
  const performanceData = categories.map(cat => {
    const catData = data.filter(item => item.category === cat.toLowerCase());
    return [
      cat,
      catData.length.toString(),
      catData.length > 0 ? 'Complete' : 'In Progress',
      catData.length > 5 ? 'Improving' : 'Stable'
    ];
  });
  
  pdf.autoTable({
    head: [['Category', 'Metrics', 'Status', 'Trend']],
    body: performanceData,
    startY: yPos,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: colors.primary,
      textColor: colors.white,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: colors.lightGray
    }
  });
};

const createDataAppendix = (pdf, data, colors) => {
  // Header
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 50, 'F');
  
  pdf.setTextColor(...colors.white);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Data Appendix', 20, 30);
  
  // Data table
  const tableData = data.map(item => [
    item.metric || '',
    item.value || '',
    item.unit || '',
    item.category || '',
    item.framework || ''
  ]);
  
  pdf.autoTable({
    head: [['Metric', 'Value', 'Unit', 'Category', 'Framework']],
    body: tableData,
    startY: 60,
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: colors.primary,
      textColor: colors.white,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: colors.lightGray
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 }
    }
  });
};

export const downloadEnhancedPDF = (pdf, filename = 'enhanced-esg-report.pdf') => {
  pdf.save(filename);
};

export const generateExecutiveProfessionalReport = generateEnhancedProfessionalPDF;

export default {
  generateEnhancedProfessionalPDF,
  generateExecutiveProfessionalReport,
  downloadEnhancedPDF
};