// backend/controllers/companyController.js (ESM)

import Company from "../models/Company.js";
import { createComplianceRecords } from "../utils/complianceUpdater.js";

// SAVE / UPDATE COMPANY
const saveCompany = async (req, res) => {
  try {
    const { company_name, reporting_year } = req.body;

    const existing = await Company.findOne({
      where: { 
        company_name,
        reporting_year 
      },
    });

    let company;
    let isNewCompany = false;

    if (existing) {
      company = await existing.update(req.body);
    } else {
      company = await Company.create(req.body);
      isNewCompany = true;
    }

    // Create compliance records for new companies
    if (isNewCompany) {
      console.log('Creating compliance records for new company:', company.id);
      await createComplianceRecords(company.id, req.body);
    }

    res.status(200).json({
      success: true,
      message: "Company data saved successfully",
      data: company,
    });
  } catch (error) {
    console.error("Company save error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ GET ALL COMPANIES
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET COMPANY BY YEAR
const getCompanyByYear = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { reporting_year: req.params.year },
    });

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// DELETE COMPANY
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }
    
    await company.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Company delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export { saveCompany, getCompanyByYear, getAllCompanies, deleteCompany };
