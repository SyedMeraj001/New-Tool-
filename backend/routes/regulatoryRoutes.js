import express from 'express';
import { getAllRegulatory, createRegulatory, updateRegulatory, deleteRegulatory } from '../controllers/regulatoryController.js';
import Regulatory from '../models/Regulatory.js';

const router = express.Router();



// GET /api/regulatory - Get all regulatory records
router.get('/', getAllRegulatory);



// GET /api/regulatory/compliance/:companyId - Get compliance summary for a company
router.get('/compliance/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const RegulatoryComplianceCalculator = (await import('../utils/regulatoryComplianceCalculator.js')).default;

    const summary = await RegulatoryComplianceCalculator.getComplianceSummary(companyId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get compliance summary',
      error: error.message
    });
  }
});

// POST /api/regulatory/update-compliance/:companyId - Update compliance scores based on ESG data
router.post('/update-compliance/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const RegulatoryComplianceCalculator = (await import('../utils/regulatoryComplianceCalculator.js')).default;

    const updates = await RegulatoryComplianceCalculator.updateAllRegulatoryCompliance(companyId);

    res.json({
      success: true,
      message: 'Compliance scores updated successfully',
      data: updates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update compliance scores',
      error: error.message
    });
  }
});

// POST /api/regulatory - Create new regulatory record
router.post('/', createRegulatory);

// PUT /api/regulatory/:id - Update regulatory record
router.put('/:id', updateRegulatory);

// DELETE /api/regulatory/:id - Delete regulatory record
router.delete('/:id', deleteRegulatory);

export default router;