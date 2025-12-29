const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const Company = require("./Company");

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

    mine_tailings_tonnes: {
      type: DataTypes.FLOAT,
    },

    water_discharge_m3: {
      type: DataTypes.FLOAT,
    },

    land_rehabilitated_hectares: {
      type: DataTypes.FLOAT,
    },

    biodiversity_impact_score: {
      type: DataTypes.FLOAT, // 0–10
      validate: { min: 0, max: 10 },
    },

    ghg_scope1_tco2e: {
      type: DataTypes.FLOAT,
    },

    energy_consumption_mwh: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "environmental_data",
    timestamps: true,
  }
);

// 🔗 Relationships
Company.hasOne(Environmental, { foreignKey: "company_id" });
Environmental.belongsTo(Company, { foreignKey: "company_id" });

module.exports = Environmental;
