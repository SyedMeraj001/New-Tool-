import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import complianceRoutes from "./routes/compliance.js";
import requirementsRoutes from "./routes/requirements.js";
import kpisRoutes from "./routes/kpis.js";

dotenv.config();

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
