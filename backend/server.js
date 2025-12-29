// server.js - Main Entry Point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

// Routes
const workflowRoutes = require("./routes/workflowRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const esgRoutes = require("./routes/esgRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "ESG Dashboard Backend is running", status: "healthy" });
});

app.use("/api/workflows", workflowRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/esg", esgRoutes);

// Start Server
app.listen(PORT, async () => {
  console.log("Server running on port " + PORT);
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync({ alter: true });
    console.log("Models synchronized");
  } catch (err) {
    console.error("Database error:", err.message);
  }
});

module.exports = app;
