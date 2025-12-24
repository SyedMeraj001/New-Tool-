import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateGRIReport = (data, options = {}) => {
  const pdf = new jsPDF();
  const {
    companyName = 'Company Name',
    reportPeriod = new Date().getFullYear(),
    title = 'GRI Standards Report'
  } = options;
  
  const colors = {
    primary: [46, 125, 50],
    secondary: [76, 175, 80],
    text: [51, 51, 51],
    lightGray: [248, 249, 250]
  };
  
  // Header
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 210, 60, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, 20, 30);
  
  pdf.setFontSize(14);
  pdf.text(companyName, 20, 45);
  pdf.text(`Reporting Period: ${reportPeriod}`, 20, 55);
  
  // GRI Standards overview
  pdf.setTextColor(...colors.text);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GRI Standards Overview', 20, 80);
  
  const griStandards = [
    'GRI 1: Foundation 2021',
    'GRI 2: General Disclosures 2021',
    'GRI 3: Material Topics 2021',
    'GRI 200: Economic Standards',
    'GRI 300: Environmental Standards',
    'GRI 400: Social Standards'
  ];
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  let yPos = 95;
  
  griStandards.forEach(standard => {
    pdf.text(`• ${standard}`, 25, yPos);
    yPos += 8;
  });
  
  // Data table
  if (data && data.length > 0) {
    yPos += 15;
    
    const tableData = data.map(item => [
      item.griStandard || 'GRI Universal',
      item.metric || '',
      item.value || '',
      item.unit || ''
    ]);
    
    pdf.autoTable({
      head: [['GRI Standard', 'Metric', 'Value', 'Unit']],
      body: tableData,
      startY: yPos,
      styles: {
        fontSize: 10,
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
  }
  
  return pdf;
};

export const downloadGRIReport = (pdf, filename = 'gri-report.pdf') => {
  pdf.save(filename);
};

export const GRIReportGenerator = {
  generateGRIReport,
  downloadGRIReport
};

export default {
  generateGRIReport,
  downloadGRIReport,
  GRIReportGenerator
};