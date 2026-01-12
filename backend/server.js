import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { initWebSocket } from "./websocket.js";
import { simulateUpdates } from "./realtime-simulator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ✅ Shared Sequelize instance
import sequelize from "./config/db.js";

// Import models for sync
import "./models/Company.js";
import "./models/Environmental.js";
import "./models/Social.js";
import "./models/Governance.js";
import "./models/Regulatory.js";

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
import regulatoryRoutes from "./routes/regulatoryRoutes.js";

// ✅ Seed Super Admin
import { seedSuperAdmin } from "./seed/superAdminSeed.js";

import reportRoutes from "./routes/reportRoutes.js";
import kpiRoutes from "./routes/kpiRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import complianceRoutes from "./routes/complianceRoutes.js";
import testRoutes from "./routes/testRoutes.js";

// ================================
// App Init
// ================================
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize WebSocket
initWebSocket(server);

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
app.use("/api/compliance", complianceRoutes);
app.use("/api/test", testRoutes);
app.use("/api/regulatory", regulatoryRoutes);

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

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready`);
      
      // Start real-time simulation
      simulateUpdates();
      console.log(`⚡ Real-time updates started`);
    });
  } catch (error) {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  }
})();