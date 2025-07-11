import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import components
import Navbar from './components/common/Navbar';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import PublicRoute from './components/common/PublicRoute';

// Import pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';

// Import styles
import './styles/main.css';

// Create a client
const queryClient = new QueryClient();

// Custom wrapper for protected routes with role-based access
const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public route wrapper
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = window.location;
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  
  return children;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink
    },
    background: {
      default: '#f5f5f5', // Light gray
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Main layout component that includes Navbar and content
const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div className="container">
          {children}
        </div>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes - No Layout */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              
              {/* Protected Routes - With Layout */}
              <Route path="/" element={
                <RoleBasedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RoleBasedRoute>
              } />
              
              <Route path="/dashboard" element={
                <RoleBasedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RoleBasedRoute>
              } />
              
              <Route path="/doctor/dashboard" element={
                <RoleBasedRoute requiredRole="doctor">
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RoleBasedRoute>
              }>
                <Route path="patients" element={<div>Patient List</div>} />
                <Route path="profile" element={<div>Doctor Profile</div>} />
              </Route>
              
              <Route path="/patient/dashboard" element={
                <RoleBasedRoute requiredRole="patient">
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RoleBasedRoute>
              }>
                <Route path="appointments" element={<div>My Appointments</div>} />
                <Route path="find-doctors" element={<div>Find Doctors</div>} />
                <Route path="profile" element={<div>My Profile</div>} />
              </Route>
              
              <Route path="/admin/dashboard" element={
                <RoleBasedRoute requiredRole="admin">
                  <Dashboard />
                </RoleBasedRoute>
              } />
              
              {/* Error Pages */}
              <Route path="/unauthorized" element={
                <div>
                  <h1>Unauthorized</h1>
                  <p>You don't have permission to access this page.</p>
                </div>
              } />
              
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 Page */}
              <Route path="*" element={
                <div>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
