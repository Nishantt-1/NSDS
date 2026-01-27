const { Parser } = require('json2csv');

/**
 * Converts JSON data into CSV format for downloading
 * @param {Array} data - The array of objects from the database
 * @param {Array} fields - The specific column names to export
 * @returns {String} - The formatted CSV string
 */
const convertToCSV = (data, fields) => {
  try {
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    return csv;
  } catch (err) {
    console.error('CSV Conversion Error:', err);
    throw new Error('Failed to generate CSV report');
  }
};

module.exports = { convertToCSV };