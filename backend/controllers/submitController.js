import Company from "../models/Company.js";

const submitAssessment = async (req, res) => {
  try {
    await Company.update(
      { status: "SUBMITTED" },
      { where: { id: req.params.companyId } }
    );

    res.json({
      success: true,
      message: "Assessment submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { submitAssessment };
