// server.js - Main entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { verifyRecaptcha } = require('google-recaptcha-v3');
const { sequelize, testConnection } = require('./config/db');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');
const auditRequest = require('./middleware/auditMiddleware');
require('dotenv').config();

const app = express();

// Import models to register them with Sequelize
require('./models/User');
require('./models/PatientInfo');

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
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
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);

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
