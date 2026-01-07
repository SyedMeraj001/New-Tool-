// routes/kpiRoutes.js - KPI Dashboard API (ES Modules)
import express from 'express';
import { sequelize } from '../models/index.js';

const router = express.Router();

router.get('/:companyId', async (_req, res) => {
  try {
    const [envData] = await sequelize.query('SELECT AVG("metricValue") as score FROM esg_data WHERE category = $1', { bind: ['environmental'] });
    const [socData] = await sequelize.query('SELECT AVG("metricValue") as score FROM esg_data WHERE category = $1', { bind: ['social'] });
    const [govData] = await sequelize.query('SELECT AVG("metricValue") as score FROM esg_data WHERE category = $1', { bind: ['governance'] });
    const [countData] = await sequelize.query('SELECT COUNT(*) as total FROM esg_data');
    const [approvedCount] = await sequelize.query("SELECT COUNT(*) as approved FROM esg_data WHERE status = 'approved'");

    const env = Math.min(parseFloat(envData[0]?.score) || 0, 100);
    const soc = Math.min(parseFloat(socData[0]?.score) || 0, 100);
    const gov = Math.min(parseFloat(govData[0]?.score) || 0, 100);
    const overall = (env + soc + gov) / 3;
    const total = parseInt(countData[0]?.total) || 0;
    const approved = parseInt(approvedCount[0]?.approved) || 0;
    const complianceRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        overall: Math.round(overall),
        environmental: Math.round(env),
        social: Math.round(soc),
        governance: Math.round(gov),
        complianceRate: complianceRate,
        totalEntries: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
