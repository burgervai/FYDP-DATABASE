const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE || process.env.DATABASE_URL_HOSPITAL1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const logAction = async (userId, action, status, ip, details = {}) => {
  const query = `
    INSERT INTO audit_logs (user_id, action, status, ip_address, details, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
  `;
  
  try {
    await pool.query(query, [userId, action, status, ip, JSON.stringify(details)]);
  } catch (err) {
    console.error('Error logging audit action:', err);
  }
};

module.exports = { logAction };
