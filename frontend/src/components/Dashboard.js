import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.role === 'patient') {
      appointmentAPI.getMyAppointments().then(res => setAppointments(res.data)).catch(() => setAppointments([]));
    } else if (user.role === 'doctor') {
      appointmentAPI.getDoctorAppointments().then(res => setAppointments(res.data)).catch(() => setAppointments([]));
      // Fetch patients for doctor
      fetch('/api/auth/patients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setPatients(data))
        .catch(() => setPatients([]));
    }
  }, [user]);

  if (!user) return null;
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
