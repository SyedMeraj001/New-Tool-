import { pool } from "../db.js";
// import { sendNotification } from "../services/notificationService.js";
// import { logAuditTrail } from "../services/auditService.js";

/* ============================
   GET ALL STAKEHOLDERS
============================ */
export const getAllStakeholders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM stakeholders ORDER BY id DESC"
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   GET STAKEHOLDER BY ID
============================ */
export const getStakeholderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM stakeholders WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Stakeholder not found",
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   CREATE STAKEHOLDER
============================ */
export const createStakeholder = async (req, res) => {
  try {
    const {
      name,
      type,
      engagement,
      priority,
      description,
      concerns,
      nextAction,
      contactEmail,
      department,
      stakeholderPercentage,
      icon,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO stakeholders
      (name, type, engagement_level, priority, description, key_concerns,
       next_action, contact_email, department, stakeholder_percentage, icon)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        name,
        type,
        engagement,
        priority,
        description,
        concerns,
        nextAction,
        contactEmail,
        department,
        stakeholderPercentage,
        icon || "user",
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: "Stakeholder created successfully",
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   UPDATE STAKEHOLDER
============================ */
export const updateStakeholder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const oldResult = await pool.query(
      "SELECT * FROM stakeholders WHERE id = $1",
      [id]
    );

    if (oldResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Stakeholder not found",
      });
    }

    const result = await pool.query(
      `UPDATE stakeholders SET
        name=$1,
        type=$2,
        engagement_level=$3,
        priority=$4,
        description=$5,
        key_concerns=$6,
        next_action=$7,
        contact_email=$8,
        department=$9,
        stakeholder_percentage=$10,
        icon=$11,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$12
      RETURNING *`,
      [
        data.name,
        data.type,
        data.engagement,
        data.priority,
        data.description,
        data.concerns,
        data.nextAction,
        data.contactEmail,
        data.department,
        data.stakeholderPercentage,
        data.icon,
        id,
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: "Stakeholder updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   DELETE STAKEHOLDER
============================ */
export const deleteStakeholder = async (req, res) => {
  try {
    const { id } = req.params;

    const oldResult = await pool.query(
      "SELECT * FROM stakeholders WHERE id = $1",
      [id]
    );

    if (oldResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Stakeholder not found",
      });
    }

    await pool.query("DELETE FROM stakeholders WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Stakeholder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   ENGAGEMENT TRACKING
============================ */
export const trackEngagement = async (req, res) => {
  try {
    const { id } = req.params;
    const { engagementType, notes, rating } = req.body;

    await pool.query(
      `INSERT INTO stakeholder_engagements
      (stakeholder_id, engagement_type, notes, rating, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [id, engagementType, notes, rating]
    );

    await pool.query(
      "UPDATE stakeholders SET last_contact = CURRENT_DATE WHERE id = $1",
      [id]
    );

    res.json({ success: true, message: "Engagement tracked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   ENGAGEMENT HISTORY
============================ */
export const getEngagementHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM stakeholder_engagements
       WHERE stakeholder_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   ANALYTICS
============================ */
export const getStakeholderAnalytics = async (req, res) => {
  try {
    const engagementStats = await pool.query(
      "SELECT engagement_level, COUNT(*) FROM stakeholders GROUP BY engagement_level"
    );

    const priorityStats = await pool.query(
      "SELECT priority, COUNT(*) FROM stakeholders GROUP BY priority"
    );

    const typeStats = await pool.query(
      "SELECT type, COUNT(*) FROM stakeholders GROUP BY type"
    );

    res.json({
      success: true,
      data: {
        engagementStats: engagementStats.rows,
        priorityStats: priorityStats.rows,
        typeStats: typeStats.rows,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ============================
   MATERIALITY MATRIX
============================ */
export const getMaterialityMatrix = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT topic_name,
              AVG(impact_score) AS avg_impact,
              AVG(financial_score) AS avg_financial,
              AVG(stakeholder_priority) AS avg_priority
       FROM materiality_assessments
       GROUP BY topic_name
       ORDER BY avg_impact DESC, avg_financial DESC`
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
