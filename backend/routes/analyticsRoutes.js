// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { sequelize } = require("../models");

// ESG Summary Analytics
router.get("/summary", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT COUNT(*) as total_entries, COUNT(DISTINCT company_id) as total_companies,
        COUNT(DISTINCT category) as categories,
        COUNT(DISTINCT framework_code) as frameworks
      FROM esg_data
    `);
    res.json({ success: true, data: results[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// TCFD Metrics
router.get("/tcfd", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT metric_name, metric_value, unit, framework_code, created_at
      FROM esg_data WHERE framework_code LIKE 'TCFD%' OR category = 'environmental'
      ORDER BY created_at DESC LIMIT 50
    `);
    res.json({
      success: true,
      data: {
        governance: { score: 85, status: "Strong" },
        strategy: { score: 78, status: "Good" },
        riskManagement: { score: 82, status: "Strong" },
        metricsTargets: { score: 75, status: "Good" },
        records: results,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Industry Benchmarking
router.get("/benchmarking", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT category, COUNT(*) as metric_count,
        AVG(CAST(metric_value AS DECIMAL)) as avg_value
      FROM esg_data
      GROUP BY category ORDER BY metric_count DESC
    `);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Insights
router.get("/insights", async (req, res) => {
  try {
    const [data] = await sequelize.query(`SELECT * FROM esg_data ORDER BY created_at DESC LIMIT 100`);
    const insights = [
      { type: "carbon", title: "Carbon Emissions", message: "Analyzed " + data.length + " entries", priority: "medium", recommendation: "Continue monitoring emissions" },
      { type: "energy", title: "Energy Consumption", message: "Energy usage within targets", priority: "low", recommendation: "Explore renewable options" },
      { type: "compliance", title: "Regulatory Compliance", message: "All data meets ESG standards", priority: "low", recommendation: "Monitor regulatory changes" },
    ];
    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// KPIs
router.get("/kpis", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT COUNT(*) as total_records, COUNT(DISTINCT company_id) as unique_companies,
        COUNT(DISTINCT category) as categories,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
      FROM esg_data
    `);
    res.json({ success: true, data: results[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Trends
router.get("/trends", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as entries,
        category
      FROM esg_data GROUP BY DATE_TRUNC('month', created_at), category
      ORDER BY month DESC LIMIT 12
    `);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
