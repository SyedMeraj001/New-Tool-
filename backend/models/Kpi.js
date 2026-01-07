import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Kpi = sequelize.define("Kpi", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "kpis",
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Kpi;
