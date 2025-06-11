import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <h1>Welcome to Hospital Portal</h1>
      <div className="role-cards">
        <div className="role-card patient" onClick={() => navigate('/login/patient')}>
          <h2>Patient Portal</h2>
          <button onClick={e => { e.stopPropagation(); navigate('/login/patient'); }}>Login</button>
          <button onClick={e => { e.stopPropagation(); navigate('/register/patient'); }}>Register</button>
        </div>
        <div className="role-card doctor" onClick={() => navigate('/login/doctor')}>
          <h2>Doctor Portal</h2>
          <button onClick={e => { e.stopPropagation(); navigate('/login/doctor'); }}>Login</button>
          <button onClick={e => { e.stopPropagation(); navigate('/register/doctor'); }}>Register</button>
        </div>
      </div>
    </div>
  );
};
export default Landing;
