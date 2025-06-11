import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DoctorRegister = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '', password: '', first_name: '', last_name: '', experience: '', degree: '', emergency_contact: '', hospital: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const res = await register(form, 'doctor');
    if (res.success) {
      navigate('/login/doctor');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="experience" placeholder="Experience (years)" value={form.experience} onChange={handleChange} required />
        <input name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} required />
        <input name="emergency_contact" placeholder="Emergency Contact" value={form.emergency_contact} onChange={handleChange} required />
        <input name="hospital" placeholder="Hospital" value={form.hospital} onChange={handleChange} required />
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
export default DoctorRegister;
