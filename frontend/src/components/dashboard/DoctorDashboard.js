import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const { getProfile } = useAuth();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('token');
      const data = await getProfile('doctor', token);
      setPatients(data);
    };
    fetchPatients();
  }, [getProfile]);

  if (!patients || patients.length === 0) return <div>No patients found.</div>;

  return (
    <div className="dashboard-container">
      <h2>Doctor Dashboard</h2>
      <table className="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Blood Group</th>
            <th>Address</th>
            <th>Hospital</th>
            <th>Medical History</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.email}</td>
              <td>{p.gender}</td>
              <td>{p.blood_group}</td>
              <td>{p.address}</td>
              <td>{p.hospital}</td>
              <td>{p.medical_history}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DoctorDashboard;
