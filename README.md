# FYDP - Hospital Management System

A full-stack application for hospital management with React frontend and Node.js/Express backend.

## Project Structure

```
fydp/
├── backend/           # Express.js server
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── frontend/         # React application
│   ├── public/       # Static files
│   ├── src/          # React source code
│   └── package.json  # Frontend dependencies
├── .env.example      # Example environment variables
├── vercel.json       # Vercel configuration
└── README.md         # This file
```

## Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB (local or cloud)

## Local Development

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and copy the contents from `.env.example`:
   ```bash
   cp ../.env.example .env
   ```

4. Update the `.env` file with your configuration.

5. Start the development server:
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Deployment with Vercel

1. Push your code to a GitHub repository.

2. Sign in to [Vercel](https://vercel.com) and import your repository.

3. Configure the following environment variables in the Vercel project settings:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel deployment URL
   - `SESSION_SECRET`: A secure secret for sessions

4. Vercel will automatically detect the configuration from `vercel.json` and deploy your application.

## Environment Variables

See `.env.example` for all required environment variables.

## API Documentation

API documentation is available at `/api-docs` when running the backend in development mode.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
