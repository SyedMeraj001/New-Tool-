import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM("super_admin", "supervisor", "data_entry"),
    allowNull: false
  },

  contactNumber: {
    type: DataTypes.STRING
  },

  contacts: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default User;
