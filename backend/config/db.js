const { Pool } = require('pg');

// Create a new Pool instance with connection settings
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fydp',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  testConnection
};
