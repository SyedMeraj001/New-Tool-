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

    // Core Mining Social Metrics
    total_mine_workers: DataTypes.INTEGER,
    female_workers_percent: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 100 },
    },
    fatality_rate: DataTypes.FLOAT,
    lost_time_injury_rate: DataTypes.FLOAT,
    safety_training_hours_per_worker: DataTypes.FLOAT,
    community_investment_usd: DataTypes.FLOAT,

    // Additional Social Metrics
    training_hours_per_employee: DataTypes.FLOAT,
    local_employment_percentage: DataTypes.FLOAT,
    community_grievances: DataTypes.INTEGER,
    employee_turnover_rate: DataTypes.FLOAT,
    diversity_training_completion: DataTypes.FLOAT,

    // Healthcare Industry Specific
    patient_safety_incidents: DataTypes.INTEGER,
    healthcare_access_programs: DataTypes.INTEGER,

    // Manufacturing Industry Specific
    workplace_safety_incidents: DataTypes.INTEGER,
    manufacturing_jobs_created: DataTypes.INTEGER,
    product_quality_issues: DataTypes.INTEGER,
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
