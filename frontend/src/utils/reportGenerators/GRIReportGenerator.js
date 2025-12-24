import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class GRIReportGenerator {
  constructor(options = {}) {
    this.options = {
      companyName: 'Company Name',
      reportPeriod: new Date().getFullYear(),
      ...options
    };
    
    this.colors = {
      primary: [46, 125, 50],
      secondary: [76, 175, 80],
      accent: [139, 195, 74],
      text: [51, 51, 51],
      lightGray: [248, 249, 250]
    };
  }
  
  generateReport(data) {
    const pdf = new jsPDF();
    
    // Cover page
    this.createCoverPage(pdf);
    
    // GRI standards overview
    pdf.addPage();
    this.createStandardsOverview(pdf);
    
    // Data by standards
    if (data && data.length > 0) {
      pdf.addPage();
      this.createDataByStandards(pdf, data);
    }
    
    return pdf;
  }
  
  createCoverPage(pdf) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 297, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GRI Standards Report', 105 - pdf.getTextWidth('GRI Standards Report')/2, 80);
    
    pdf.setFontSize(18);
    pdf.text('Global Reporting Initiative', 105 - pdf.getTextWidth('Global Reporting Initiative')/2, 100);
    pdf.text('Sustainability Reporting', 105 - pdf.getTextWidth('Sustainability Reporting')/2, 120);
    
    // Company info
    pdf.setFontSize(20);
    pdf.text(this.options.companyName, 105 - pdf.getTextWidth(this.options.companyName)/2, 160);
    
    pdf.setFontSize(14);
    pdf.text(`Reporting Period: ${this.options.reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${this.options.reportPeriod}`)/2, 180);
    
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated: ${date}`, 105 - pdf.getTextWidth(`Generated: ${date}`)/2, 200);
  }
  
  createStandardsOverview(pdf) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GRI Standards Overview', 20, 30);
    
    // Standards categories
    const categories = [
      {
        title: 'Universal Standards',
        standards: ['GRI 1: Foundation', 'GRI 2: General Disclosures', 'GRI 3: Material Topics'],
        color: this.colors.primary
      },
      {
        title: 'Topic-Specific Standards',
        standards: ['Economic (200 series)', 'Environmental (300 series)', 'Social (400 series)'],
        color: this.colors.secondary
      }
    ];
    
    let yPos = 70;
    categories.forEach(category => {
      // Category header
      pdf.setFillColor(...category.color);
      pdf.roundedRect(20, yPos, 170, 15, 3, 3, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(category.title, 25, yPos + 9);
      
      yPos += 20;
      
      // Standards list
      pdf.setTextColor(...this.colors.text);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      category.standards.forEach(standard => {
        pdf.text(`• ${standard}`, 30, yPos);
        yPos += 12;
      });
      
      yPos += 10;
    });
  }
  
  createDataByStandards(pdf, data) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GRI Performance Data', 20, 30);
    
    // Group data by GRI standards
    const standardData = this.groupDataByStandards(data);
    
    // Create table for each standard with data
    let yPos = 60;
    Object.entries(standardData).forEach(([standard, metrics]) => {
      if (metrics.length > 0) {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setTextColor(...this.colors.text);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(standard, 20, yPos);
        yPos += 10;
        
        const tableData = metrics.map(metric => [
          metric.griDisclosure || metric.metric || '',
          metric.value || '',
          metric.unit || '',
          metric.description || ''
        ]);
        
        pdf.autoTable({
          head: [['Disclosure', 'Value', 'Unit', 'Description']],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 9 },
          headStyles: { fillColor: this.colors.primary }
        });
        
        yPos = pdf.lastAutoTable.finalY + 15;
      }
    });
  }
  
  groupDataByStandards(data) {
    const standards = {
      'GRI 2: General Disclosures': [],
      'GRI 3: Material Topics': [],
      'GRI 200: Economic': [],
      'GRI 300: Environmental': [],
      'GRI 400: Social': []
    };
    
    data.forEach(item => {
      const standard = item.griStandard || this.mapCategoryToStandard(item.category);
      if (standards[standard]) {
        standards[standard].push(item);
      } else {
        // Default to General Disclosures if no mapping found
        standards['GRI 2: General Disclosures'].push(item);
      }
    });
    
    return standards;
  }
  
  mapCategoryToStandard(category) {
    const mapping = {
      environmental: 'GRI 300: Environmental',
      social: 'GRI 400: Social',
      governance: 'GRI 2: General Disclosures',
      economic: 'GRI 200: Economic'
    };
    
    return mapping[category] || 'GRI 2: General Disclosures';
  }
  
  download(pdf, filename = 'gri-report.pdf') {
    pdf.save(filename);
  }
}

export const generateGRIReport = (data, options = {}) => {
  const generator = new GRIReportGenerator(options);
  return generator.generateReport(data);
};

export default GRIReportGenerator;