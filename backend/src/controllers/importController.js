const parseCSV = require("../services/csvParser");
const processInBatches = require("../services/batchProcessor");

exports.importCSV = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required.",
      });
    }

    // Parse CSV
    const parsedCSV = await parseCSV(req.file.buffer);

    // Validate rows
    if (!parsedCSV.rows.length) {
      return res.status(400).json({
        success: false,
        message: "CSV contains no records.",
      });
    }

    // Process with AI
    const crmRecords = await processInBatches(parsedCSV.rows);

    // Count skipped records
    const skippedRecords =
      parsedCSV.rows.length - crmRecords.length;

    // Return response
    res.status(200).json({
  success: true,

  summary: {
    totalRows: parsedCSV.rows.length,
    imported: crmRecords.length,
    skipped: skippedRecords,
  },

  records: crmRecords,
});

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};