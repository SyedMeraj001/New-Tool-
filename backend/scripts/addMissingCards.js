import sequelize from '../config/db.js';
import Compliance from '../models/Compliance.js';

const addMissingCards = async () => {
  try {
    console.log('🔄 Adding SFDR and SEC Climate Rules...');
    
    const missingCards = [
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
        notes: 'SEC rules requiring public companies to disclose climate-related risks and greenhouse gas emissions'
      }
    ];
    
    await Compliance.bulkCreate(missingCards);
    
    console.log('✅ SFDR and SEC Climate Rules added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addMissingCards();