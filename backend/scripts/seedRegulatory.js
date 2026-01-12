import Regulatory from '../models/Regulatory.js';
import sequelize from '../config/db.js';

const seedRegulatory = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    // Clear existing data
    await Regulatory.destroy({ where: {} });
    
    console.log('✅ All regulatory records removed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedRegulatory();