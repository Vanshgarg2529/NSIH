const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/audit - List audit logs
router.get('/', async (req, res) => {
  try {
    const logs = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
