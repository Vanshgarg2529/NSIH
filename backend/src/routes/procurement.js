const express = require('express');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/procurement/:pilotId
router.get('/:pilotId', async (req, res) => {
  try {
    const procurementRows = await db.query('SELECT * FROM procurement WHERE pilot_id = $1', [req.params.pilotId]);
    if (!procurementRows || procurementRows.length === 0) {
      return res.status(404).json({ error: 'Procurement status record not found' });
    }

    res.json({
      procurement: procurementRows[0],
      disclaimer: 'Procurement authority remains outside GovInnovate. Status tracking provided for administrative oversight.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/procurement/:pilotId - Update procurement tracking status
router.put('/:pilotId', authenticateToken, requireRole(['Government Officer', 'Admin']), async (req, res) => {
  const { status, notes } = req.body;
  const allowedStatuses = ['Pilot', 'Procurement Review', 'Order', 'Scale'];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
  }

  try {
    const procurementRows = await db.query('SELECT * FROM procurement WHERE pilot_id = $1', [req.params.pilotId]);

    if (!procurementRows || procurementRows.length === 0) {
      // Create record
      const id = `prc_${Date.now()}`;
      await db.query(
        `INSERT INTO procurement (id, pilot_id, status, notes, updated_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, req.params.pilotId, status, notes || '', req.user.id]
      );
    } else {
      // Update record
      await db.query(
        `UPDATE procurement SET status = $1, notes = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE pilot_id = $4`,
        [status, notes || '', req.user.id, req.params.pilotId]
      );
    }

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [
        `aud_${Date.now()}`,
        `${req.user.name} (${req.user.role})`,
        'Procurement Updated',
        `Updated pilot ${req.params.pilotId} status to '${status}'`
      ]
    );

    res.json({
      message: 'Procurement tracking status updated successfully',
      pilotId: req.params.pilotId,
      status,
      disclaimer: 'Procurement authority remains outside GovInnovate.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
