const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require('cookie-parser');
// Removed express-mongo-sanitize due to Express 5 req.query setter limitation
// We'll use a lightweight custom sanitizer instead
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
// Swagger will be required later after routes

// Load environment variables
require('dotenv').config();

// Database connection
const connectDB = require("./config/db");

// Import middleware
const errorHandler = require('./middleware/errorMiddleware');

// Route imports
const doctorRoutes = require("./routes/doctorRoutes");
const patientRecordRoutes = require("./routes/patientRecordRoutes");
const patientAppointmentRoutes = require("./routes/doctorAppoinmentRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const doctorDashboardRoutes = require('./routes/doctorDashboardRoutes');
const patientProfileRoutes = require('./routes/patientProfileRoutes');
const doctorOperationsRoutes = require('./routes/doctorOperationsRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Temporarily disable Swagger to check for path-to-regexp errors
// const { specs, swaggerUi, swaggerOptions } = require('./docs/api-docs');

// Connect to MongoDB (connection happens before starting the server below)
connectDB().catch((err) => {
  console.error('Failed to connect to DB:', err?.message || err);
  process.exit(1);
});

// Set security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow any localhost/127.0.0.1 origin (any port) during development
        const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/.test(origin);
        if (!isLocalhost && allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            console.warn(`[CORS] Blocked origin: ${origin}`);
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Total-Count']
}));

// Trust proxy (helps express-rate-limit identify client IPs correctly)
app.set('trust proxy', 1);

// Rate limiting (relaxed in development to prevent 429s during local testing)
const isDev = process.env.NODE_ENV !== 'production';
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: isDev ? 1000 : 100, // express-rate-limit v8 uses `limit`
  standardHeaders: 'draft-7', // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});
app.use(limiter);

// Body parser with larger limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection (custom)
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    // If key contains prohibited characters, delete it
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    const val = obj[key];
    if (val && typeof val === 'object') sanitizeObject(val);
  }
  return obj;
}

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') sanitizeObject(req.body);
  if (req.params && typeof req.params === 'object') sanitizeObject(req.params);
  // Mutate existing req.query object without reassigning
  if (req.query && typeof req.query === 'object') sanitizeObject(req.query);
  next();
});

// Custom XSS sanitizer (replaces xss-clean for Express 5 compatibility)
app.use((req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/[<>"]/g, '');
      }
    });
  }
  next();
});

// Prevent parameter pollution
app.use(hpp());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Ensure all directories exist
const uploadPath = path.join(__dirname, "uploads");
const documentsPath = path.join(__dirname, "uploads", "documents");
const imagesPath = path.join(__dirname, "images");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
}
if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
}

// Static file serving with proper CORS headers
app.use("/uploads", express.static("uploads"));
app.use("/documents", express.static(path.join(__dirname, "uploads", "documents")));

// CRITICAL: Proper images route with CORS headers
app.use('/images', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cache-Control', 'public, max-age=86400');
    next();
}, express.static(path.join(__dirname, 'images')));

// Root route - must be before other routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital Management API is running",
    version: "1.0.0",
    documentation: "/api-docs"
  });
});

// API Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patient-records", patientRecordRoutes);
app.use("/api/appointments", patientAppointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/doctor-dashboard", doctorDashboardRoutes);
app.use("/api/patient-profiles", patientProfileRoutes);
app.use("/api/doctor-operations", doctorOperationsRoutes);
app.use('/api', emergencyRoutes);
app.use('/api', chatbotRoutes);

// Hospital routes
const hospitalRoutes = require('./routes/hospitalRoutes');
app.use('/api/hospitals', hospitalRoutes);

// Swagger documentation
const { specs, swaggerUi, swaggerOptions } = require('./docs/api-docs');
app.use('/api-docs', 
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    ...swaggerOptions,
    customSiteTitle: 'Hospital Management API',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: false
  })
);

// Error handling middleware
app.use(errorHandler);

// Handle 404 - Must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Remove duplicate root route

// Test images directory
app.get('/test-images', (req, res) => {
    const imagesDir = path.join(__dirname, 'images');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Cannot read images directory' });
        }
        res.json({ 
            message: 'Images directory contents',
            files: files,
            path: imagesDir
        });
    });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Access from network: http://${require('os').hostname()}:${PORT}`);
});

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(`Error: ${err.name}, ${err.message}`);
  console.error(err.stack);
  
  // Attempt a graceful shutdown
  server.close(() => {
    console.log('Server closed due to uncaught exception');
    process.exit(1);
  });
  
  // Force shutdown if server doesn't close in time
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 1000).unref();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
  
  // Close server and exit
  server.close(() => {
    console.log('Server closed due to unhandled rejection');
    process.exit(1);
  });
  
  // Force shutdown if server doesn't close in time
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 1000).unref();
});
