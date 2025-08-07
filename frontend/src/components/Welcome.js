import React from 'react';
<<<<<<< HEAD
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Welcome = ({ onUserTypeSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">HealthCare</h1>
          <p className="text-gray-600 text-lg">Your digital health companion</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onUserTypeSelect('patient')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue as Patient
          </button>
          
          <button
            onClick={() => onUserTypeSelect('doctor')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue as Doctor
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Secure • Private • Professional
          </p>
        </div>
      </div>
    </div>
  );
};
=======
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#aef9e4', // Greenish white background
        color: '#2e7d32', // Dark green text
        textAlign: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mb: 4,
            }}
          >
            <MedicalServicesIcon sx={{ fontSize: 80, color: '#4CAF50' }} />
            <PersonIcon sx={{ fontSize: 80, color: '#4CAF50' }} />
          </Box>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome To
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              color: '#4CAF50',
              mb: 2
            }}
          >
            OFTEN
>>>>>>> fcb428aeb8d77991150b80de81d392862bf3f7c8
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, color: '#e0e0e0' }}>
            Your health Our Priority
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' },
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': { 
                borderColor: '#e0e0e0',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Welcome;
