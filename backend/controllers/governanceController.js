import Governance from "../models/Governance.js";
import RegulatoryComplianceCalculator from "../utils/regulatoryComplianceCalculator.js";
import { governanceMetricMap } from "../utils/governanceMetricMap.js";

// SAVE / UPDATE GOVERNANCE
const saveGovernance = async (req, res) => {
  try {
    const { company_id, metric, value } = req.body;
    
    // Check if this is metric-based format
    if (metric && value !== undefined) {
      // New metric-based approach
      if (!company_id || !metric) {
        return res.status(400).json({
          success: false,
          message: "company_id and metric are required",
        });
      }

      const dbColumn = governanceMetricMap[metric];
      if (!dbColumn) {
        console.log(`❌ Unsupported governance metric: ${metric}`);
        console.log(`Available metrics:`, Object.keys(governanceMetricMap));
        return res.status(400).json({
          success: false,
          message: `Unsupported governance metric: ${metric}`,
        });
      }

      const [record] = await Governance.findOrCreate({
        where: { company_id },
        defaults: { company_id },
      });

      record[dbColumn] = value;
      await record.save();

      // Update regulatory compliance scores (optional)
      try {
        await RegulatoryComplianceCalculator.updateAllRegulatoryCompliance(company_id);
      } catch (complianceError) {
        console.warn('⚠️ Regulatory compliance update failed:', complianceError.message);
      }

      res.json({
        success: true,
        message: "Governance data saved",
        stored_as: dbColumn,
        value,
      });
    } else {
      // Old full object approach
      if (!company_id) {
        return res.status(400).json({
          success: false,
          message: "company_id is required",
        });
      }

      const existing = await Governance.findOne({
        where: { company_id },
      });

      const data = existing
        ? await existing.update(req.body)
        : await Governance.create(req.body);

      await RegulatoryComplianceCalculator.updateAllRegulatoryCompliance(company_id);

      res.json({
        success: true,
        message: "Governance data saved",
        data,
      });
    }
  } catch (error) {
    console.error("❌ Governance save error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET GOVERNANCE
const getGovernance = async (req, res) => {
  try {
    const data = await Governance.findOne({
      where: { company_id: req.params.companyId },
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { saveGovernance, getGovernance };
