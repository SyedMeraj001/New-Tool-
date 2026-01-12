import Compliance from '../models/Compliance.js';

export const createComplianceRecords = async (companyId, companyData) => {
  try {
    console.log('Creating compliance records for company:', companyId);
    console.log('Company data received:', companyData);
    
    if (!companyData) {
      console.log('No company data provided, skipping compliance creation');
      return true;
    }
    
    // Clear existing dummy records for this company
    await Compliance.destroy({ where: { company_id: companyId } });
    
    // Determine applicable regulations based on company sector and region
    const regulations = [];
    
    // EU regulations for European companies OR mining companies
    if (companyData.region === 'europe' || companyData.sector === 'mining') {
      regulations.push({
        name: 'EU Taxonomy',
        description: 'EU Sustainable Finance Taxonomy',
        category: 'Environmental',
        deadline: new Date('2024-12-31'),
        notes: 'Classification system for environmentally sustainable economic activities'
      });
      
      regulations.push({
        name: 'CSRD',
        description: 'Corporate Sustainability Reporting Directive', 
        category: 'Reporting',
        deadline: new Date('2024-06-30'),
        notes: 'EU directive requiring companies to report on sustainability matters'
      });
      
      regulations.push({
        name: 'SFDR',
        description: 'Sustainable Finance Disclosure Regulation',
        category: 'Environmental', 
        deadline: new Date('2024-09-15'),
        notes: 'EU regulation on sustainability-related disclosures in the financial services sector'
      });
    }
    
    // US regulations for North American companies
    if (companyData.region === 'north-america') {
      regulations.push({
        name: 'SEC Climate Rules',
        description: 'SEC Climate-Related Disclosures',
        category: 'Environmental',
        deadline: new Date('2024-11-30'), 
        notes: 'SEC rules requiring public companies to disclose climate-related risks'
      });
    }
    
    // Global regulations for all companies
    regulations.push({
      name: 'GRI Standards',
      description: 'Global Reporting Initiative Standards',
      category: 'Reporting',
      deadline: new Date('2024-12-31'),
      notes: 'Global standards for sustainability reporting'
    });
    
    if (regulations.length === 0) {
      console.log('No regulations to create for this company');
      return true;
    }
    
    // Create compliance records with initial 0% progress
    const complianceRecords = regulations.map(reg => ({
      ...reg,
      status: 'Pending',
      progress: 0,
      company_id: companyId
    }));
    
    console.log('Creating compliance records:', complianceRecords.length);
    const created = await Compliance.bulkCreate(complianceRecords);
    
    console.log(`✅ Created ${created.length} compliance records for company ${companyId}`);
    return true;
  } catch (error) {
    console.error('❌ Error creating compliance records:', error);
    throw error;
  }
};