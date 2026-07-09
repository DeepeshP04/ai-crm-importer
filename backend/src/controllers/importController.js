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

    console.log("✅ AI Processing Completed");

    const skippedRecords = Math.max(parsedCSV.rows.length - crmRecords.length, 0);

    console.log("\n========== IMPORT SUMMARY ==========");
    console.log(`📄 Total Records   : ${parsedCSV.rows.length}`);
    console.log(`✅ Imported        : ${crmRecords.length}`);
    console.log(`⚠️  Skipped        : ${skippedRecords}`);
    console.log("====================================\n");

    // Optional: Show first few parsed records
    console.log("📋 Sample Parsed Records:");
    console.table(crmRecords.slice(0, 5));

    // Return response
    res.status(200).json({
      success: true,
      summary: {
        totalRows: parsedCSV.rows.length,
        imported: crmRecords.length,
        skipped: skippedRecords,
      },
      records: crmRecords,
      metadata: {
        headers: parsedCSV.headers,
        processedBatches: Math.ceil(parsedCSV.rows.length / 100),
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};