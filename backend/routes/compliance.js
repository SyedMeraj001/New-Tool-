import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import mime from "mime"; // npm install mime
import pool from "../db.js";

const router = express.Router();

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL DOCUMENTS
================================ */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM compliance_documents ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("FETCH ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

/* ===============================
   UPLOAD DOCUMENT
================================ */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await pool.query(
      `INSERT INTO compliance_documents (name, file_name, status, category)
       VALUES ($1, $2, 'Pending', 'Environmental')`,
      [req.file.originalname, req.file.filename]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* ===============================
   FILE PREVIEW (OPEN IN BROWSER)
================================ */
router.get("/preview/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // Determine MIME type
  const mimeType = mime.getType(filePath) || "application/octet-stream";

  res.setHeader("Content-Type", mimeType);
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${req.params.filename}"`
  );

  res.sendFile(filePath);
});

/* ===============================
   DELETE DOCUMENT
================================ */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT file_name FROM compliance_documents WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const fileName = result.rows[0].file_name;

    await pool.query(
      "DELETE FROM compliance_documents WHERE id = $1",
      [id]
    );

    if (fileName) {
      const filePath = path.join(process.cwd(), "uploads", fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ===============================
   UPDATE STATUS (SUPER ADMIN)
================================ */
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await pool.query(
      "UPDATE compliance_documents SET status = $1 WHERE id = $2",
      [status, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err.message);
    res.status(500).json({ message: "Status update failed" });
  }
});

/* ===============================
   DOWNLOAD DOCUMENT (ORIGINAL NAME)
================================ */
router.get("/requirements", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.framework,
        m.name,
        m.category,
        m.due_date,
        CASE
          WHEN d.id IS NOT NULL THEN 'Completed'
          WHEN CURRENT_DATE > m.due_date THEN 'Overdue'
          ELSE 'Pending'
        END AS status
      FROM compliance_master m
      LEFT JOIN compliance_documents d
        ON d.name = m.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch compliance requirements" });
  }
});


/* ===============================
   GET REGULATORY FRAMEWORKS
================================ */
router.get("/regulations", async (req, res) => {
  try {
    const regulations = [
      {
        id: 1,
        name: 'EU Taxonomy',
        description: 'EU Sustainable Finance Taxonomy',
        status: 'In Progress',
        progress: 72,
        priority: 'High',
        deadline: '2024-12-31',
        icon: 'EU',
        color: 'green',
        category: 'Environmental',
        notes: 'Classification system for environmentally sustainable economic activities',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'CSRD',
        description: 'Corporate Sustainability Reporting Directive',
        status: 'In Progress',
        progress: 72,
        priority: 'Critical',
        deadline: '2024-06-30',
        icon: '📊',
        color: 'blue',
        category: 'Reporting',
        notes: 'EU directive requiring companies to report on sustainability matters',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 3,
        name: 'SFDR',
        description: 'Sustainable Finance Disclosure Regulation',
        status: 'In Progress',
        progress: 72,
        priority: 'Medium',
        deadline: '2024-09-15',
        icon: '💰',
        color: 'orange',
        category: 'Financial',
        notes: 'EU regulation on sustainability-related disclosures in the financial services sector',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 4,
        name: 'SEC Climate Rules',
        description: 'SEC Climate-Related Disclosures',
        status: 'In Progress',
        progress: 72,
        priority: 'High',
        deadline: '2024-11-30',
        icon: '🏛️',
        color: 'red',
        category: 'Climate',
        notes: 'SEC rules requiring public companies to disclose climate-related risks and greenhouse gas emissions',
        createdAt: new Date('2024-01-01')
      }
    ];
    
    res.json({
      success: true,
      data: regulations
    });
  } catch (err) {
    console.error("REGULATIONS FETCH ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch regulations" });
  }
});

export default router;
