const { DataTypes } = require("sequelize");
const sequelize = require("../server");

const ComplianceDocument = sequelize.define("ComplianceDocument", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  priority: { type: DataTypes.STRING },
  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  due_date: { type: DataTypes.DATE },
  progress: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING }
}, {
  tableName: "compliance_documents",
  timestamps: false,
});

module.exports = ComplianceDocument;
