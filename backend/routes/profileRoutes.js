import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/photo", authMiddleware, async (req, res) => {
  try {
    const { photoData } = req.body;
    
    await User.update(
      { profilePhoto: photoData },
      { where: { id: req.user.id } }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/photo", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ photoData: user.profilePhoto || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/photo", authMiddleware, async (req, res) => {
  try {
    await User.update(
      { profilePhoto: null },
      { where: { id: req.user.id } }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;