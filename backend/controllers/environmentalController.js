const Environmental = require("../models/Environmental");

/* ===============================
   SAVE / UPDATE ENVIRONMENTAL
=============================== */
exports.saveEnvironmentalData = async (req, res) => {
  try {
    const { company_id } = req.body;

    const existing = await Environmental.findOne({
      where: { company_id },
    });

    let environmental;

    if (existing) {
      environmental = await existing.update(req.body);
    } else {
      environmental = await Environmental.create(req.body);
    }

    res.status(200).json({
      success: true,
      message: "Environmental data saved successfully",
      data: environmental,
    });
  } catch (error) {
    console.error("Environmental save error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ===============================
   GET ENVIRONMENTAL DATA
=============================== */
exports.getEnvironmentalData = async (req, res) => {
  try {
    const data = await Environmental.findOne({
      where: { company_id: req.params.companyId },
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
