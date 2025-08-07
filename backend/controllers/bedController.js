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

// Get bed by ID
exports.getBedById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT w.name AS ward, r.room_number, b.bed_number, b.is_occupied
       FROM beds b JOIN rooms r ON b.room_id = r.id JOIN wards w ON r.ward_id = w.id
       WHERE b.id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create bed
exports.createBed = async (req, res) => {
  try {
    const { room_id, bed_number } = req.body;
    const result = await pool.query(
      'INSERT INTO beds (room_id, bed_number, is_occupied) VALUES ($1, $2, FALSE) RETURNING *',
      [room_id, bed_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update bed
exports.updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { bed_number, is_occupied } = req.body;
    const result = await pool.query(
      'UPDATE beds SET bed_number = $1, is_occupied = $2 WHERE id = $3 RETURNING *',
      [bed_number, is_occupied, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json({ message: 'Bed updated', bed: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete bed
exports.deleteBed = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM beds WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json({ message: 'Bed deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
