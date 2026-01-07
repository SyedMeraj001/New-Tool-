import XLSX from "xlsx";
import Company from "../models/Company.js";
import Environmental from "../models/Environmental.js";

const uploadESGFile = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      // 🔹 Company from file (REAL)
      const [company] = await Company.findOrCreate({
        where: {
          company_name: row.CompanyName,
          reporting_year: row.ReportingYear,
        },
        defaults: {
          sector: row.Sector,
          region: row.Region,
          primary_framework: row.FrameworkCode,
        },
      });

      // 🔹 Environmental only (for now)
      if (row.Category?.toLowerCase() === "environmental") {
        await Environmental.upsert({
          company_id: company.id,
          [row.Metric]: row.Value, // EXACT VALUE FROM FILE
        });
      }
    }

    res.json({
      success: true,
      message: "Environmental data stored (real values)",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export default {
  uploadESGFile,
};
