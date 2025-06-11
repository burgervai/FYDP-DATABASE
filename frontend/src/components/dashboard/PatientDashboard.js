import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user, getProfile } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const data = await getProfile('patient', token);
      setProfile(data);
    };
    fetchProfile();
  }, [getProfile]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Patient Dashboard</h2>
      <div className="profile-info">
        <div><b>Name:</b> {profile.first_name} {profile.last_name}</div>
        <div><b>Email:</b> {profile.email}</div>
        <div><b>Gender:</b> {profile.gender}</div>
        <div><b>Blood Group:</b> {profile.blood_group}</div>
        <div><b>Address:</b> {profile.address}</div>
        <div><b>Hospital:</b> {profile.hospital}</div>
        <div><b>Medical History:</b> {profile.medical_history}</div>
      </div>
    </div>
  );
};
export default PatientDashboard;
