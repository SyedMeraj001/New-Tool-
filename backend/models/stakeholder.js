import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Stakeholder = sequelize.define(
  "Stakeholder",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isIn: {
          args: [['Internal', 'External', 'Financial', 'Compliance', 'Social', 'Business']],
          msg: "Type must be one of: Internal, External, Financial, Compliance, Social, Business"
        }
      }
    },
    engagement_level: {
      type: DataTypes.STRING(50),
      defaultValue: "Medium",
      validate: {
        isIn: {
          args: [['Low', 'Medium', 'High']],
          msg: "Engagement level must be 'Low', 'Medium', or 'High'"
        }
      }
    },
    priority: {
      type: DataTypes.STRING(50),
      defaultValue: "Medium",
      validate: {
        isIn: {
          args: [['Low', 'Medium', 'High', 'Critical']],
          msg: "Priority must be 'Low', 'Medium', 'High', or 'Critical'"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    key_concerns: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    next_action: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { 
        isEmail: {
          msg: "Must be a valid email address"
        }
      },
    },
    department: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    stakeholder_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Percentage must be at least 0"
        },
        max: {
          args: [100],
          msg: "Percentage must be at most 100"
        }
      }
    },
    icon: {
      type: DataTypes.STRING(100),
      defaultValue: "user",
    },
    last_contact: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "stakeholders",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Stakeholder;
