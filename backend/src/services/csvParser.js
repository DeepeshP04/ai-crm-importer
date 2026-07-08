const Papa = require("papaparse");

const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const csvString = buffer.toString("utf-8");

    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          headers: results.meta.fields || [],
          rows: results.data,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

module.exports = parseCSV;