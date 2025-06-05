import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Profile</h2>
          <div className="user-info">
            <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
            {role === 'doctor' && (
              <p><strong>Specialization:</strong> {user?.specialization || 'N/A'}</p>
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            {role === 'doctor' ? (
              <>
                <button className="action-btn">View Appointments</button>
                <button className="action-btn">My Patients</button>
                <button className="action-btn">Prescriptions</button>
              </>
            ) : (
              <>
                <button className="action-btn">Book Appointment</button>
                <button className="action-btn">My Medical Records</button>
                <button className="action-btn">Find a Doctor</button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
