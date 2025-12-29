import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];

    if (!user.is_approved)
      return res.status(403).json({ message: "Awaiting admin approval" });

    if (role && user.role !== role)
      return res.status(403).json({ message: "Role mismatch" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    res.json({
      message: "Login successful",
      user: {
        fullName: user.full_name,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/signup", async (req, res) => {
  const { email, password, fullName, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role, is_approved)
     VALUES ($1,$2,$3,$4,false)`,
    [email, hash, fullName, role]
  );

  res.json({ message: "Signup request submitted for approval" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});


export default router;
