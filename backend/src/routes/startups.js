const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/startups
router.get('/', async (req, res) => {
  try {
    const startups = await db.query('SELECT * FROM startups ORDER BY company_name ASC');
    res.json({ startups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/startups/:id
router.get('/:id', async (req, res) => {
  try {
    const startups = await db.query('SELECT * FROM startups WHERE id = $1', [req.params.id]);
    if (!startups || startups.length === 0) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    const solutions = await db.query('SELECT * FROM solutions WHERE startup_id = $1', [req.params.id]);
    res.json({ startup: startups[0], solutions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
