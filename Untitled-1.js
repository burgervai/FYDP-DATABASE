// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const hospitals = {
    'hospital1': process.env.DATABASE_URL_HOSPITAL1,
    'hospital2': process.env.DATABASE_URL_HOSPITAL2,
    'hospital3': process.env.DATABASE_URL_HOSPITAL3,
    'hospital4': process.env.DATABASE_URL_HOSPITAL4,
    'hospital5': process.env.DATABASE_URL_HOSPITAL5,
    'hospital6': process.env.DATABASE_URL_HOSPITAL6
};

const pools = {};

// Create a pool for each hospital
Object.entries(hospitals).forEach(([hospitalId, connectionString]) => {
    if (connectionString) {
        pools[hospitalId] = new Pool({
            connectionString,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }
});

// Function to get a pool for a specific hospital
const getPool = (hospitalId) => {
    if (!pools[hospitalId]) {
        throw new Error(`No database configuration found for hospital ${hospitalId}`);
    }
    return pools[hospitalId];
};

// Function to run a query on a specific hospital's database
const query = async (hospitalId, text, params) => {
    const pool = getPool(hospitalId);
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Error executing query', { text, error });
        throw error;
    }
};

module.exports = {
    getPool,
    query
};