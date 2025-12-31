import Governance from "../models/Governance.js";

// SAVE / UPDATE GOVERNANCE
const saveGovernance = async (req, res) => {
  try {
    const { company_id } = req.body;

    const existing = await Governance.findOne({
      where: { company_id },
    });

    const data = existing
      ? await existing.update(req.body)
      : await Governance.create(req.body);

    res.json({
      success: true,
      message: "Governance data saved",
      data,
    });
  } catch (error) {
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
