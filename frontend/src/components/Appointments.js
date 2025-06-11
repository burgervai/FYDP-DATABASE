import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor_id: '', appointment_datetime: '', reason: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    if (user.role === 'patient') {
      appointmentAPI.getMyAppointments().then(res => setAppointments(res.data)).catch(() => setAppointments([]));
      // Fetch doctors list for booking
      fetch('/api/auth/doctors', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setDoctors(data))
        .catch(() => setDoctors([]));
    } else if (user.role === 'doctor') {
      appointmentAPI.getDoctorAppointments().then(res => setAppointments(res.data)).catch(() => setAppointments([]));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentAPI.create(form);
      setMessage('Appointment booked successfully!');
      setForm({ doctor_id: '', appointment_datetime: '', reason: '' });
    } catch (err) {
      setMessage('Failed to book appointment.');
    }
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      {user.role === 'patient' && (
        <>
          <form onSubmit={handleSubmit}>
            <label>Doctor:
              <select name="doctor_id" value={form.doctor_id} onChange={handleChange} required>
                <option value="">Select Doctor</option>
                {doctors.map(doc => (
                  <option key={doc.user_id} value={doc.user_id}>{doc.first_name} {doc.last_name}</option>
                ))}
              </select>
            </label>
            <label>Date & Time:
              <input type="datetime-local" name="appointment_datetime" value={form.appointment_datetime} onChange={handleChange} required />
            </label>
            <label>Reason:
              <input type="text" name="reason" value={form.reason} onChange={handleChange} required />
            </label>
            <button type="submit">Book Appointment</button>
          </form>
          {message && <p>{message}</p>}
        </>
      )}
      <h3>My Appointments</h3>
      <ul>
        {appointments.map(appt => (
          <li key={appt.id}>{new Date(appt.appointment_datetime).toLocaleString()} (Doctor: {appt.doctor_id || 'N/A'}) - {appt.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
