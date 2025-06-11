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
