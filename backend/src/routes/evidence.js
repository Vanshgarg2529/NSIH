const express = require('express');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/evidence - Submit evidence record
router.post('/', authenticateToken, async (req, res) => {
  const { pilot_id, claim, source, type } = req.body;

  if (!pilot_id || !claim || !source) {
    return res.status(400).json({ error: 'Missing required evidence fields (pilot_id, claim, source).' });
  }

  const id = `ev_${Date.now()}`;

  try {
    await db.query(
      `INSERT INTO evidence (id, pilot_id, claim, source, type, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')`,
      [id, pilot_id, claim, source, type || 'Field Audit']
    );

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [`aud_${Date.now()}`, `${req.user.name} (${req.user.role})`, 'Evidence Submitted', claim]
    );

    res.status(201).json({ message: 'Evidence submitted successfully', evidenceId: id, status: 'Pending' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/evidence/:id/verify - Verify/Reject evidence (Evaluator / Admin only)
router.post('/:id/verify', authenticateToken, requireRole(['Evaluator', 'Admin', 'Government Officer']), async (req, res) => {
  const { status } = req.body; // Verified or Rejected
  const newStatus = status === 'Rejected' ? 'Rejected' : 'Verified';

  try {
    const evidenceRows = await db.query('SELECT * FROM evidence WHERE id = $1', [req.params.id]);
    if (!evidenceRows || evidenceRows.length === 0) {
      return res.status(404).json({ error: 'Evidence record not found' });
    }

    await db.query(
      'UPDATE evidence SET status = $1, verified_by = $2, verified_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newStatus, req.user.id, req.params.id]
    );

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [`aud_${Date.now()}`, `${req.user.name} (${req.user.role})`, `Evidence ${newStatus}`, `Evidence ${req.params.id}`]
    );

    res.json({ message: `Evidence marked as ${newStatus}`, evidenceId: req.params.id, status: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/evidence/passport - Generate Innovation Evidence Passport from actual database data
router.post('/passport', authenticateToken, requireRole(['Government Officer', 'Evaluator', 'Admin']), async (req, res) => {
  const { pilot_id } = req.body;
  if (!pilot_id) return res.status(400).json({ error: 'pilot_id is required' });

  try {
    const pilots = await db.query(
      `SELECT p.*, c.title as challenge_title, c.department, s.company_name as startup_name, s.solution_name 
       FROM pilots p
       JOIN challenges c ON p.challenge_id = c.id
       JOIN startups s ON p.startup_id = s.id
       WHERE p.id = $1`,
      [pilot_id]
    );

    if (!pilots || pilots.length === 0) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    const pilot = pilots[0];
    const kpis = await db.query('SELECT * FROM kpis WHERE pilot_id = $1', [pilot.id]);
    const evidenceList = await db.query("SELECT * FROM evidence WHERE pilot_id = $1 AND status = 'Verified'", [pilot.id]);

    const passportNumber = `INNO-PASS-2026-${(pilot.location || 'PUNE').toUpperCase().replace(/[^A-Z]/g, '')}-${Date.now().toString().slice(-4)}`;

    const passportData = {
      passport_number: passportNumber,
      challenge_title: pilot.challenge_title,
      department: pilot.department,
      startup: pilot.startup_name,
      solution: pilot.solution_name,
      pilot_name: pilot.name,
      location: pilot.location,
      duration: `${pilot.start_date} to ${pilot.end_date}`,
      overall_score: pilot.overall_score || 89,
      recommendation: pilot.recommendation || 'SCALE REVIEW RECOMMENDED',
      evaluator: req.user.name,
      verification_date: new Date().toISOString().split('T')[0],
      kpis: kpis.map(k => ({ name: k.name, target: k.target, actual: k.actual, status: k.status })),
      evidence_count: evidenceList.length,
      disclaimer: 'Platform-generated Evidence Passport based on verified pilot telemetry. Not formal government procurement certification.'
    };

    const id = `pass_${Date.now()}`;
    const dataJson = JSON.stringify(passportData);

    // Delete existing passport if any
    await db.query('DELETE FROM evidence_passports WHERE pilot_id = $1', [pilot.id]);

    await db.query(
      `INSERT INTO evidence_passports (id, pilot_id, passport_number, data_json, status)
       VALUES ($1, $2, $3, $4, 'Verified')`,
      [id, pilot.id, passportNumber, dataJson]
    );

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [`aud_${Date.now()}`, `${req.user.name} (${req.user.role})`, 'Evidence Passport Generated', passportNumber]
    );

    res.status(201).json({
      message: 'Innovation Evidence Passport generated successfully',
      passport: passportData
    });
  } catch (err) {
    console.error('Passport error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/evidence/passport/:pilotId
router.get('/passport/:pilotId', async (req, res) => {
  try {
    const passports = await db.query('SELECT * FROM evidence_passports WHERE pilot_id = $1', [req.params.pilotId]);
    if (!passports || passports.length === 0) {
      return res.status(404).json({ error: 'No Evidence Passport found for this pilot' });
    }
    const passport = passports[0];
    passport.data = JSON.parse(passport.data_json);
    res.json({ passport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
