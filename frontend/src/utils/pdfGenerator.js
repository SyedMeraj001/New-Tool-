import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateBasicPDF = (data, options = {}) => {
  const pdf = new jsPDF();
  const { title = 'ESG Report', companyName = 'Company Name' } = options;
  
  // Header
  pdf.setFontSize(20);
  pdf.text(title, 20, 30);
  pdf.setFontSize(12);
  pdf.text(companyName, 20, 45);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
  
  // Data table
  if (data && data.length > 0) {
    const tableData = data.map(item => [
      item.metric || '',
      item.value || '',
      item.unit || '',
      item.category || ''
    ]);
    
    pdf.autoTable({
      head: [['Metric', 'Value', 'Unit', 'Category']],
      body: tableData,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [46, 125, 50] }
    });
  }
  
  return pdf;
};

export const downloadPDF = (pdf, filename = 'esg-report.pdf') => {
  pdf.save(filename);
};

export const generateESGReport = (data, options = {}) => {
  const pdf = generateBasicPDF(data, options);
  return pdf;
};

export const generateESGPDF = generateESGReport;

export default {
  generateBasicPDF,
  downloadPDF,
  generateESGReport,
  generateESGPDF
};