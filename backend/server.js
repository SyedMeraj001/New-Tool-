// ================================
// server.js – Main Entry Point (ESM)
// ================================

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// ✅ IMPORT shared sequelize instance (must also be ESM)
import sequelize from "./config/db.js";

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
// Routes (ALL DEFAULT IMPORTS)
// ================================
import companyRoutes from "./routes/companyRoutes.js";
import environmentalRoutes from "./routes/environmentalRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import governanceRoutes from "./routes/governanceRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "ESG Dashboard Backend is running 🚀",
  });
});

// ESG Steps
app.use("/api/company", companyRoutes);
app.use("/api/environmental", environmentalRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/governance", governanceRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/submit", submitRoutes);
app.use("/api/upload", uploadRoutes);

// ================================
// DB Init & Server Start
// ================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database error:", error.message);
  }
})();
