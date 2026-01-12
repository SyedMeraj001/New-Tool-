import sequelize from '../config/db.js';
import { seedCompliance } from '../seed/complianceSeed.js';

const reseedCompliance = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    console.log('🔄 Reseeding compliance data...');
    await seedCompliance();
    
    console.log('✅ Compliance data reseeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reseeding compliance data:', error);
    process.exit(1);
  }
};

reseedCompliance();