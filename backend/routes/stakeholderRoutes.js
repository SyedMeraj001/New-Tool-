import express from "express";
import Stakeholder from "../models/stakeholder.js";

const router = express.Router();

// Create stakeholder
router.post("/", async (req, res) => {
  try {
    console.log("Creating stakeholder with data:", req.body);
    
    const payload = req.body;
    
    // Validate required fields
    if (!payload.name) {
      return res.status(400).json({ 
        success: false, 
        error: "Name is required" 
      });
    }
    
    const created = await Stakeholder.create(payload);
    console.log("Stakeholder created successfully:", created.toJSON());
    
    res.json({ 
      success: true, 
      data: created,
      message: "Stakeholder created successfully"
    });
  } catch (err) {
    console.error("Stakeholder create error:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.errors || null
    });
  }
});

// List stakeholders
router.get("/", async (req, res) => {
  try {
    const list = await Stakeholder.findAll({ 
      order: [["id", "DESC"]] 
    });
    res.json({ success: true, data: list });
  } catch (err) {
    console.error("Stakeholder list error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const s = await Stakeholder.findByPk(req.params.id);
    if (!s) {
      return res.status(404).json({ 
        success: false, 
        error: "Stakeholder not found" 
      });
    }
    res.json({ success: true, data: s });
  } catch (err) {
    console.error("Stakeholder get error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update stakeholder
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    
    const stakeholder = await Stakeholder.findByPk(id);
    if (!stakeholder) {
      return res.status(404).json({ 
        success: false, 
        error: "Stakeholder not found" 
      });
    }
    
    await stakeholder.update(payload);
    
    res.json({ 
      success: true, 
      data: stakeholder,
      message: "Stakeholder updated successfully"
    });
  } catch (err) {
    console.error("Stakeholder update error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete stakeholder
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const stakeholder = await Stakeholder.findByPk(id);
    if (!stakeholder) {
      return res.status(404).json({ 
        success: false, 
        error: "Stakeholder not found" 
      });
    }
    
    await stakeholder.destroy();
    
    res.json({ 
      success: true, 
      message: "Stakeholder deleted successfully"
    });
  } catch (err) {
    console.error("Stakeholder delete error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
