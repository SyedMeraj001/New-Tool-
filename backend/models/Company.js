import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  reporting_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sector: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  primary_reporting_framework: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'GRI'
  },
  assurance_level: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "companies",
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Company;
