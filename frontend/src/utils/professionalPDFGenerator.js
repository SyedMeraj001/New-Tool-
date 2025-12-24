import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateProfessionalPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const {
    title = 'ESG Sustainability Report',
    companyName = 'Company Name',
    reportPeriod = new Date().getFullYear(),
    framework = 'GRI'
  } = options;
  
  // Colors
  const colors = {
    primary: [46, 125, 50],
    secondary: [25, 118, 210],
    accent: [255, 152, 0],
    text: [51, 51, 51],
    lightGray: [245, 245, 245]
  };
  
  // Cover page
  createCoverPage(pdf, title, companyName, reportPeriod, framework, colors);
  
  // Executive summary
  pdf.addPage();
  createExecutiveSummary(pdf, data, colors, options);
  
  // Data sections
  if (data && data.length > 0) {
    pdf.addPage();
    createDataSection(pdf, data, colors);
  }
  
  return pdf;
};

const createCoverPage = (pdf, title, companyName, reportPeriod, framework, colors) => {
  // Background
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 297, 'F');
  
  // Company name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(companyName, 105 - pdf.getTextWidth(companyName)/2, 80);
  
  // Title
  pdf.setFontSize(32);
  pdf.text(title, 105 - pdf.getTextWidth(title)/2, 120);
  
  // Framework badge
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(75, 140, 60, 20, 5, 5, 'F');
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(14);
  pdf.text(`${framework} Compliant`, 105 - pdf.getTextWidth(`${framework} Compliant`)/2, 153);
  
  // Report period
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text(`Report Period: ${reportPeriod}`, 105 - pdf.getTextWidth(`Report Period: ${reportPeriod}`)/2, 180);
  
  // Date
  const date = new Date().toLocaleDateString();
  pdf.setFontSize(12);
  pdf.text(`Generated: ${date}`, 105 - pdf.getTextWidth(`Generated: ${date}`)/2, 200);
};

const createExecutiveSummary = (pdf, data, colors, options) => {
  // Header
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Executive Summary', 20, 25);
  
  // Content
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const summaryText = [
    `This comprehensive ESG report presents ${options.companyName || 'our organization'}'s`,
    'environmental, social, and governance performance. Our commitment to sustainable',
    'business practices drives measurable impact across all ESG pillars.',
    '',
    'Key highlights include:',
    `• Comprehensive tracking of ${data.length} ESG performance indicators`,
    `• ${options.framework || 'Multi-framework'} compliance and reporting standards`,
    '• Data-driven sustainability strategy implementation',
    '• Stakeholder engagement and materiality assessment'
  ];
  
  let yPos = 60;
  summaryText.forEach(line => {
    if (line === '') {
      yPos += 5;
    } else {
      pdf.text(line, 20, yPos);
      yPos += 8;
    }
  });
};

const createDataSection = (pdf, data, colors) => {
  // Header
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESG Performance Data', 20, 25);
  
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
    startY: 50,
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: colors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: colors.lightGray
    }
  });
};

export const downloadProfessionalPDF = (pdf, filename = 'professional-esg-report.pdf') => {
  pdf.save(filename);
};

export default {
  generateProfessionalPDF,
  downloadProfessionalPDF
};