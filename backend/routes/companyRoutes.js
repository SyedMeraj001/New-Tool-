// backend/routes/companyRoutes.js
/*const express = require("express");
const router = express.Router();

const {
  saveCompany,
  getCompanyByYear,
} = require("../controllers/companyController");

// STEP 1 – Save / Update company
router.post("/", saveCompany);

// Auto-fill company by year
router.get("/:year", getCompanyByYear);

module.exports = router;

*/
import express from "express";
const router = express.Router();

import {
  saveCompany,
  getCompanyByYear,
  getAllCompanies,
} from "../controllers/companyController.js";

// STEP 1 – Save / Update company
router.post("/", saveCompany);

// GET ALL companies
router.get("/", getAllCompanies);

// GET company by YEAR
router.get("/year/:year", getCompanyByYear);

export default router;
