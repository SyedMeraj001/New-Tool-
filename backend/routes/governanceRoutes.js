import express from "express";
const router = express.Router();

import {
  saveGovernance,
  getGovernance,
} from "../controllers/governanceController.js";

// Step 4 – Save / Update Governance
router.post("/", saveGovernance);

// Get Governance by company
router.get("/:companyId", getGovernance);

export default router;
