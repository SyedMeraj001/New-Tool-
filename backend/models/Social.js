import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Company from "./Company.js";

const Social = sequelize.define(
  "Social",
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

    fatality_rate: DataTypes.FLOAT,
    lost_time_injury_rate: DataTypes.FLOAT,
    total_mine_workers: DataTypes.INTEGER,

    female_workers_percent: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },

    safety_training_hours_per_worker: DataTypes.FLOAT,
    community_investment_usd: DataTypes.FLOAT,
  },
  {
    tableName: "social_data",
    timestamps: true,
  }
);

// Relationships
Company.hasOne(Social, { foreignKey: "company_id" });
Social.belongsTo(Company, { foreignKey: "company_id" });

export default Social;
