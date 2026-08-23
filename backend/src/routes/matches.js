const express = require('express');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/matches/:id/shortlist - Shortlist or toggle shortlist status
router.post('/:id/shortlist', authenticateToken, requireRole(['Government Officer', 'Admin']), async (req, res) => {
  try {
    const matches = await db.query('SELECT * FROM matches WHERE id = $1', [req.params.id]);
    if (!matches || matches.length === 0) {
      return res.status(404).json({ error: 'Match record not found' });
    }

    const match = matches[0];
    const newShortlistState = match.shortlisted ? false : true;

    await db.query('UPDATE matches SET shortlisted = $1 WHERE id = $2', [newShortlistState, req.params.id]);

    // Fetch startup name for audit log
    const startups = await db.query('SELECT company_name FROM startups WHERE id = $1', [match.startup_id]);
    const companyName = startups.length > 0 ? startups[0].company_name : match.startup_id;

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [
        `aud_${Date.now()}`,
        `${req.user.name} (${req.user.role})`,
        newShortlistState ? 'Startup Shortlisted' : 'Startup Un-shortlisted',
        `${companyName} for match ${match.id}`
      ]
    );

    res.json({
      message: `Startup ${newShortlistState ? 'shortlisted' : 'removed from shortlist'} successfully`,
      matchId: match.id,
      shortlisted: newShortlistState
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
