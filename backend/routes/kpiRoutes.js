import express from "express";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  res.json({
    success: true,
    data: {
      overall: 75,
      environmental: 80,
      social: 70,
      governance: 85,
      complianceRate: 90,
      totalEntries: 12
    }
  });
});

export default router;