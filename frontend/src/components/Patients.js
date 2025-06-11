import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Patients = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetch('/api/auth/patients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setPatients(data))
        .catch(() => setPatients([]));
    }
  }, [user]);

  if (!user || user.role !== 'doctor') return <div>Access denied.</div>;

  return (
    <div className="patients-container">
      <h2>All Patients</h2>
      <ul>
        {patients.map(p => (
          <li key={p.user_id}>{p.first_name} {p.last_name} ({p.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default Patients;
