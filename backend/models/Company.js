cconst { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Company = sequelize.define("Company", {
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reporting_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sector: DataTypes.STRING,
  region: DataTypes.STRING,
  primary_reporting_framework: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assurance_level: DataTypes.STRING,
});

module.exports = Company;
