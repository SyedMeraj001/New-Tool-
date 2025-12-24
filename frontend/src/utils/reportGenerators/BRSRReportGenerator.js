import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class BRSRReportGenerator {
  constructor(options = {}) {
    this.options = {
      companyName: 'Company Name',
      reportPeriod: new Date().getFullYear(),
      ...options
    };
    
    this.colors = {
      primary: [156, 39, 176],
      secondary: [103, 58, 183],
      accent: [233, 30, 99],
      text: [51, 51, 51],
      lightGray: [248, 249, 250]
    };
  }
  
  generateReport(data) {
    const pdf = new jsPDF();
    
    // Cover page
    this.createCoverPage(pdf);
    
    // BRSR principles sections
    pdf.addPage();
    this.createPrinciplesOverview(pdf);
    
    // Data by principles
    if (data && data.length > 0) {
      pdf.addPage();
      this.createDataByPrinciples(pdf, data);
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
    pdf.text('BRSR Report', 105 - pdf.getTextWidth('BRSR Report')/2, 80);
    
    pdf.setFontSize(18);
    pdf.text('Business Responsibility and', 105 - pdf.getTextWidth('Business Responsibility and')/2, 100);
    pdf.text('Sustainability Reporting', 105 - pdf.getTextWidth('Sustainability Reporting')/2, 120);
    
    // Company info
    pdf.setFontSize(20);
    pdf.text(this.options.companyName, 105 - pdf.getTextWidth(this.options.companyName)/2, 160);
    
    pdf.setFontSize(14);
    pdf.text(`Reporting Period: ${this.options.reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${this.options.reportPeriod}`)/2, 180);
    
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated: ${date}`, 105 - pdf.getTextWidth(`Generated: ${date}`)/2, 200);
  }
  
  createPrinciplesOverview(pdf) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BRSR Principles Overview', 20, 30);
    
    // Principles list
    const principles = [
      'Principle 1: Ethics, Transparency and Accountability',
      'Principle 2: Product Lifecycle Sustainability',
      'Principle 3: Employees Well-being',
      'Principle 4: Stakeholder Engagement',
      'Principle 5: Human Rights',
      'Principle 6: Environment',
      'Principle 7: Policy Advocacy',
      'Principle 8: Inclusive Growth',
      'Principle 9: Customer Value'
    ];
    
    pdf.setTextColor(...this.colors.text);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    let yPos = 70;
    principles.forEach((principle, index) => {
      pdf.setFillColor(...this.colors.lightGray);
      pdf.roundedRect(20, yPos - 5, 170, 15, 3, 3, 'F');
      
      pdf.setTextColor(...this.colors.primary);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}.`, 25, yPos + 3);
      
      pdf.setTextColor(...this.colors.text);
      pdf.setFont('helvetica', 'normal');
      pdf.text(principle.substring(principle.indexOf(':') + 2), 35, yPos + 3);
      
      yPos += 20;
    });
  }
  
  createDataByPrinciples(pdf, data) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BRSR Performance Data', 20, 30);
    
    // Group data by BRSR principles
    const principleData = this.groupDataByPrinciples(data);
    
    // Create table for each principle with data
    let yPos = 60;
    Object.entries(principleData).forEach(([principle, metrics]) => {
      if (metrics.length > 0) {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setTextColor(...this.colors.text);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(principle, 20, yPos);
        yPos += 10;
        
        const tableData = metrics.map(metric => [
          metric.metric || '',
          metric.value || '',
          metric.unit || '',
          metric.description || ''
        ]);
        
        pdf.autoTable({
          head: [['Metric', 'Value', 'Unit', 'Description']],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 9 },
          headStyles: { fillColor: this.colors.primary }
        });
        
        yPos = pdf.lastAutoTable.finalY + 15;
      }
    });
  }
  
  groupDataByPrinciples(data) {
    const principles = {
      'Principle 1: Ethics, Transparency and Accountability': [],
      'Principle 2: Product Lifecycle Sustainability': [],
      'Principle 3: Employees Well-being': [],
      'Principle 4: Stakeholder Engagement': [],
      'Principle 5: Human Rights': [],
      'Principle 6: Environment': [],
      'Principle 7: Policy Advocacy': [],
      'Principle 8: Inclusive Growth': [],
      'Principle 9: Customer Value': []
    };
    
    data.forEach(item => {
      const principle = item.brsrPrinciple || this.mapCategoryToPrinciple(item.category);
      if (principles[principle]) {
        principles[principle].push(item);
      } else {
        // Default to Principle 1 if no mapping found
        principles['Principle 1: Ethics, Transparency and Accountability'].push(item);
      }
    });
    
    return principles;
  }
  
  mapCategoryToPrinciple(category) {
    const mapping = {
      environmental: 'Principle 6: Environment',
      social: 'Principle 3: Employees Well-being',
      governance: 'Principle 1: Ethics, Transparency and Accountability',
      economic: 'Principle 8: Inclusive Growth'
    };
    
    return mapping[category] || 'Principle 1: Ethics, Transparency and Accountability';
  }
  
  download(pdf, filename = 'brsr-report.pdf') {
    pdf.save(filename);
  }
}

export const generateBRSRReport = (data, options = {}) => {
  const generator = new BRSRReportGenerator(options);
  return generator.generateReport(data);
};

export default BRSRReportGenerator;