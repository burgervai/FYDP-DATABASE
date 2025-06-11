import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h2 style={{ color: '#d32f2f' }}>Unauthorized Access</h2>
      <p>You do not have permission to view this page.<br/>Please log in with the correct account.</p>
      <button style={{ marginTop: 24 }} onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};
export default Unauthorized;
