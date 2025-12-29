const express = require("express");
const router = express.Router();
const {
  saveEnvironmentalData,
  getEnvironmentalData,
} = require("../controllers/environmentalController");

// Save / Update Environmental (Step 2)
router.post("/", saveEnvironmentalData);

// Get Environmental by Company
router.get("/:companyId", getEnvironmentalData);

module.exports = router;
