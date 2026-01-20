// routes/reportsRoutes.js - Reports API (ES Modules)
import express from 'express';
import { sequelize } from '../models/index.js';

const router = express.Router();

router.get('/dashboard-summary', async (_req, res) => {
  try {
    const [esgData] = await sequelize.query('SELECT * FROM esg_data ORDER BY "createdAt" DESC');
    const [envData] = await sequelize.query("SELECT AVG(\"metricValue\") as score FROM esg_data WHERE category = 'environmental'");
    const [socData] = await sequelize.query("SELECT AVG(\"metricValue\") as score FROM esg_data WHERE category = 'social'");
    const [govData] = await sequelize.query("SELECT AVG(\"metricValue\") as score FROM esg_data WHERE category = 'governance'");
    
    const env = Math.min(parseFloat(envData[0]?.score) || 0, 100);
    const soc = Math.min(parseFloat(socData[0]?.score) || 0, 100);
    const gov = Math.min(parseFloat(govData[0]?.score) || 0, 100);
    const overall = (env + soc + gov) / 3;

    const [catDist] = await sequelize.query('SELECT category, COUNT(*) as count FROM esg_data GROUP BY category');
    const categoryDistribution = { environmental: 0, social: 0, governance: 0 };
    catDist.forEach(c => {
      if (Object.hasOwn(categoryDistribution, c.category)) {
        categoryDistribution[c.category] = parseInt(c.count);
      }
    });

    const [companies] = await sequelize.query('SELECT "companyName", COUNT(*) as entries FROM esg_data GROUP BY "companyName"');
    const [trends] = await sequelize.query("SELECT DATE_TRUNC('month', \"createdAt\") as month, COUNT(*) as entries FROM esg_data GROUP BY DATE_TRUNC('month', \"createdAt\") ORDER BY month DESC LIMIT 12");

    res.json({
      success: true,
      data: {
        comprehensive: {
          totalEntries: esgData.length,
          companies: companies,
          categoryDistribution: categoryDistribution,
          recentData: esgData.slice(0, 10)
        },
        performance: {
          overall: Math.round(overall),
          environmental: Math.round(env),
          social: Math.round(soc),
          governance: Math.round(gov),
          trends: trends
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { type } = req.body;
    const [esgData] = await sequelize.query('SELECT * FROM esg_data ORDER BY "createdAt" DESC');
    const [envData] = await sequelize.query("SELECT AVG(\"metricValue\") as score FROM esg_data WHERE category = 'environmental'");
    const [socData] = await sequelize.query("SELECT AVG(\"metricValue\") as score FROM esg_data WHERE category = 'social'");
    const [govData] = await sequelize.query("SELECT AVG(\"metricValue\") as score FROM esg_data WHERE category = 'governance'");

    const env = Math.round(Math.min(parseFloat(envData[0]?.score) || 0, 100));
    const soc = Math.round(Math.min(parseFloat(socData[0]?.score) || 0, 100));
    const gov = Math.round(Math.min(parseFloat(govData[0]?.score) || 0, 100));

    res.json({
      success: true,
      data: {
        reportType: type,
        generatedAt: new Date().toISOString(),
        summary: {
          totalRecords: esgData.length,
          environmental: env,
          social: soc,
          governance: gov,
          overall: Math.round((env + soc + gov) / 3)
        },
        records: esgData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
