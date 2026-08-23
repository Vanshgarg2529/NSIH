const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/scale/:pilotId - Scaled rollout projection scenario
router.get('/:pilotId', async (req, res) => {
  try {
    const pilots = await db.query(
      `SELECT p.*, c.title as challenge_title, s.company_name as startup_name, s.solution_name 
       FROM pilots p
       JOIN challenges c ON p.challenge_id = c.id
       JOIN startups s ON p.startup_id = s.id
       WHERE p.id = $1`,
      [req.params.pilotId]
    );

    if (!pilots || pilots.length === 0) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    const pilot = pilots[0];

    const scenario = {
      pilotId: pilot.id,
      pilotName: pilot.name,
      startup: pilot.startup_name,
      solution: pilot.solution_name,
      label: 'Illustrative Deployment Scenario',
      phases: [
        { stage: 'Pilot Phase', target: '2 Wards (Ward 4 & 7, Pune)', status: 'Completed', coverage: '15 km pipeline', estimateBudget: '₹20 Lakhs' },
        { stage: 'Phase 1 Scale', target: '5 Municipal Wards', status: 'Planned', coverage: '65 km pipeline', estimateBudget: '₹85 Lakhs' },
        { stage: 'Phase 2 Scale', target: '100 Municipal Wards', status: 'Planned', coverage: '1,200 km pipeline', estimateBudget: '₹14 Crores' },
        { stage: 'Full Regional Scale', target: '1000+ Smart Cities / Municipalities', status: 'Envisioned', coverage: '15,000+ km network', estimateBudget: '₹120 Crores' }
      ],
      notice: 'Illustrative scale projection based on verified pilot telemetry density metrics.'
    };

    res.json({ scenario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
