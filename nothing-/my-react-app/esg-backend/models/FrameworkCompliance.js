import { DataTypes } from 'sequelize';

const FrameworkCompliance = (sequelize) => sequelize.define('framework_compliance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyId: { type: DataTypes.INTEGER, allowNull: false },
  frameworkType: { type: DataTypes.STRING, allowNull: false },
  requirementId: { type: DataTypes.STRING, allowNull: false },
  complianceStatus: { type: DataTypes.STRING, allowNull: false },
  complianceScore: { type: DataTypes.FLOAT, defaultValue: 0 },
  evidenceProvided: { type: DataTypes.TEXT },
  gapAnalysis: { type: DataTypes.TEXT },
  actionPlan: { type: DataTypes.TEXT },
  targetDate: { type: DataTypes.DATE },
  assessmentDate: { type: DataTypes.DATE, allowNull: false },
  assessorId: { type: DataTypes.STRING },
  reportingPeriod: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  indexes: [
    { fields: ['companyId'] },
    { fields: ['frameworkType'] },
    { fields: ['complianceStatus'] }
  ]
});

export default FrameworkCompliance;