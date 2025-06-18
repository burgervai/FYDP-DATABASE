import axios from 'axios';
import API_ROUTES from '../config/api';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with requests
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(API_ROUTES.AUTH.REFRESH, { refreshToken });
        const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Update tokens in localStorage
        localStorage.setItem('token', newToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Patient endpoints
  loginPatient: (credentials) => api.post('/auth/login/patient', credentials),
  registerPatient: (data) => api.post('/auth/register/patient', data),
  getPatientProfile: (token) => api.get('/patient/me', { headers: { Authorization: `Bearer ${token}` } }),

  // Doctor endpoints
  loginDoctor: (credentials) => api.post('/auth/login/doctor', credentials),
  registerDoctor: (data) => api.post('/auth/register/doctor', data),
  getDoctorPatients: (token) => api.get('/doctor/patients', { headers: { Authorization: `Bearer ${token}` } }),
};

// Users API
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Appointments API
export const appointmentAPI = {
  getAppointments: () => api.get('/appointments'),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  getDoctorAppointments: () => api.get('/appointments/doctor/me'),
  getPatientAppointments: () => api.get('/appointments/patient/me'),
};

export default api;
