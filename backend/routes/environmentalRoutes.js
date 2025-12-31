import express from "express";
const router = express.Router();

import {
  saveEnvironmental,
  getEnvironmental,
} from "../controllers/environmentalController.js";

// Save / Update Environmental (Step 2)
router.post("/", saveEnvironmental);

// Get Environmental by Company
router.get("/:companyId", getEnvironmental);

export default router;
