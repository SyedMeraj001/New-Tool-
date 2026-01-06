/*import Environmental from "../models/Environmental.js";
import { environmentalMetricMap } from "../utils/environmentalMetricMap.js";

// SAVE / UPDATE
const saveEnvironmental = async (req, res) => {
  try {
    const { company_id } = req.body;

    const existing = await Environmental.findOne({
      where: { company_id },
    });

    const data = existing
      ? await existing.update(req.body)
      : await Environmental.create(req.body);

    res.json({
      success: true,
      message: "Environmental data saved",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET
const getEnvironmental = async (req, res) => {
  try {
    const data = await Environmental.findOne({
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

export { saveEnvironmental, getEnvironmental };
*/
import Environmental from "../models/Environmental.js";
import { environmentalMetricMap } from "../utils/environmentalMetricMap.js";

// SAVE / UPDATE (FINAL WORKING VERSION)
const saveEnvironmental = async (req, res) => {
  try {
    const { company_id, metric, value } = req.body;

    // 🔴 company_id is mandatory
    if (!company_id || !metric) {
      return res.status(400).json({
        success: false,
        message: "company_id and metric are required",
      });
    }

    // 🔁 Map UI metric → DB column
    const dbColumn = environmentalMetricMap[metric];

    if (!dbColumn) {
      return res.status(400).json({
        success: false,
        message: `Unsupported environmental metric: ${metric}`,
      });
    }

    // 🔍 Get or create environmental row for company
    const [record] = await Environmental.findOrCreate({
      where: { company_id },
      defaults: { company_id },
    });

    // ✅ Store value in correct column
    record[dbColumn] = value;
    await record.save();

    res.json({
      success: true,
      message: "Environmental data saved",
      stored_as: dbColumn,
      value,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET ENVIRONMENTAL DATA
const getEnvironmental = async (req, res) => {
  try {
    const data = await Environmental.findOne({
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

export { saveEnvironmental, getEnvironmental };
