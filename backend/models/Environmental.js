import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Company from "./Company.js";

const Environmental = sequelize.define(
  "Environmental",
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

    // GHG Emissions
    ghg_scope1_tco2e: DataTypes.FLOAT,
    ghg_scope2_tco2e: DataTypes.FLOAT,
    ghg_scope3_tco2e: DataTypes.FLOAT,

    // Energy
    energy_consumption_mwh: DataTypes.FLOAT,
    renewable_energy_percentage: DataTypes.FLOAT,
    production_energy_intensity: DataTypes.FLOAT,

    // Water
    water_withdrawal_m3: DataTypes.FLOAT,
    water_discharge_m3: DataTypes.FLOAT,

    // Waste
    waste_generated_tonnes: DataTypes.FLOAT,
    mine_tailings_tonnes: DataTypes.FLOAT,
    medical_waste_tonnes: DataTypes.FLOAT,
    industrial_waste_tonnes: DataTypes.FLOAT,

    // Land & Biodiversity
    land_rehabilitated_hectares: DataTypes.FLOAT,
    biodiversity_impact_score: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 10 },
    },

    // Industry-specific
    pharmaceutical_emissions_tco2e: DataTypes.FLOAT,
    manufacturing_emissions_tco2e: DataTypes.FLOAT,
  },
  {
    tableName: "environmental_data",
    timestamps: true,
  }
);

// Associations
Company.hasOne(Environmental, { foreignKey: "company_id" });
Environmental.belongsTo(Company, { foreignKey: "company_id" });

export default Environmental;
