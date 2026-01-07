const { DataTypes } = require("sequelize");
const sequelize = require("../server");

const Company = sequelize.define("Company", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "companies",
  timestamps: false,
});

module.exports = Company;
