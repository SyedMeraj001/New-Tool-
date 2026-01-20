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
    allowNull: false,
    field: 'full_name'
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
    type: DataTypes.STRING,
    field: 'contact_number'
  },

  contacts: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'profile_photo'
  },

  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'  // Map to is_active column in database
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default User;
