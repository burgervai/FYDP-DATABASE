// patientController.js - Handles patient info upload and retrieval
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE || process.env.DATABASE_URL || process.env.DATABASE_URL_HOSPITAL1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

exports.uploadInfo = (req, res) => { res.send('Upload patient info'); };

exports.getOwnInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, p.gender, p.blood_group, p.address, p.medical_history, p.hospital
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
