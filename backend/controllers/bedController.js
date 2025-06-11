const { pool } = require('../db');

// List all wards, rooms, beds
exports.getAllBeds = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.name AS ward, r.room_number, b.bed_number, b.is_occupied
       FROM beds b JOIN rooms r ON b.room_id = r.id JOIN wards w ON r.ward_id = w.id
       ORDER BY w.name, r.room_number, b.bed_number`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Allocate bed to patient
exports.allocateBed = async (req, res) => {
  const { bed_id, patient_id } = req.body;
  try {
    await pool.query('UPDATE beds SET is_occupied = TRUE WHERE id = $1', [bed_id]);
    const result = await pool.query(
      'INSERT INTO bed_allocations (bed_id, patient_id, start_time) VALUES ($1, $2, NOW()) RETURNING *',
      [bed_id, patient_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Release bed
exports.releaseBed = async (req, res) => {
  const { bed_id } = req.body;
  try {
    await pool.query('UPDATE beds SET is_occupied = FALSE WHERE id = $1', [bed_id]);
    await pool.query('UPDATE bed_allocations SET end_time = NOW() WHERE bed_id = $1 AND end_time IS NULL', [bed_id]);
    res.json({ message: 'Bed released' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
