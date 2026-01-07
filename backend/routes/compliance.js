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


export default router;
