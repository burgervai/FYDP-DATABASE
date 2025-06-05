import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import './Login.css';

const Login = () => {
  const [activeRole, setActiveRole] = useState('patient');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    doctorId: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrors({});
    setApiError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (activeRole === 'doctor' && !formData.doctorId) {
      newErrors.doctorId = 'Doctor ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      if (isLogin) {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
          role: activeRole,
          ...(activeRole === 'doctor' && { doctorId: formData.doctorId })
        });
        login(response.data);
        navigate(`/${activeRole}/dashboard`);
      } else {
        const response = await authAPI.register({
          ...formData,
          role: activeRole
        });
        // After successful registration, switch to login form
        setIsLogin(true);
        setApiError('Registration successful! Please log in.');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 
        (isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>HealthCare System</h1>
        
        <div className="role-selector">
          <button 
            type="button"
            className={`role-btn ${activeRole === 'patient' ? 'active' : ''}`}
            onClick={() => handleRoleChange('patient')}
          >
            Patient {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <button 
            type="button"
            className={`role-btn ${activeRole === 'doctor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('doctor')}
          >
            Doctor {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
        
        {apiError && (
          <div className={`alert-message ${apiError.includes('success') ? 'success' : 'error'}`}>
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          )}
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          {activeRole === 'doctor' && (
            <div className="form-group">
              <input
                type="text"
                name="doctorId"
                placeholder="Doctor ID"
                value={formData.doctorId}
                onChange={handleInputChange}
                className={errors.doctorId ? 'error' : ''}
              />
              {errors.doctorId && <span className="error-text">{errors.doctorId}</span>}
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div className="register-link">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setIsLogin(false);
                setErrors({});
                setApiError('');
              }}>
                Register as {activeRole}
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setIsLogin(true);
                setErrors({});
                setApiError('');
              }}>
                Login
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
