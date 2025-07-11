const { pool } = require('../db');

// Book appointment (patient)
exports.bookAppointment = async (req, res) => {
  const { doctor_id, appointment_datetime, reason, notes } = req.body;
  const patient_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, reason, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patient_id, doctor_id, appointment_datetime, reason, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all appointments for doctor
exports.getDoctorAppointments = async (req, res) => {
  const doctor_id = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM appointments WHERE doctor_id = $1 ORDER BY appointment_datetime DESC',
      [doctor_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all appointments for patient
exports.getPatientAppointments = async (req, res) => {
  const patient_id = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM appointments WHERE patient_id = $1 ORDER BY appointment_datetime DESC',
      [patient_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all appointments (admin/doctor)
exports.getAllAppointments = async (req, res) => {
  try {
    const userRole = req.user.role;
    let result;
    if (userRole === 'admin') {
      result = await pool.query('SELECT * FROM appointments ORDER BY appointment_datetime DESC');
    } else if (userRole === 'doctor') {
      result = await pool.query('SELECT * FROM appointments WHERE doctor_id = $1 ORDER BY appointment_datetime DESC', [req.user.id]);
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get appointment by ID (admin/doctor/patient if owned)
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const appt = result.rows[0];
    if (
      userRole !== 'admin' &&
      !(userRole === 'doctor' && appt.doctor_id === userId) &&
      !(userRole === 'patient' && appt.patient_id === userId)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update appointment (admin/doctor/patient if owned)
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const appt = result.rows[0];
    if (
      userRole !== 'admin' &&
      !(userRole === 'doctor' && appt.doctor_id === userId) &&
      !(userRole === 'patient' && appt.patient_id === userId)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { appointment_datetime, reason, notes } = req.body;
    await pool.query(
      'UPDATE appointments SET appointment_datetime = $1, reason = $2, notes = $3 WHERE id = $4',
      [appointment_datetime, reason, notes, id]
    );
    res.json({ message: 'Appointment updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete appointment (admin/doctor/patient if owned)
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const appt = result.rows[0];
    if (
      userRole !== 'admin' &&
      !(userRole === 'doctor' && appt.doctor_id === userId) &&
      !(userRole === 'patient' && appt.patient_id === userId)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
