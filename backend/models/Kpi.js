const { DataTypes } = require("sequelize");
const sequelize = require("../server");

const Kpi = sequelize.define("Kpi", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  value: { type: DataTypes.NUMERIC },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "kpis",
  timestamps: false,
});

module.exports = Kpi;
