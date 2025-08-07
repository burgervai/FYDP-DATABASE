// server.js - Main entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { sequelize, testConnection } = require('./config/db');
const apiRoutes = require('./routes'); // This will automatically load index.js
const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');
const auditRequest = require('./middleware/auditMiddleware');
require('dotenv').config();

const app = express();

// Import models to register them with Sequelize
require('./models/User');
require('./models/PatientInfo');
require('./models/Hospital'); // Add other models as needed

// Security middleware
app.use(helmet());
// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',  // Local development
  'http://localhost:3001',  // Alternate local port
  'https://fydp-database.vercel.app',  // Your Vercel app URL
  'https://*.vercel.app'  // Any Vercel preview URLs
];

// Add any custom domains from environment variable
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(morgan('dev'));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Log all requests for audit
app.use(auditRequest);

// Simple health check route
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await testConnection();
    
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server and database are running',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL (Neon)'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api', apiRoutes); // All routes are now mounted under /api in routes/index.js

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use(errorHandler);

// Start the server when running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5004;

  const startServer = async () => {
    try {
      // Test database connection
      await testConnection();
      
      // Sync all models with the database
      await sequelize.sync({ alter: true });
      console.log('✅ Database synced successfully');
      
      // Start the server
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}

// Export the Express app for Vercel
module.exports = app;
