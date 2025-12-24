import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class SASBReportGenerator {
  constructor(options = {}) {
    this.options = {
      companyName: 'Company Name',
      reportPeriod: new Date().getFullYear(),
      industry: 'General',
      ...options
    };
    
    this.colors = {
      primary: [25, 118, 210],
      secondary: [33, 150, 243],
      accent: [100, 181, 246],
      text: [51, 51, 51],
      lightGray: [248, 249, 250]
    };
  }
  
  generateReport(data) {
    const pdf = new jsPDF();
    
    // Cover page
    this.createCoverPage(pdf);
    
    // SASB dimensions overview
    pdf.addPage();
    this.createDimensionsOverview(pdf);
    
    // Data by dimensions
    if (data && data.length > 0) {
      pdf.addPage();
      this.createDataByDimensions(pdf, data);
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
    pdf.text('SASB Standards Report', 105 - pdf.getTextWidth('SASB Standards Report')/2, 80);
    
    pdf.setFontSize(18);
    pdf.text('Sustainability Accounting', 105 - pdf.getTextWidth('Sustainability Accounting')/2, 100);
    pdf.text('Standards Board', 105 - pdf.getTextWidth('Standards Board')/2, 120);
    
    // Company info
    pdf.setFontSize(20);
    pdf.text(this.options.companyName, 105 - pdf.getTextWidth(this.options.companyName)/2, 160);
    
    pdf.setFontSize(14);
    pdf.text(`Industry: ${this.options.industry}`, 105 - pdf.getTextWidth(`Industry: ${this.options.industry}`)/2, 175);
    pdf.text(`Reporting Period: ${this.options.reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${this.options.reportPeriod}`)/2, 190);
    
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated: ${date}`, 105 - pdf.getTextWidth(`Generated: ${date}`)/2, 210);
  }
  
  createDimensionsOverview(pdf) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SASB Dimensions Overview', 20, 30);
    
    // SASB dimensions
    const dimensions = [
      {
        title: 'Environment',
        description: 'Natural resources, pollution & waste, climate change',
        color: this.colors.primary
      },
      {
        title: 'Social Capital',
        description: 'Community relations, data security, customer welfare',
        color: this.colors.secondary
      },
      {
        title: 'Human Capital',
        description: 'Labor practices, employee health & safety, diversity',
        color: this.colors.accent
      },
      {
        title: 'Business Model & Innovation',
        description: 'Product design, supply chain, materials sourcing',
        color: this.colors.primary
      },
      {
        title: 'Leadership & Governance',
        description: 'Business ethics, competitive behavior, management',
        color: this.colors.secondary
      }
    ];
    
    let yPos = 70;
    dimensions.forEach(dimension => {
      // Dimension card
      pdf.setFillColor(...this.colors.lightGray);
      pdf.roundedRect(20, yPos, 170, 25, 5, 5, 'F');
      pdf.setDrawColor(...dimension.color);
      pdf.setLineWidth(2);
      pdf.roundedRect(20, yPos, 170, 25, 5, 5, 'S');
      
      // Title
      pdf.setTextColor(...dimension.color);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(dimension.title, 25, yPos + 10);
      
      // Description
      pdf.setTextColor(...this.colors.text);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(dimension.description, 25, yPos + 20);
      
      yPos += 35;
    });
  }
  
  createDataByDimensions(pdf, data) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SASB Performance Data', 20, 30);
    
    // Group data by SASB dimensions
    const dimensionData = this.groupDataByDimensions(data);
    
    // Create table for each dimension with data
    let yPos = 60;
    Object.entries(dimensionData).forEach(([dimension, metrics]) => {
      if (metrics.length > 0) {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setTextColor(...this.colors.text);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(dimension, 20, yPos);
        yPos += 10;
        
        const tableData = metrics.map(metric => [
          metric.sasbMetric || metric.metric || '',
          metric.value || '',
          metric.unit || '',
          metric.description || ''
        ]);
        
        pdf.autoTable({
          head: [['SASB Metric', 'Value', 'Unit', 'Description']],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 9 },
          headStyles: { fillColor: this.colors.primary }
        });
        
        yPos = pdf.lastAutoTable.finalY + 15;
      }
    });
  }
  
  groupDataByDimensions(data) {
    const dimensions = {
      'Environment': [],
      'Social Capital': [],
      'Human Capital': [],
      'Business Model & Innovation': [],
      'Leadership & Governance': []
    };
    
    data.forEach(item => {
      const dimension = item.sasbDimension || this.mapCategoryToDimension(item.category);
      if (dimensions[dimension]) {
        dimensions[dimension].push(item);
      } else {
        // Default to Environment if no mapping found
        dimensions['Environment'].push(item);
      }
    });
    
    return dimensions;
  }
  
  mapCategoryToDimension(category) {
    const mapping = {
      environmental: 'Environment',
      social: 'Social Capital',
      governance: 'Leadership & Governance',
      economic: 'Business Model & Innovation'
    };
    
    return mapping[category] || 'Environment';
  }
  
  download(pdf, filename = 'sasb-report.pdf') {
    pdf.save(filename);
  }
}

export const generateSASBReport = (data, options = {}) => {
  const generator = new SASBReportGenerator(options);
  return generator.generateReport(data);
};

export default SASBReportGenerator;