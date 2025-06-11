import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    email: '', password: '', first_name: '', last_name: '', gender: '', dob: '', blood_group: '', address: '', hospital: '', medical_history: '', emergency_contact: '', specialization: '', degree: '', experience: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm({ ...form, specialization: '', degree: '', experience: '', gender: '', dob: '', blood_group: '', address: '', hospital: '', medical_history: '', emergency_contact: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { ...form, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>Role:
          <select name="role" value={role} onChange={handleRoleChange} required>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        <label>First Name:
          <input name="first_name" value={form.first_name} onChange={handleChange} required />
        </label>
        <label>Last Name:
          <input name="last_name" value={form.last_name} onChange={handleChange} required />
        </label>
        {role === 'patient' && (
          <>
            <label>Gender:
              <input name="gender" value={form.gender} onChange={handleChange} required />
            </label>
            <label>Date of Birth:
              <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
            </label>
            <label>Blood Group:
              <input name="blood_group" value={form.blood_group} onChange={handleChange} required />
            </label>
            <label>Address:
              <input name="address" value={form.address} onChange={handleChange} required />
            </label>
            <label>Hospital:
              <input name="hospital" value={form.hospital} onChange={handleChange} required />
            </label>
            <label>Medical History:
              <input name="medical_history" value={form.medical_history} onChange={handleChange} />
            </label>
            <label>Emergency Contact:
              <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} />
            </label>
          </>
        )}
        {role === 'doctor' && (
          <>
            <label>Specialization:
              <input name="specialization" value={form.specialization} onChange={handleChange} required />
            </label>
            <label>Degree:
              <input name="degree" value={form.degree} onChange={handleChange} required />
            </label>
            <label>Experience (years):
              <input name="experience" value={form.experience} onChange={handleChange} required />
            </label>
            <label>Hospital:
              <input name="hospital" value={form.hospital} onChange={handleChange} required />
            </label>
            <label>Emergency Contact:
              <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} />
            </label>
          </>
        )}
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;
