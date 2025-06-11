import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="main-header">
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/appointments">Appointments</Link>
        {user && user.role === 'doctor' && <Link to="/patients">Patients</Link>}
        <span style={{ flex: 1 }} />
        {user ? (
          <>
            <span>{user.email} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
