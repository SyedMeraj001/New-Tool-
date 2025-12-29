import pool from "../config/db.js";

/* ==============================
   CREATE / SAVE COMPANY INFO
============================== */
export const createCompany = async (req, res) => {
  try {
    const {
      company_name,
      reporting_year,
      sector,
      region,
      primary_framework,
      assurance_level,
    } = req.body;

    const query = `
      INSERT INTO companies
      (company_name, reporting_year, sector, region, primary_framework, assurance_level)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `;

    const values = [
      company_name,
      reporting_year,
      sector,
      region,
      primary_framework,
      assurance_level,
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Company information saved",
      data: rows[0],
    });
  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/* ==============================
   GET COMPANY INFO (AUTO-FILL)
============================== */
export const getCompanyByYear = async (req, res) => {
  try {
    const { year } = req.params;

    const { rows } = await pool.query(
      "SELECT * FROM companies WHERE reporting_year = $1",
      [year]
    );

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Fetch company error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
