# FYDP - Hospital Patient-Doctor Database System

A robust full-stack hospital management system for securely managing patient and doctor information, built with a React frontend and Node.js/Express backend. The system supports role-based access, allowing patients to manage their own data and doctors to view all patient records.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [User Roles & Permissions](#user-roles--permissions)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Project Overview
This application enables hospitals to manage patient records and doctor access securely. Patients can register, log in, and manage their data, while doctors can access and review all patient records. All sensitive information is securely stored in a database, and access is strictly role-based.

---

## Features
- **Patient Registration & Login**
- **Doctor Registration & Login**
- **Role-Based Access Control**
- **Patients:**
  - Upload and update their personal and medical information
  - View only their own records
- **Doctors:**
  - View all patient records
- **Secure Authentication (JWT)**
- **RESTful API**
- **Modern React Frontend**
- **Environment-based configuration**
- **Extensible for additional hospital modules (appointments, pharmacy, etc.)**

---

## System Architecture
- **Frontend:** React SPA (Single Page Application)
- **Backend:** Node.js with Express.js REST API
- **Database:** MongoDB (local or cloud)
- **Authentication:** JWT tokens
- **Deployment:** Vercel or any cloud platform

---

## User Roles & Permissions
- **Patient:**
  - Can register and log in
  - Can upload, update, and view only their own information
  - Cannot access other patients’ or doctors’ information
- **Doctor:**
  - Can register and log in
  - Can view all patient information
  - Cannot modify patient data (unless extended)

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
