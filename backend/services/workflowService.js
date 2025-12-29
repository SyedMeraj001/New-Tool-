// services/workflowService.js - 4-Level Approval Workflow
const crypto = require("crypto");
const { ApprovalWorkflow, ApprovalStep, AuditLog, Notification, sequelize } = require("../models");

const APPROVAL_LEVELS = [
  { level: 1, role: "SITE", description: "Site Level Approval" },
  { level: 2, role: "BUSINESS_UNIT", description: "Business Unit Approval" },
  { level: 3, role: "GROUP_ESG", description: "Group ESG Approval" },
  { level: 4, role: "EXECUTIVE", description: "Executive Approval" },
];

const generateHash = (data, previousHash) => {
  const content = JSON.stringify(data) + (previousHash || "") + Date.now();
  return crypto.createHash("sha256").update(content).digest("hex");
};

const createWorkflow = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const workflow = await ApprovalWorkflow.create({
      title: data.title,
      submittedBy: data.submittedBy,
      esgDataId: data.esgDataId,
      metadata: data.metadata || {},
    }, { transaction });

    await Promise.all(APPROVAL_LEVELS.map(level => 
      ApprovalStep.create({
        workflowId: workflow.id,
        level: level.level,
        approverRole: level.role,
      }, { transaction })
    ));

    await createAuditLog({
      action: "WORKFLOW_CREATED",
      userId: data.submittedBy,
      category: "workflow",
      details: "Workflow " + data.title + " created",
      metadata: { workflowId: workflow.id },
    }, transaction);

    await Notification.create({
      userId: "site_approvers",
      title: "New Approval Request",
      message: "New workflow " + data.title + " requires Site Level approval",
      type: "info",
      workflowId: workflow.id,
    }, { transaction });

    await transaction.commit();
    return await getWorkflowById(workflow.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const approveStep = async (workflowId, level, approver, comments) => {
  const transaction = await sequelize.transaction();
  try {
    const workflow = await ApprovalWorkflow.findByPk(workflowId, {
      include: [{ model: ApprovalStep, as: "steps" }],
      transaction,
    });

    if (!workflow) throw new Error("Workflow not found");
    if (workflow.status !== "pending") throw new Error("Workflow is not pending");
    if (workflow.currentLevel !== level) throw new Error("Cannot approve level " + level);

    const step = workflow.steps.find(s => s.level === level);
    await step.update({ status: "approved", approver, comments: comments || "", actionAt: new Date() }, { transaction });

    if (level === 4) {
      await workflow.update({ status: "approved", currentLevel: 4 }, { transaction });
    } else {
      await workflow.update({ currentLevel: level + 1 }, { transaction });
      const nextLevel = APPROVAL_LEVELS.find(l => l.level === level + 1);
      await Notification.create({
        userId: nextLevel.role.toLowerCase() + "_approvers",
        title: "Approval Required",
        message: "Workflow " + workflow.title + " requires " + nextLevel.description,
        type: "info",
        workflowId: workflow.id,
      }, { transaction });
    }

    await createAuditLog({
      action: "STEP_APPROVED",
      userId: approver,
      category: "workflow",
      details: "Level " + level + " approved for " + workflow.title,
      metadata: { workflowId, level, comments },
    }, transaction);

    await transaction.commit();
    return await getWorkflowById(workflowId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const rejectStep = async (workflowId, level, approver, reason) => {
  const transaction = await sequelize.transaction();
  try {
    const workflow = await ApprovalWorkflow.findByPk(workflowId, {
      include: [{ model: ApprovalStep, as: "steps" }],
      transaction,
    });

    if (!workflow) throw new Error("Workflow not found");
    const step = workflow.steps.find(s => s.level === level);
    
    await step.update({ status: "rejected", approver, comments: reason, actionAt: new Date() }, { transaction });
    await workflow.update({ status: "rejected" }, { transaction });

    await Notification.create({
      userId: workflow.submittedBy,
      title: "Workflow Rejected",
      message: "Workflow " + workflow.title + " rejected at level " + level + ". Reason: " + reason,
      type: "error",
      workflowId: workflow.id,
    }, { transaction });

    await createAuditLog({
      action: "STEP_REJECTED",
      userId: approver,
      category: "workflow",
      details: "Level " + level + " rejected. Reason: " + reason,
      metadata: { workflowId, level, reason },
    }, transaction);

    await transaction.commit();
    return await getWorkflowById(workflowId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getWorkflowById = async (id) => {
  return await ApprovalWorkflow.findByPk(id, {
    include: [{ model: ApprovalStep, as: "steps" }],
  });
};

const getWorkflows = async (filters) => {
  const where = {};
  if (filters && filters.status) where.status = filters.status;
  if (filters && filters.submittedBy) where.submittedBy = filters.submittedBy;
  return await ApprovalWorkflow.findAll({
    where,
    include: [{ model: ApprovalStep, as: "steps" }],
    order: [["createdAt", "DESC"]],
  });
};

const createAuditLog = async (data, transaction) => {
  const lastLog = await AuditLog.findOne({ order: [["createdAt", "DESC"]], transaction });
  const previousHash = lastLog ? lastLog.hash : "0";
  const hash = generateHash(data, previousHash);
  return await AuditLog.create({ ...data, previousHash, hash }, { transaction });
};

const getAuditLogs = async (filters) => {
  const where = {};
  if (filters && filters.userId) where.userId = filters.userId;
  if (filters && filters.category) where.category = filters.category;
  return await AuditLog.findAll({ where, order: [["createdAt", "DESC"]], limit: (filters && filters.limit) || 100 });
};

const getNotifications = async (userId, unreadOnly) => {
  const where = { userId };
  if (unreadOnly) where.read = false;
  return await Notification.findAll({ where, order: [["createdAt", "DESC"]] });
};

const markNotificationRead = async (id) => {
  const notification = await Notification.findByPk(id);
  if (notification) await notification.update({ read: true });
  return notification;
};

module.exports = {
  APPROVAL_LEVELS,
  createWorkflow,
  approveStep,
  rejectStep,
  getWorkflowById,
  getWorkflows,
  createAuditLog,
  getAuditLogs,
  getNotifications,
  markNotificationRead,
};
