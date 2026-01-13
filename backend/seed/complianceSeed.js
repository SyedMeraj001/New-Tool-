import Compliance from '../models/Compliance.js';

const sampleCompliances = [
  {
    name: 'EU Taxonomy',
    description: 'EU Sustainable Finance Taxonomy - Classification system for environmentally sustainable economic activities',
    category: 'Environmental',
    status: 'In Progress',
    progress: 72,
    deadline: new Date('2024-12-31'),
    notes: 'Classification system for environmentally sustainable economic activities'
  },
  {
    name: 'CSRD',
    description: 'Corporate Sustainability Reporting Directive',
    category: 'Reporting',
    status: 'In Progress',
    progress: 72,
    deadline: new Date('2024-06-30'),
    notes: 'EU directive requiring companies to report on sustainability matters'
  },
  {
    name: 'SFDR',
    description: 'Sustainable Finance Disclosure Regulation',
    category: 'Environmental',
    status: 'In Progress',
    progress: 72,
    deadline: new Date('2024-09-15'),
    notes: 'EU regulation on sustainability-related disclosures in the financial services sector'
  },
  {
    name: 'SEC Climate Rules',
    description: 'SEC Climate-Related Disclosures',
    category: 'Environmental',
    status: 'In Progress',
    progress: 72,
    deadline: new Date('2024-11-30'),
    notes: 'US SEC rules requiring climate-related risk disclosures'
  }
];

export const seedCompliance = async () => {
  try {
    // Clear existing data
    await Compliance.destroy({ where: {} });
    
    // Insert sample data with proper timestamps
    const compliancesWithTimestamps = sampleCompliances.map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    await Compliance.bulkCreate(compliancesWithTimestamps);
    
    console.log('✅ Compliance data seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error seeding compliance data:', error);
    return false;
  }
};

export default seedCompliance;