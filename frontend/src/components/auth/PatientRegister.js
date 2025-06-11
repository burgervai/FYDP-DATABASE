import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PatientRegister = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '', password: '', first_name: '', last_name: '', gender: '', blood_group: '', address: '', medical_history: '', hospital: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const res = await register(form, 'patient');
    if (res.success) {
      navigate('/login/patient');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} required />
        <input name="blood_group" placeholder="Blood Group" value={form.blood_group} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="hospital" placeholder="Hospital" value={form.hospital} onChange={handleChange} required />
        <textarea name="medical_history" placeholder="Medical History" value={form.medical_history} onChange={handleChange} />
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
export default PatientRegister;
