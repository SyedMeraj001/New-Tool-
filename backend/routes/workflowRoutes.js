// routes/workflowRoutes.js (ES Modules)
import express from 'express';
import * as workflowService from '../services/workflowService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, submittedBy } = req.query;
    const workflows = await workflowService.getWorkflows({ status, submittedBy });
    res.json({ success: true, data: workflows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const workflow = await workflowService.getWorkflowById(req.params.id);
    if (!workflow) return res.status(404).json({ success: false, error: 'Workflow not found' });
    res.json({ success: true, data: workflow });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, submittedBy, esgDataId, metadata } = req.body;
    const result = await workflowService.createWorkflow({ title, submittedBy, esgDataId, metadata });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/approve', async (req, res) => {
  try {
    const { level, approver, comments } = req.body;
    const workflow = await workflowService.approveStep(req.params.id, level, approver, comments);
    res.json({ success: true, data: workflow });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/:id/reject', async (req, res) => {
  try {
    const { level, approver, reason } = req.body;
    const workflow = await workflowService.rejectStep(req.params.id, level, approver, reason);
    res.json({ success: true, data: workflow });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/audit/logs', async (req, res) => {
  try {
    const { userId, category, limit } = req.query;
    const logs = await workflowService.getAuditLogs({ userId, category, limit: parseInt(limit) || 100 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/notifications/:userId', async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const notifications = await workflowService.getNotifications(req.params.userId, unreadOnly === 'true');
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const notification = await workflowService.markNotificationRead(req.params.id);
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
