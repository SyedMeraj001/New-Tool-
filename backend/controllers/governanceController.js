import Governance from "../models/Governance.js";

// SAVE / UPDATE GOVERNANCE
const saveGovernance = async (req, res) => {
  try {
    console.log("📝 Received governance data:", req.body);
    
    const { company_id } = req.body;
    
    if (!company_id) {
      return res.status(400).json({
        success: false,
        error: "company_id is required"
      });
    }

    const existing = await Governance.findOne({
      where: { company_id },
    });
    
    console.log("🔍 Existing record:", existing ? "Found" : "Not found");

    const data = existing
      ? await existing.update(req.body)
      : await Governance.create(req.body);
    
    console.log("✅ Data saved:", data.toJSON());

    res.json({
      success: true,
      message: "Governance data saved",
      data,
    });
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
