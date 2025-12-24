import jsPDF from 'jspdf';
import 'jspdf-autotable';

// GRI PDF Generator
export const generateGRIPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const { companyName = 'Company Name', reportPeriod = new Date().getFullYear() } = options;
  
  // GRI Header
  pdf.setFontSize(20);
  pdf.text('GRI Standards Report', 20, 30);
  pdf.setFontSize(12);
  pdf.text(companyName, 20, 45);
  pdf.text(`Reporting Period: ${reportPeriod}`, 20, 55);
  
  // GRI Standards table
  const griData = data.filter(item => item.framework === 'GRI' || !item.framework);
  if (griData.length > 0) {
    const tableData = griData.map(item => [
      item.griStandard || 'GRI Universal',
      item.metric || '',
      item.value || '',
      item.unit || ''
    ]);
    
    pdf.autoTable({
      head: [['GRI Standard', 'Metric', 'Value', 'Unit']],
      body: tableData,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [46, 125, 50] }
    });
  }
  
  return pdf;
};

// SASB PDF Generator
export const generateSASBPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const { companyName = 'Company Name', reportPeriod = new Date().getFullYear() } = options;
  
  // SASB Header
  pdf.setFontSize(20);
  pdf.text('SASB Standards Report', 20, 30);
  pdf.setFontSize(12);
  pdf.text(companyName, 20, 45);
  pdf.text(`Reporting Period: ${reportPeriod}`, 20, 55);
  
  // SASB table
  const sasbData = data.filter(item => item.framework === 'SASB' || !item.framework);
  if (sasbData.length > 0) {
    const tableData = sasbData.map(item => [
      item.sasbTopic || 'General',
      item.metric || '',
      item.value || '',
      item.unit || ''
    ]);
    
    pdf.autoTable({
      head: [['SASB Topic', 'Metric', 'Value', 'Unit']],
      body: tableData,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [25, 118, 210] }
    });
  }
  
  return pdf;
};

// TCFD PDF Generator
export const generateTCFDPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const { companyName = 'Company Name', reportPeriod = new Date().getFullYear() } = options;
  
  // TCFD Header
  pdf.setFontSize(20);
  pdf.text('TCFD Recommendations Report', 20, 30);
  pdf.setFontSize(12);
  pdf.text(companyName, 20, 45);
  pdf.text(`Reporting Period: ${reportPeriod}`, 20, 55);
  
  // TCFD pillars
  const tcfdPillars = ['Governance', 'Strategy', 'Risk Management', 'Metrics and Targets'];
  let yPos = 70;
  
  tcfdPillars.forEach(pillar => {
    const pillarData = data.filter(item => item.tcfdPillar === pillar);
    
    if (pillarData.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(pillar, 20, yPos);
      yPos += 10;
      
      const tableData = pillarData.map(item => [
        item.metric || '',
        item.value || '',
        item.unit || ''
      ]);
      
      pdf.autoTable({
        head: [['Metric', 'Value', 'Unit']],
        body: tableData,
        startY: yPos,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 152, 0] }
      });
      
      yPos = pdf.lastAutoTable.finalY + 15;
    }
  });
  
  return pdf;
};

// BRSR PDF Generator
export const generateBRSRPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const { companyName = 'Company Name', reportPeriod = new Date().getFullYear() } = options;
  
  // BRSR Header
  pdf.setFontSize(20);
  pdf.text('BRSR Report', 20, 30);
  pdf.setFontSize(12);
  pdf.text(companyName, 20, 45);
  pdf.text(`Reporting Period: ${reportPeriod}`, 20, 55);
  
  // BRSR Principles
  const brsrData = data.filter(item => item.framework === 'BRSR' || !item.framework);
  if (brsrData.length > 0) {
    const tableData = brsrData.map(item => [
      item.brsrPrinciple || 'General',
      item.metric || '',
      item.value || '',
      item.unit || ''
    ]);
    
    pdf.autoTable({
      head: [['BRSR Principle', 'Metric', 'Value', 'Unit']],
      body: tableData,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [156, 39, 176] }
    });
  }
  
  return pdf;
};

// Multi-framework PDF Generator
export const generateMultiFrameworkPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const { companyName = 'Company Name', reportPeriod = new Date().getFullYear() } = options;
  
  // Header
  pdf.setFontSize(20);
  pdf.text('Multi-Framework ESG Report', 20, 30);
  pdf.setFontSize(12);
  pdf.text(companyName, 20, 45);
  pdf.text(`Reporting Period: ${reportPeriod}`, 20, 55);
  
  // Framework sections
  const frameworks = ['GRI', 'SASB', 'TCFD', 'BRSR'];
  let yPos = 70;
  
  frameworks.forEach(framework => {
    const frameworkData = data.filter(item => item.framework === framework);
    
    if (frameworkData.length > 0) {
      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${framework} Standards`, 20, yPos);
      yPos += 10;
      
      const tableData = frameworkData.map(item => [
        item.metric || '',
        item.value || '',
        item.unit || '',
        item.category || ''
      ]);
      
      pdf.autoTable({
        head: [['Metric', 'Value', 'Unit', 'Category']],
        body: tableData,
        startY: yPos,
        styles: { fontSize: 9 },
        headStyles: { fillColor: getFrameworkColor(framework) }
      });
      
      yPos = pdf.lastAutoTable.finalY + 15;
    }
  });
  
  return pdf;
};

const getFrameworkColor = (framework) => {
  const colors = {
    GRI: [46, 125, 50],
    SASB: [25, 118, 210],
    TCFD: [255, 152, 0],
    BRSR: [156, 39, 176]
  };
  return colors[framework] || [128, 128, 128];
};

// EU Taxonomy PDF Generator
export const generateEUTaxonomyPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const { companyName = 'Company Name', reportPeriod = new Date().getFullYear() } = options;
  
  // EU Taxonomy Header
  pdf.setFontSize(20);
  pdf.text('EU Taxonomy Report', 20, 30);
  pdf.setFontSize(12);
  pdf.text(companyName, 20, 45);
  pdf.text(`Reporting Period: ${reportPeriod}`, 20, 55);
  
  // EU Taxonomy table
  const taxonomyData = data.filter(item => item.framework === 'EU_TAXONOMY' || !item.framework);
  if (taxonomyData.length > 0) {
    const tableData = taxonomyData.map(item => [
      item.taxonomyActivity || 'General',
      item.metric || '',
      item.value || '',
      item.unit || ''
    ]);
    
    pdf.autoTable({
      head: [['Taxonomy Activity', 'Metric', 'Value', 'Unit']],
      body: tableData,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 102, 204] }
    });
  }
  
  return pdf;
};

export const downloadFrameworkPDF = (pdf, framework, filename) => {
  const defaultFilename = `${framework.toLowerCase()}-report-${new Date().getFullYear()}.pdf`;
  pdf.save(filename || defaultFilename);
};

export default {
  generateGRIPDF,
  generateSASBPDF,
  generateTCFDPDF,
  generateBRSRPDF,
  generateMultiFrameworkPDF,
  generateEUTaxonomyPDF,
  downloadFrameworkPDF
};