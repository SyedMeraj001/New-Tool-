const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "new_tool_db",
  "postgres",
  "YOUR_PASSWORD",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
