import express from "express";
import pool from "../db.js";

const router = express.Router();

// Example route: get all compliance requirements
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM compliance_requirements");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add other routes here…

export default router;
