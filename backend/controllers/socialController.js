import Social from "../models/Social.js";
import RegulatoryComplianceCalculator from "../utils/regulatoryComplianceCalculator.js";
import { socialMetricMap } from "../utils/socialMetricMap.js";

// SAVE / UPDATE
const saveSocial = async (req, res) => {
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

      const dbColumn = socialMetricMap[metric];
      if (!dbColumn) {
        console.log(`❌ Unsupported social metric: ${metric}`);
        console.log(`Available metrics:`, Object.keys(socialMetricMap));
        return res.status(400).json({
          success: false,
          message: `Unsupported social metric: ${metric}`,
        });
      }

      const [record] = await Social.findOrCreate({
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
        message: "Social data saved",
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

      const existing = await Social.findOne({
        where: { company_id },
      });

      const data = existing
        ? await existing.update(req.body)
        : await Social.create(req.body);

      await RegulatoryComplianceCalculator.updateAllRegulatoryCompliance(company_id);

      res.json({
        success: true,
        message: "Social data saved",
        data,
      });
    }
  } catch (error) {
    console.error("❌ Social save error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET
const getSocial = async (req, res) => {
  try {
    const data = await Social.findOne({
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

export { saveSocial, getSocial };
