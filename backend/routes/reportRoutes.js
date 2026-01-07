import express from "express";

const router = express.Router();

// Get dashboard summary
router.get("/dashboard-summary", async (req, res) => {
  try {
    const summaryData = {
      totalReports: 12,
      completedReports: 8,
      pendingReports: 4,
      complianceRate: 85,
      comprehensive: {
        totalReports: 5,
        completedReports: 3,
        pendingReports: 2
      },
      performance: {
        overallScore: 78,
        trend: "improving"
      },
      lastUpdated: new Date().toISOString()
    };

    res.json({ success: true, data: summaryData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
