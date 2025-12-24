import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class TCFDReportGenerator {
  constructor(options = {}) {
    this.options = {
      companyName: 'Company Name',
      reportPeriod: new Date().getFullYear(),
      ...options
    };
    
    this.colors = {
      primary: [255, 152, 0],
      secondary: [255, 193, 7],
      accent: [255, 235, 59],
      text: [51, 51, 51],
      lightGray: [248, 249, 250]
    };
  }
  
  generateReport(data) {
    const pdf = new jsPDF();
    
    // Cover page
    this.createCoverPage(pdf);
    
    // TCFD pillars overview
    pdf.addPage();
    this.createPillarsOverview(pdf);
    
    // Data by pillars
    if (data && data.length > 0) {
      pdf.addPage();
      this.createDataByPillars(pdf, data);
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
    pdf.text('TCFD Report', 105 - pdf.getTextWidth('TCFD Report')/2, 80);
    
    pdf.setFontSize(18);
    pdf.text('Task Force on Climate-related', 105 - pdf.getTextWidth('Task Force on Climate-related')/2, 100);
    pdf.text('Financial Disclosures', 105 - pdf.getTextWidth('Financial Disclosures')/2, 120);
    
    // Company info
    pdf.setFontSize(20);
    pdf.text(this.options.companyName, 105 - pdf.getTextWidth(this.options.companyName)/2, 160);
    
    pdf.setFontSize(14);
    pdf.text(`Reporting Period: ${this.options.reportPeriod}`, 105 - pdf.getTextWidth(`Reporting Period: ${this.options.reportPeriod}`)/2, 180);
    
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated: ${date}`, 105 - pdf.getTextWidth(`Generated: ${date}`)/2, 200);
  }
  
  createPillarsOverview(pdf) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TCFD Pillars Overview', 20, 30);
    
    // TCFD pillars with recommendations
    const pillars = [
      {
        title: 'Governance',
        recommendations: [
          'Board oversight of climate-related risks and opportunities',
          'Management\'s role in assessing and managing climate-related risks'
        ],
        color: this.colors.primary
      },
      {
        title: 'Strategy',
        recommendations: [
          'Climate-related risks and opportunities identified',
          'Impact on business, strategy, and financial planning',
          'Resilience of strategy under different climate scenarios'
        ],
        color: this.colors.secondary
      },
      {
        title: 'Risk Management',
        recommendations: [
          'Processes for identifying and assessing climate-related risks',
          'Processes for managing climate-related risks',
          'Integration into overall risk management'
        ],
        color: this.colors.accent
      },
      {
        title: 'Metrics and Targets',
        recommendations: [
          'Metrics used to assess climate-related risks and opportunities',
          'Scope 1, 2, and 3 greenhouse gas emissions',
          'Targets used to manage climate-related risks and opportunities'
        ],
        color: this.colors.primary
      }
    ];
    
    let yPos = 70;
    pillars.forEach(pillar => {
      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Pillar header
      pdf.setFillColor(...pillar.color);
      pdf.roundedRect(20, yPos, 170, 15, 3, 3, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(pillar.title, 25, yPos + 9);
      
      yPos += 20;
      
      // Recommendations
      pdf.setTextColor(...this.colors.text);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      pillar.recommendations.forEach(recommendation => {
        pdf.text(`• ${recommendation}`, 25, yPos);
        yPos += 10;
      });
      
      yPos += 10;
    });
  }
  
  createDataByPillars(pdf, data) {
    // Header
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TCFD Performance Data', 20, 30);
    
    // Group data by TCFD pillars
    const pillarData = this.groupDataByPillars(data);
    
    // Create table for each pillar with data
    let yPos = 60;
    Object.entries(pillarData).forEach(([pillar, metrics]) => {
      if (metrics.length > 0) {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setTextColor(...this.colors.text);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(pillar, 20, yPos);
        yPos += 10;
        
        const tableData = metrics.map(metric => [
          metric.tcfdRecommendation || metric.metric || '',
          metric.value || '',
          metric.unit || '',
          metric.description || ''
        ]);
        
        pdf.autoTable({
          head: [['TCFD Recommendation', 'Value', 'Unit', 'Description']],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 9 },
          headStyles: { fillColor: this.colors.primary }
        });
        
        yPos = pdf.lastAutoTable.finalY + 15;
      }
    });
  }
  
  groupDataByPillars(data) {
    const pillars = {
      'Governance': [],
      'Strategy': [],
      'Risk Management': [],
      'Metrics and Targets': []
    };
    
    data.forEach(item => {
      const pillar = item.tcfdPillar || this.mapCategoryToPillar(item.category);
      if (pillars[pillar]) {
        pillars[pillar].push(item);
      } else {
        // Default to Metrics and Targets if no mapping found
        pillars['Metrics and Targets'].push(item);
      }
    });
    
    return pillars;
  }
  
  mapCategoryToPillar(category) {
    const mapping = {
      environmental: 'Metrics and Targets',
      social: 'Strategy',
      governance: 'Governance',
      economic: 'Risk Management'
    };
    
    return mapping[category] || 'Metrics and Targets';
  }
  
  download(pdf, filename = 'tcfd-report.pdf') {
    pdf.save(filename);
  }
}

export const generateTCFDReport = (data, options = {}) => {
  const generator = new TCFDReportGenerator(options);
  return generator.generateReport(data);
};

export default TCFDReportGenerator;