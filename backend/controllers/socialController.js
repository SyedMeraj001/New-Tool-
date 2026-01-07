import Social from "../models/Social.js";

// SAVE / UPDATE
const saveSocial = async (req, res) => {
  try {
    const { company_id } = req.body;

    const existing = await Social.findOne({
      where: { company_id },
    });

    const data = existing
      ? await existing.update(req.body)
      : await Social.create(req.body);

    res.json({
      success: true,
      message: "Social data saved",
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
