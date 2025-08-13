const express = require("express");
const router = express.Router();
// Using native fetch (Node.js v18+)
const { parseRangeData, parseData } = require("../utils/amfiParser");

// http://localhost:8080/24-Aug-2023/11-Aug-2025/21/118652

// Get all funds or filter by one or more schemeCodes
router.get("/", async (req, res) => {
  const url = "https://www.amfiindia.com/spages/NAVAll.txt";
  try {
    const response = await fetch(url);
    const body = await response.text();
    let fundData = parseData(body);

    // Accept multiple schemeCodes as comma-separated or array
    let schemeCodes = req.query.schemeCodes;
    if (schemeCodes) {
      if (typeof schemeCodes === "string") {
        schemeCodes = schemeCodes.split(",").map((code) => code.trim());
      }
      fundData = fundData.filter((fund) =>
        schemeCodes.includes(fund["Scheme Code"])
      );
      return res.json(fundData);
    }

    res.json(fundData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get funds by date range, mf, and one or more schemeCodes as query params
router.get("/history", async (req, res) => {
  const { startDate, endDate, mf, schemeCodes } = req.query;

  // Validate required params
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required" });
  }

  let url = `https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?tp=1&frmdt=${startDate}&todt=${endDate}`;
  if (mf) url += `&mf=${mf}`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    let fundData = parseRangeData(data);

    // Accept multiple schemeCodes as comma-separated or array
    let codes = schemeCodes;
    if (codes) {
      if (typeof codes === "string") {
        codes = codes.split(",").map((code) => code.trim());
      }
      fundData = fundData.filter((fund) => codes.includes(fund["Scheme Code"]));
      return res.json(fundData);
    }

    res.json(fundData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;
