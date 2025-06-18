const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Connect to the default 'postgres' database to create a new database
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default database
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  });

  const dbName = process.env.DB_NAME || 'healthcare_central';

  try {
    await client.connect();
    console.log(`🔄 Creating database: ${dbName}`);
    
    // Check if database exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    
    if (res.rows.length === 0) {
      // Create the database if it doesn't exist
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`ℹ️  Database '${dbName}' already exists`);
    }
  } catch (error) {
    console.error('❌ Error creating database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
