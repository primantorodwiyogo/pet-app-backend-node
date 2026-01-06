const pool = require('../config/database');

exports.dbTest = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    res.json({
      status: 'OK',
      db: 'connected',
      result: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      message: err.message,
    });
  }
};
