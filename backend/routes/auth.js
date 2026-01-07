import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role, contactNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      contactNumber,
      isApproved: false
    });

    res.json({ message: "Registration successful. Awaiting approval." });
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  console.log("🔍 Login attempt:", { email, role });

  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log("❌ No user found with email:", email);
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log("👤 Found user:", { id: user.id, fullName: user.fullName, role: user.role });

  if (user.role !== role) {
    console.log("❌ Role mismatch - User role:", user.role, "Selected role:", role);
    return res.status(401).json({ message: "Invalid role selected" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log("❌ Password mismatch for user:", user.fullName);
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.isApproved) {
    console.log("❌ User pending approval:", user.fullName);
    return res.status(401).json({ message: "Account pending approval" });
  }

  console.log("✅ Login successful for:", user.fullName, "Role:", user.role);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      role: user.role
    }
  });
});

/* ================= AUTH CHECK ================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Auth check - JWT payload:", req.user);
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log("❌ No user found with ID:", req.user.id);
      return res.status(401).json({ authenticated: false });
    }

    console.log("✅ Found user:", { id: user.id, fullName: user.fullName, role: user.role });

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.log("❌ Auth check error:", error.message);
    res.status(500).json({ authenticated: false });
  }
});

/* ================= GET PENDING USERS ================= */
router.get("/pending-users", authMiddleware, async (req, res) => {
  if (req.user.role !== 'supervisor' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  
  const pendingUsers = await User.findAll({
    where: { isApproved: false },
    attributes: ['id', 'fullName', 'email', 'role', 'createdAt']
  });
  
  res.json(pendingUsers);
});

/* ================= APPROVE USER ================= */
router.post("/approve-user/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== 'supervisor' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  
  await User.update({ isApproved: true }, { where: { id: req.params.id } });
  res.json({ message: "User approved successfully" });
});

/* ================= REJECT USER ================= */
router.delete("/reject-user/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== 'supervisor' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: "User rejected successfully" });
});

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;