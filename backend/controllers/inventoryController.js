const { pool } = require('../db');

// List all inventory items
exports.getInventory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory_items ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add or update inventory item
exports.upsertInventoryItem = async (req, res) => {
  const { id, name, description, quantity, unit } = req.body;
  try {
    if (id) {
      // Update
      await pool.query('UPDATE inventory_items SET name=$1, description=$2, quantity=$3, unit=$4, last_updated=NOW() WHERE id=$5', [name, description, quantity, unit, id]);
      res.json({ message: 'Inventory item updated' });
    } else {
      // Insert
      await pool.query('INSERT INTO inventory_items (name, description, quantity, unit) VALUES ($1,$2,$3,$4)', [name, description, quantity, unit]);
      res.status(201).json({ message: 'Inventory item created' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
