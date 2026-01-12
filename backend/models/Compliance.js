import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Compliance = sequelize.define('Compliance', {
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
    defaultValue: 'gray'
  },
  notes: {
    type: DataTypes.TEXT
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'companies',
      key: 'id'
    }
  }
}, {
  tableName: 'compliance_records',
  timestamps: true
});

export default Compliance;