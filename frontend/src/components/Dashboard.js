import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, role, logout: contextLogout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch appointments based on user role
        if (role === 'patient') {
          const res = await appointmentAPI.getPatientAppointments();
          setAppointments(res.data || []);
        } else if (role === 'doctor') {
          const [apptsRes, patientsRes] = await Promise.all([
            appointmentAPI.getDoctorAppointments(),
            // Assuming you have a patients endpoint in your API
            fetch('/api/users/patients', {
              headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }).then(res => res.json())
          ]);
          
          setAppointments(apptsRes.data || []);
          setPatients(patientsRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setAppointments([]);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role, navigate]);

  const handleLogout = async () => {
    try {
      await contextLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

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
