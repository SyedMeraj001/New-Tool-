import express from "express";

const router = express.Router();

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
});

export default router;