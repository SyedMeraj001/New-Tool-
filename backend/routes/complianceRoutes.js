import express from 'express';
import Compliance from '../models/Compliance.js';
import Company from '../models/Company.js';
import { Op } from 'sequelize';
import { validateCompliance } from '../controllers/complianceController.js';

const router = express.Router();

// GET /api/compliance - Get compliance overview
router.get('/', async (req, res) => {
  try {
    const regulations = await Compliance.findAll({
      order: [['createdAt', 'DESC']]
    });

    const summary = {
      compliant: regulations.filter(r => r.status === 'Compliant').length,
      inProgress: regulations.filter(r => r.status === 'In Progress').length,
      reviewRequired: regulations.filter(r => r.status === 'Review Required').length,
      pending: regulations.filter(r => r.status === 'Pending').length,
      overallCompliance: regulations.length > 0 ? 
        Math.round(regulations.reduce((sum, reg) => sum + reg.progress, 0) / regulations.length) : 0
    };

    res.json({
      success: true,
      data: {
        summary,
        regulations,
        quickActions: [
          { id: 'compliance-dashboard', name: 'Compliance Dashboard', icon: '📊' },
          { id: 'generate-reports', name: 'Generate Reports', icon: '📋' },
          { id: 'risk-assessment', name: 'Risk Assessment', icon: '⚠️' }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching compliance data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance data',
      error: error.message
    });
  }
});

// GET /api/compliance/regulations - Get all regulations
router.get('/regulations', async (req, res) => {
  try {
    const { status, category } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const regulations = await Compliance.findAll({
      where: whereClause,
      order: [['deadline', 'ASC']]
    });

    res.json({
      success: true,
      data: regulations
    });
  } catch (error) {
    console.error('Error fetching regulations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regulations',
      error: error.message
    });
  }
});

// GET /api/compliance/regulations/:id - Get specific regulation
router.get('/regulations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const regulation = await Compliance.findByPk(id);

    if (!regulation) {
      return res.status(404).json({
        success: false,
        message: 'Regulation not found'
      });
    }

    res.json({
      success: true,
      data: regulation
    });
  } catch (error) {
    console.error('Error fetching regulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regulation',
      error: error.message
    });
  }
});

// PUT /api/compliance/regulations/:id - Update regulation
router.put('/regulations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, notes } = req.body;

    const regulation = await Compliance.findByPk(id);
    if (!regulation) {
      return res.status(404).json({
        success: false,
        message: 'Regulation not found'
      });
    }

    await regulation.update({
      status: status || regulation.status,
      progress: progress !== undefined ? progress : regulation.progress,
      notes: notes || regulation.notes
    });

    res.json({
      success: true,
      data: regulation,
      message: 'Regulation updated successfully'
    });
  } catch (error) {
    console.error('Error updating regulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update regulation',
      error: error.message
    });
  }
});

// POST /api/compliance/regulations - Add new regulation
router.post('/regulations', async (req, res) => {
  try {
    const { name, description, category, deadline, status = 'Pending', company_id } = req.body;

    if (!name || !description || !category || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, category, deadline'
      });
    }

    const regulation = await Compliance.create({
      name,
      description,
      category,
      deadline,
      status,
      company_id
    });

    res.status(201).json({
      success: true,
      data: regulation,
      message: 'Regulation added successfully'
    });
  } catch (error) {
    console.error('Error adding regulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add regulation',
      error: error.message
    });
  }
});

// DELETE /api/compliance/regulations/:id - Delete regulation
router.delete('/regulations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const regulation = await Compliance.findByPk(id);

    if (!regulation) {
      return res.status(404).json({
        success: false,
        message: 'Regulation not found'
      });
    }

    await regulation.destroy();

    res.json({
      success: true,
      message: 'Regulation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting regulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete regulation',
      error: error.message
    });
  }
});

// GET /api/compliance/summary - Get compliance summary
router.get('/summary', async (req, res) => {
  try {
    const regulations = await Compliance.findAll();
    
    const summary = {
      compliant: regulations.filter(r => r.status === 'Compliant').length,
      inProgress: regulations.filter(r => r.status === 'In Progress').length,
      reviewRequired: regulations.filter(r => r.status === 'Review Required').length,
      pending: regulations.filter(r => r.status === 'Pending').length,
      overallCompliance: regulations.length > 0 ? 
        Math.round(regulations.reduce((sum, reg) => sum + reg.progress, 0) / regulations.length) : 0
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching compliance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance summary',
      error: error.message
    });
  }
});

// POST /api/compliance/create-for-company/:companyId - Create compliance records for existing company
router.post('/create-for-company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Get company data
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    // Create basic compliance records
    const regulations = [
      {
        name: 'GRI Standards',
        description: 'Global Reporting Initiative Standards',
        category: 'Reporting',
        status: 'Pending',
        progress: 0,
        deadline: new Date('2024-12-31'),
        notes: 'Global standards for sustainability reporting',
        company_id: companyId
      },
      {
        name: 'ESG Disclosure',
        description: 'Environmental Social Governance Disclosure',
        category: 'Environmental',
        status: 'Pending',
        progress: 0,
        deadline: new Date('2024-06-30'),
        notes: 'Comprehensive ESG reporting requirements',
        company_id: companyId
      }
    ];
    
    await Compliance.bulkCreate(regulations);
    
    res.json({
      success: true,
      message: `Created ${regulations.length} compliance records for ${company.company_name}`
    });
  } catch (error) {
    console.error('Error creating compliance records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create compliance records',
      error: error.message
    });
  }
});

// GET /api/compliance/requirements - Get compliance requirements
router.get('/requirements', async (req, res) => {
  try {
    const regulations = await Compliance.findAll({
      order: [['deadline', 'ASC']]
    });
    
    const requirements = regulations.map(reg => ({
      id: reg.id,
      name: reg.name,
      framework: 'EU Taxonomy',
      category: reg.category,
      status: reg.status,
      progress: reg.progress,
      due_date: reg.deadline ? new Date(reg.deadline).toLocaleDateString('en-GB') : 'No deadline',
      deadline: reg.deadline,
      createdAt: reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
      description: reg.description,
      notes: reg.notes
    }));
    
    res.json(requirements);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requirements',
      error: error.message
    });
  }
});

export default router;