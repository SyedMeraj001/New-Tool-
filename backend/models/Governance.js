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

    climate_risk_disclosure_score: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },

    sustainability_governance_score: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },

    board_size: {
      type: DataTypes.INTEGER,
    },

    independent_directors_percent: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },

    ethics_training_completion_percent: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },

    corruption_incidents: {
      type: DataTypes.INTEGER,
    },
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
