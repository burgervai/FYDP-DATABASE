const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh-token`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/me`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
  },
  // Add other API endpoints as needed
};
