import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Company from "./Company.js";

const Governance = sequelize.define(
  "Governance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Core Governance Metrics
    board_size: DataTypes.INTEGER,
    independent_directors_percent: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },
    female_directors_percentage: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },
    ethics_training_completion_percent: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },
    corruption_incidents: DataTypes.INTEGER,

    // Risk & Compliance
    data_breach_incidents: DataTypes.INTEGER,
    cybersecurity_investment: DataTypes.FLOAT,
    supplier_esg_assessments: DataTypes.INTEGER,
    anti_corruption_policies: DataTypes.INTEGER,
    data_privacy_policies: DataTypes.INTEGER,

    // Climate & Sustainability Governance
    climate_risk_disclosure_score: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },
    sustainability_governance_score: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },

    // Healthcare Industry Specific
    fda_compliance: DataTypes.FLOAT,
    drug_pricing_transparency: DataTypes.FLOAT,
    clinical_trial_ethics: DataTypes.FLOAT,

    // Manufacturing Industry Specific
    product_safety_compliance: DataTypes.FLOAT,
    manufacturing_ethics_score: DataTypes.FLOAT,
    supply_chain_transparency: DataTypes.FLOAT,
  },
  {
    tableName: "governance_data",
    timestamps: true,
  }
);

// Relationships
Company.hasOne(Governance, { foreignKey: "company_id" });
Governance.belongsTo(Company, { foreignKey: "company_id" });

export default Governance;
