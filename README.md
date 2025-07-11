# Hospital Management System

A modern hospital management system with role-based access control, built with React (Frontend) and Node.js/Express (Backend). The application supports multiple user roles including patients, doctors, and administrators.

---

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### User Management
- Role-based authentication (Patient, Doctor, Admin)
- Secure JWT token handling
- Protected routes based on user roles
- Session management

### Patient Features
- Profile management
- Appointment scheduling
- Medical records access
- Prescription history

### Doctor Features
- Patient records access
- Appointment management
- Prescription creation
- Medical history review

### Admin Features
- User management
- System configuration
- Access control
- Activity logs

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection and other settings

4. Run database migrations:
   ```bash
   node migrate.js
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`

## Project Structure

```
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── migrate.js      # Database migration script
│   └── server.js       # Main server file
│
├── frontend/
│   ├── public/         # Static files
│   └── src/
│       ├── assets/     # Images, fonts, etc.
│       ├── components/ # Reusable UI components
│       ├── contexts/   # React contexts
│       ├── pages/      # Page components
│       └── App.js      # Main App component
│
├── .env.example        # Example environment variables
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Backend
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

## Deployment

### Backend Deployment
1. Set up a PostgreSQL database
2. Configure environment variables
3. Run migrations
4. Start the server with PM2 or similar process manager

### Frontend Deployment
1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` folder to a static hosting service (Vercel, Netlify, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
  - Access treatment history
  - Download medical reports
  - Track prescriptions

### Doctor Dashboard
- **Patient Management**
  - View complete patient profiles
  - Access medical history
  - Track treatment progress
- **Appointment Management**
  - View daily schedule
  - Check patient appointment history
  - Request test orders
- **Prescription System**
  - Generate electronic prescriptions
  - View prescription history
  - Set medication dosages and schedules

### Nursing Module
- **Patient Care**
  - Record vital signs
  - Update patient charts
  - Document care provided
  - Monitor patient status
- **Task Management**
  - View assigned patients
  - Track medication administration
  - Document patient responses
  - Flag issues to doctors

### Pharmacy Management
- **Inventory Control**
  - Track medication stock levels
  - Set low stock alerts
  - Manage suppliers
  - Track medication expiration dates
- **Prescription Processing**
  - Receive and verify prescriptions
  - Check for drug interactions
  - Process refill requests
  - Generate medication labels

### Appointment System
- **Scheduling**
  - Real-time availability
  - Multiple doctor scheduling
  - Room allocation
  - Automated reminders
- **Calendar Integration**
  - Sync with Google/Outlook calendars
  - Send SMS/email reminders
  - Handle cancellations and rescheduling

### Reporting & Analytics
- **Patient Statistics**
  - Treatment outcomes
  - Appointment history
  - Billing reports
- **Operational Reports**
  - Staff performance
  - Resource utilization
  - Revenue tracking

### Security & Compliance

### Data Protection
- **Encryption**
  - End-to-end TLS 1.3 encryption for all data in transit
  - AES-256 encryption for data at rest
  - Field-level encryption for sensitive health information (PHI)
  - Secure key management with regular rotation

### Authentication & Authorization
- **Multi-factor Authentication (MFA)**
  - Required for all privileged accounts
  - Support for TOTP, SMS, and authenticator apps
  - Biometric authentication for mobile access
- **Role-Based Access Control (RBAC)**
  - Granular permission system
  - Principle of least privilege enforcement
  - Session timeouts and automatic logouts
  - Concurrent session control

### Network Security
- **Infrastructure**
  - Web Application Firewall (WAF) protection
  - DDoS mitigation and protection
  - Regular security patching and updates
  - Network segmentation for sensitive data
- **API Security**
  - Rate limiting and throttling
  - IP whitelisting capabilities
  - Request validation and sanitization
  - CORS policy enforcement

### Compliance & Standards
- **Regulatory Compliance**
  - HIPAA/HITECH compliance
  - GDPR compliance for EU data subjects
  - SOC 2 Type II certification
  - Regular third-party security audits
- **Data Privacy**
  - Data minimization principles
  - Right to be forgotten implementation
  - Data retention policies
  - Privacy by design architecture

### Security Monitoring & Response
- **Logging & Monitoring**
  - Comprehensive audit logging
  - Real-time security monitoring
  - Security Information and Event Management (SIEM) integration
  - Anomaly detection for suspicious activities
- **Incident Response**
  - 24/7 security operations center (SOC)
  - Incident response plan (IRP)
  - Data breach notification procedures
  - Regular security drills and testing

### Secure Development
- **SDLC Security**
  - Secure coding standards (OWASP Top 10)
  - Static and dynamic code analysis
  - Dependency vulnerability scanning
  - Regular security training for developers
- **Vulnerability Management**
  - Regular penetration testing
  - Bug bounty program
  - Security patch management
  - Third-party dependency updates

---

## System Architecture
- **Frontend:** React SPA (Single Page Application)
- **Backend:** Node.js with Express.js REST API
- **Database:** MongoDB (local or cloud)
- **Authentication:** JWT tokens
- **Deployment:** Vercel or any cloud platform

---

## User Roles & Permissions

### Patients
- **Profile Management**
  - Create and update personal profile
  - Upload medical documents
  - Set health preferences
  - Manage contact information
- **Appointments**
  - Book appointments with doctors
  - Receive appointment reminders
  - Cancel or reschedule appointments
  - View appointment history
- **Medical Access**
  - View personal health records
  - Access test results
  - Track medication history
  - Download medical reports

### Doctors
- **Patient Care**
  - Access complete patient records
  - Document diagnoses
  - Order lab tests
  - Track treatment progress
- **Prescription Authority**
  - Issue new prescriptions
  - Renew existing prescriptions
  - Set medication dosages
  - Check for drug interactions
- **Appointment Management**
  - View daily schedule
  - Access patient history
  - Request consultations
  - Document visit notes

### Nurses
- **Patient Interaction**
  - Record vital signs
  - Document care provided
  - Update patient charts
  - Monitor patient status
- **Clinical Support**
  - Prepare patients for examination
  - Assist with procedures
  - Administer medications
  - Collect lab specimens
- **Documentation**
  - Maintain nursing notes
  - Record patient responses
  - Document care plans
  - Track medication administration

### Pharmacy Staff
- **Inventory Management**
  - Track medication stock
  - Process new inventory
  - Monitor expiration dates
  - Generate restock reports
- **Prescription Handling**
  - Process new prescriptions
  - Manage refill requests
  - Verify doctor orders
  - Check for drug interactions
- **Patient Service**
  - Provide medication counseling
  - Process insurance claims
  - Handle billing
  - Manage patient profiles

### Administrative Staff
- **Appointment Scheduling**
  - Manage doctor schedules
  - Handle patient check-ins
  - Process cancellations
  - Send reminders
- **Records Management**
  - Maintain patient files
  - Process document requests
  - Handle billing information
  - Generate reports

### System Administrator
- **User Management**
  - Create and manage user accounts
  - Assign roles and permissions
  - Reset passwords
  - Monitor system access
- **System Configuration**
  - Set up clinic parameters
  - Configure billing settings
  - Manage system integrations
  - Perform system maintenance

---

## Project Structure
```
fydp/
├── backend/
│   ├── config/         # DB and app configuration
│   ├── controllers/    # Route controllers (auth, patient, doctor, etc.)
│   ├── middleware/     # Auth, role, error handling
│   ├── models/         # Mongoose models (User, PatientInfo)
│   ├── routes/         # Express route definitions
│   ├── server.js       # Main backend entry point
│   └── package.json    # Backend dependencies
├── frontend/
│   ├── public/         # Static assets
│   ├── src/            # React source code
│   │   ├── components/ # UI components (auth, dashboard, etc.)
│   │   └── ...
│   └── package.json    # Frontend dependencies
├── .env.example        # Example environment variables
├── vercel.json         # Vercel deployment config
└── README.md           # Project documentation
```

---

## Setup & Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp ../.env.example .env
   ```
4. Update the `.env` file with your MongoDB URI, JWT secret, etc.
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run at `http://localhost:5000` by default.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000` by default.

---

## Deployment

### Deploying with Vercel
1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and import your repository.
3. Configure the following environment variables in your Vercel project settings:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret for JWT authentication
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Vercel deployment URL
   - `SESSION_SECRET`: Secret for session management
4. Vercel will auto-detect the configuration from `vercel.json` and deploy your application.

---

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT authentication
- `SESSION_SECRET`: Secret for session management
- `NODE_ENV`: `development` or `production`
- `FRONTEND_URL`: Frontend app URL (for CORS and redirects)

See `.env.example` for all required variables.

---

## API Overview

**Base URL:** `/api`

### Auth
- `POST /api/auth/register` — Register as patient or doctor
- `POST /api/auth/login` — Login as patient or doctor

### Patient
- `POST /api/patient/info` — Upload/update patient info (patient only)
- `GET /api/patient/info` — Get own info (patient only)

### Doctor
- `GET /api/doctor/patients` — Get all patient info (doctor only)

**All endpoints require JWT authentication.**

---

## Contribution Guidelines

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
2. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
3. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
4. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
