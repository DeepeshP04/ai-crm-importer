const parseCSV = require("../services/csvParser");

exports.importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required.",
      });
    }

    const parsedCSV = await parseCSV(req.file.buffer);

    res.status(200).json({
      success: true,
      message: "CSV parsed successfully.",
      file: {
        name: req.file.originalname,
        size: req.file.size,
      },
      totalRows: parsedCSV.rows.length,
      totalColumns: parsedCSV.headers.length,
      headers: parsedCSV.headers,
      preview: parsedCSV.rows.slice(0, 10),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};