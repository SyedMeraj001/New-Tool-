// ================================
// server.js – Main Entry Point
// ================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Database
const { Sequelize } = require("sequelize");

// ================================
// App Init
// ================================
const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// Middleware
// ================================
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// ================================
// Database Connection
// ================================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

// Test DB Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

// ================================
// Routes (temporary test route)
// ================================
app.get("/", (req, res) => {
  res.json({
    message: "ESG Dashboard Backend is running 🚀",
  });
});

// ================================
// Start Server
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export sequelize for models later
module.exports = sequelize;
