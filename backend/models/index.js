// ================================
// models/index.js - Sequelize Models
// ================================

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// ApprovalWorkflow Model
const ApprovalWorkflow = sequelize.define('ApprovalWorkflow', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  submittedBy: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  currentLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
  esgDataId: { type: DataTypes.INTEGER, allowNull: true },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
}, { tableName: 'approval_workflows', timestamps: true });

// ApprovalStep Model
const ApprovalStep = sequelize.define('ApprovalStep', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workflowId: { type: DataTypes.UUID, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false },
  approverRole: { type: DataTypes.STRING, allowNull: false },
  approver: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  comments: { type: DataTypes.TEXT, allowNull: true },
  actionAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'approval_steps', timestamps: true });

// AuditLog Model
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  action: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'system' },
  details: { type: DataTypes.TEXT, allowNull: true },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
  ipAddress: { type: DataTypes.STRING, allowNull: true },
  previousHash: { type: DataTypes.STRING, allowNull: true },
  hash: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'audit_logs', timestamps: true });

// Notification Model
const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM('info', 'success', 'warning', 'error'), defaultValue: 'info' },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
  workflowId: { type: DataTypes.UUID, allowNull: true },
}, { tableName: 'notifications', timestamps: true });

// Relationships
ApprovalWorkflow.hasMany(ApprovalStep, { foreignKey: 'workflowId', as: 'steps' });
ApprovalStep.belongsTo(ApprovalWorkflow, { foreignKey: 'workflowId' });

module.exports = { sequelize, ApprovalWorkflow, ApprovalStep, AuditLog, Notification };
