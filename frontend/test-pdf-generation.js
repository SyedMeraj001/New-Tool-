import { generateProfessionalWhitePaper } from './src/utils/professionalWhitePaperPDF.js';

// Test the PDF generation with mock data
const testPDFGeneration = async () => {
  try {
    // Mock report data in localStorage
    const mockReportData = [
      { category: 'environmental', metric: 'Carbon Emissions', value: 1250, unit: 'tCO2e' },
      { category: 'environmental', metric: 'Water Usage', value: 5000, unit: 'm3' },
      { category: 'social', metric: 'Employee Safety', value: 95, unit: '%' },
      { category: 'social', metric: 'Diversity Ratio', value: 42, unit: '%' },
      { category: 'governance', metric: 'Board Independence', value: 80, unit: '%' },
      { category: 'governance', metric: 'Ethics Training', value: 100, unit: '%' }
    ];

    // Store mock data
    localStorage.setItem('esg_reports', JSON.stringify([
      { id: 'test-report-001', data: mockReportData }
    ]));

    console.log('Testing PDF generation...');
    
    // Generate PDF
    const pdf = await generateProfessionalWhitePaper('GRI', 'test-report-001', {
      companyName: 'Test Company Ltd',
      reportPeriod: 2024,
      authorName: 'John Doe',
      authorTitle: 'ESG Manager'
    });

    console.log('✅ PDF generated successfully');
    console.log('PDF pages:', pdf.internal.getNumberOfPages());
    
    // Save PDF (in browser environment, this would trigger download)
    if (typeof window !== 'undefined') {
      pdf.save('test-esg-report.pdf');
      console.log('✅ PDF saved as test-esg-report.pdf');
    }

    return true;
  } catch (error) {
    console.error('❌ PDF generation failed:', error.message);
    return false;
  }
};

// Run test
testPDFGeneration().then(success => {
  console.log(success ? '✅ Test passed' : '❌ Test failed');
});