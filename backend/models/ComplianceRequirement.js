import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ComplianceRequirement = sequelize.define("ComplianceRequirement", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  }
}, {
  tableName: "compliance_requirements",
  timestamps: false
});

export default ComplianceRequirement;
