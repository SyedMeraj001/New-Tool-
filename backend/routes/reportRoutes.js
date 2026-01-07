import express from "express";

const router = express.Router();

<<<<<<< HEAD
router.get("/dashboard-summary", async (req, res) => {
  res.json({
    success: true,
    data: {
      comprehensive: {
        totalReports: 5,
        completedReports: 3,
        pendingReports: 2
      },
      performance: {
        overallScore: 78,
        trend: "improving"
      }
    }
  });
=======
// Get dashboard summary
router.get("/dashboard-summary", async (req, res) => {
  try {
    // Mock dashboard summary data
    const mockSummary = {
      totalReports: 12,
      completedReports: 8,
      pendingReports: 4,
      complianceRate: 85,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({ success: true, data: mockSummary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
>>>>>>> 44521cd (updated by sudha)
});

export default router;