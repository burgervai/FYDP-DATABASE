<<<<<<< HEAD
import React, { useState } from 'react';
import { Mail, Lock, User, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = ({ userType, onLoginSuccess, onNavigateToVerification }) => {
=======
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff, MedicalServices, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
>>>>>>> fcb428aeb8d77991150b80de81d392862bf3f7c8
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
<<<<<<< HEAD
  const navigate = useNavigate();
=======
  
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || `/${userType}/dashboard`;

  const handleTabChange = (event, newValue) => {
    setUserType(newValue);
  };
>>>>>>> fcb428aeb8d77991150b80de81d392862bf3f7c8

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

<<<<<<< HEAD
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call your authentication service
    console.log('Login attempt with:', { ...formData, userType });
=======
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
>>>>>>> fcb428aeb8d77991150b80de81d392862bf3f7c8
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
        role: userType
      });
    } catch (err) {
<<<<<<< HEAD
      console.error(err);
=======
      setError(err.message || 'Failed to log in');
>>>>>>> fcb428aeb8d77991150b80de81d392862bf3f7c8
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${userType === 'doctor' ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {userType === 'doctor' ? <UserCheck className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600">Sign in as {userType}</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
            </div>

            <button
              type="submit"
              className={`w-full ${userType === 'doctor' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account? <span className="text-blue-600 cursor-pointer hover:text-blue-700">Sign up</span>
          </p>
        </div>
      </div>
    </div>
=======
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ 
        mt: 8, 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <MedicalServices color="primary" sx={{ fontSize: 50, mb: 2 }} />
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          Sign in to continue to your {userType} account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Tabs 
          value={userType} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ width: '100%', my: 2 }}
        >
          <Tab 
            icon={<Person />} 
            label="Patient" 
            value="patient"
            sx={{ 
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              }
            }} 
          />
          <Tab 
            icon={<MedicalServices />} 
            label="Healthcare Provider" 
            value="doctor"
            sx={{ 
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              }
            }} 
          />
        </Tabs>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Your Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ 
                textAlign: 'center',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot your password?
            </Typography>
          </Link>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Typography 
                  component="span" 
                  color="primary" 
                  sx={{ 
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
>>>>>>> fcb428aeb8d77991150b80de81d392862bf3f7c8
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
