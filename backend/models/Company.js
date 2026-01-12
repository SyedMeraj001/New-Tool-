import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // ESM import

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reporting_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
    },
    region: {
      type: DataTypes.STRING,
    },
    primary_framework: {
      type: DataTypes.STRING,
    },
    assurance_level: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "DRAFT",
    },
  },
  {
    tableName: "companies",
    timestamps: true,
  }
);

export default Company;