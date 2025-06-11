// doctorController.js - Handles doctor viewing all patients
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE || process.env.DATABASE_URL || process.env.DATABASE_URL_HOSPITAL1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  // Doctor: get all patients
  getAllPatients: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT u.id, u.email, u.first_name, u.last_name, p.gender, p.blood_group, p.address, p.medical_history, p.hospital
         FROM users u
         JOIN patients p ON u.id = p.user_id`
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
