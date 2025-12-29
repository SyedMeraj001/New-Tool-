import express from "express";
import {
  createCompany,
  getCompanyByYear,
} from "../controllers/companyController.js";

const router = express.Router();

// Step 1: Save company info
router.post("/", createCompany);

// Auto-fill company info by year
router.get("/:year", getCompanyByYear);

export default router;
