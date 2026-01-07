// ================================
// models/index.js - Sequelize Models (ES Modules)
// ================================

import { Sequelize, DataTypes } from 'sequelize';
import crypto from 'crypto';
import 'dotenv/config';

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

// Generate secure session token
const generateSessionToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

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

// UserSession Model (Secure Sessions)
const UserSession = sequelize.define('UserSession', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  token: { type: DataTypes.STRING(128), allowNull: false, unique: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  ipAddress: { type: DataTypes.STRING, allowNull: true },
  userAgent: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'user_sessions', timestamps: true });

// UserPreference Model
const UserPreference = sequelize.define('UserPreference', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  theme: { type: DataTypes.STRING, defaultValue: 'light' },
  companyName: { type: DataTypes.STRING, allowNull: true },
  currentSector: { type: DataTypes.STRING, defaultValue: 'manufacturing' },
  twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  twoFactorMethod: { type: DataTypes.STRING, allowNull: true },
  encryptionEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  settings: { type: DataTypes.JSONB, defaultValue: {} },
}, { tableName: 'user_preferences', timestamps: true });

// ValidationResult Model
const ValidationResult = sequelize.define('ValidationResult', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  completeness: { type: DataTypes.INTEGER, defaultValue: 0 },
  errors: { type: DataTypes.JSONB, defaultValue: [] },
  warnings: { type: DataTypes.JSONB, defaultValue: [] },
  suggestions: { type: DataTypes.JSONB, defaultValue: [] },
  details: { type: DataTypes.JSONB, defaultValue: {} },
}, { tableName: 'validation_results', timestamps: true });

// SafetyCompliance Model
const SafetyCompliance = sequelize.define('SafetyCompliance', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  riskGuidelines: { type: DataTypes.JSONB, defaultValue: [] },
  emergencyContacts: { type: DataTypes.JSONB, defaultValue: [] },
  travelInsurances: { type: DataTypes.JSONB, defaultValue: [] },
  documents: { type: DataTypes.JSONB, defaultValue: [] },
  safetyChecklist: { type: DataTypes.JSONB, defaultValue: [] },
  healthTips: { type: DataTypes.JSONB, defaultValue: [] },
  travelTips: { type: DataTypes.JSONB, defaultValue: [] },
}, { tableName: 'safety_compliance', timestamps: true });

// Relationships
ApprovalWorkflow.hasMany(ApprovalStep, { foreignKey: 'workflowId', as: 'steps' });
ApprovalStep.belongsTo(ApprovalWorkflow, { foreignKey: 'workflowId' });

export { 
  sequelize, 
  ApprovalWorkflow, 
  ApprovalStep, 
  AuditLog, 
  Notification,
  UserSession,
  UserPreference,
  ValidationResult,
  SafetyCompliance,
  generateSessionToken
};
