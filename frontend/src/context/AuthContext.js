import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'patient' or 'doctor'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        if (token && storedRole) {
          setRole(storedRole);
          const profile = await getProfile(storedRole, token);
          setUser(profile);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch profile based on role
  const getProfile = async (role, token) => {
    try {
      if (!role) return null;
      if (role === 'patient') {
        const res = await authAPI.getPatientProfile(token);
        return res.data;
      } else if (role === 'doctor') {
        const res = await authAPI.getDoctorPatients(token);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  };

  // Role-based login
  const login = async (credentials, role) => {
    try {
      let response;
      if (role === 'patient') {
        response = await authAPI.loginPatient(credentials);
      } else {
        response = await authAPI.loginDoctor(credentials);
      }
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setUser(user);
      setRole(role);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Role-based registration
  const register = async (userData, role) => {
    try {
      let response;
      if (role === 'patient') {
        response = await authAPI.registerPatient(userData);
      } else {
        response = await authAPI.registerDoctor(userData);
      }
      // Registration does not log in automatically, so no token
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    getProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
