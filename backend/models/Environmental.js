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

    mine_tailings_tonnes: DataTypes.FLOAT,
    water_discharge_m3: DataTypes.FLOAT,
    land_rehabilitated_hectares: DataTypes.FLOAT,

    biodiversity_impact_score: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 10 },
    },

    ghg_scope1_tco2e: DataTypes.FLOAT,
    energy_consumption_mwh: DataTypes.FLOAT,
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
