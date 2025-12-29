// ================================
// server.js – Main Entry Point
// ================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
//const environmentalRoutes = require("./routes/environmentalRoutes");
const environmentalRoutes = require("./routes/environmentalRoutes");
app.use("/api/environmental", environmentalRoutes);

// ================================
// App Init
// ================================
const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// Middleware
// ================================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ================================
// Database Connection (Sequelize)
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

// ================================
// DB Authenticate & Sync
// ================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

// ================================
// Routes
// ================================
const companyRoutes = require("./routes/companyRoutes");

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "ESG Dashboard Backend is running 🚀",
  });
});

app.use("/api/environmental", environmentalRoutes);


// Data Entry – Step 1 (Company Info)
app.use("/api/company", companyRoutes);

// ================================
// Start Server
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================================
// Export sequelize for models
// ================================
module.exports = sequelize;
