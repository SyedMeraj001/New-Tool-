import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import complianceRoutes from "./routes/compliance.js";
import requirementsRoutes from "./routes/requirements.js";
import kpisRoutes from "./routes/kpis.js";

dotenv.config();

<<<<<<< HEAD
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Shared Sequelize instance
import sequelize from "./config/db.js";

// ================================
// Routes (ESM imports)
// ================================
import authRoutes from "./routes/auth.js";
import companyRoutes from "./routes/companyRoutes.js";
import environmentalRoutes from "./routes/environmentalRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import governanceRoutes from "./routes/governanceRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// ✅ Seed Super Admin
import { seedSuperAdmin } from "./seed/superAdminSeed.js";

import reportRoutes from "./routes/reportRoutes.js";
import kpiRoutes from "./routes/kpiRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

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
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Serve static files (profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================================
// Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/kpi", kpiRoutes);
app.use("/api/profile", profileRoutes);

// ESG steps
app.use("/api/company", companyRoutes);
app.use("/api/environmental", environmentalRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/governance", governanceRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/submit", submitRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "ESG Dashboard Backend is running 🚀" });
});

// ================================
// DB Init & Server Start
// ================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");

    // 🔥 THIS WAS MISSING (SAFE ADDITION)
    await seedSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  }
})();
=======
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

/* ✅ ADD THIS LINE (VERY IMPORTANT) */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "ESG Dashboard Backend is running 🚀" });
});

// API routes
app.use("/api/compliance", complianceRoutes);
app.use("/api/requirements", requirementsRoutes);
app.use("/api/kpis", kpisRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
>>>>>>> 97c9a4fefc5348ac1dc78ef3bb2fa7eb30d7eb4c
