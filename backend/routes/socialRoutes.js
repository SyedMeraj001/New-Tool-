import express from "express";
const router = express.Router();

import {
  saveSocial,
  getSocial,
} from "../controllers/socialController.js";

// Step 3 – Save / Update Social
router.post("/", saveSocial);

// Get Social by company
router.get("/:companyId", getSocial);

export default router;
