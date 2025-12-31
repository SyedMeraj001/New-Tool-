import Company from "../models/Company.js";
import Environmental from "../models/Environmental.js";
import Social from "../models/Social.js";
import Governance from "../models/Governance.js";

const getReviewSummary = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findByPk(companyId);
    const environmental = await Environmental.findOne({
      where: { company_id: companyId },
    });
    const social = await Social.findOne({
      where: { company_id: companyId },
    });
    const governance = await Governance.findOne({
      where: { company_id: companyId },
    });

    // Completeness calculation
    const countFilled = (obj, fields) =>
      fields.filter(
        (f) => obj && obj[f] !== null && obj[f] !== undefined
      ).length;

    const environmentalFields = [
      "mine_tailings_tonnes",
      "water_discharge_m3",
      "land_rehabilitated_hectares",
      "biodiversity_impact_score",
      "ghg_scope1_tco2e",
      "energy_consumption_mwh",
    ];

    const socialFields = [
      "fatality_rate",
      "lost_time_injury_rate",
      "total_mine_workers",
      "female_workers_percent",
      "safety_training_hours_per_worker",
      "community_investment_usd",
    ];

    const governanceFields = [
      "climate_risk_disclosure_score",
      "sustainability_governance_score",
      "board_size",
      "independent_directors_percent",
      "ethics_training_completion_percent",
      "corruption_incidents",
    ];

    res.json({
      success: true,
      company,
      summary: {
        environmental,
        social,
        governance,
      },
      completeness: {
        environmental: `${countFilled(environmental, environmentalFields)}/${environmentalFields.length}`,
        social: `${countFilled(social, socialFields)}/${socialFields.length}`,
        governance: `${countFilled(governance, governanceFields)}/${governanceFields.length}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { getReviewSummary };
