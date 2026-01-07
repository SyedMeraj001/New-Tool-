import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ComplianceDocument = sequelize.define("ComplianceDocument", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  }
}, {
  tableName: "compliance_documents",
  timestamps: true,
  createdAt: 'uploaded_at',
  updatedAt: 'updated_at'
});

export default ComplianceDocument;
