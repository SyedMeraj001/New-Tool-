const { DataTypes } = require("sequelize");
const sequelize = require("../server");

const ComplianceRequirement = sequelize.define("ComplianceRequirement", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  due_date: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
}, {
  tableName: "compliance_requirements",
  timestamps: false,
});

module.exports = ComplianceRequirement;
