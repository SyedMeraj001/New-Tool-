import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Regulatory = sequelize.define('Regulatory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Compliant', 'In Progress', 'Review Required', 'Pending'),
    defaultValue: 'Pending'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  priority: {
    type: DataTypes.ENUM('Critical', 'High', 'Medium', 'Low'),
    defaultValue: 'Medium'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: '📋'
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: 'blue'
  },
  notes: {
    type: DataTypes.TEXT
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'regulatory_records',
  timestamps: true
});

export default Regulatory;