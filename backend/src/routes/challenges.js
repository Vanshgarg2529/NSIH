const express = require('express');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const { requestAIMatch } = require('../services/aiBridge');

const router = express.Router();

// GET /api/challenges - List all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await db.query('SELECT * FROM challenges ORDER BY created_at DESC');
    res.json({ challenges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/challenges/:id - Get challenge details
router.get('/:id', async (req, res) => {
  try {
    const challenges = await db.query('SELECT * FROM challenges WHERE id = $1', [req.params.id]);
    if (!challenges || challenges.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    const challenge = challenges[0];
    const matches = await db.query(
      `SELECT m.*, s.company_name, s.solution_name, s.technology, s.readiness, s.cost_band, s.previous_pilots 
       FROM matches m 
       JOIN startups s ON m.startup_id = s.id 
       WHERE m.challenge_id = $1 
       ORDER BY m.overall_score DESC`,
      [req.params.id]
    );

    res.json({ challenge, matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/challenges - Create a new challenge (Government Officer or Admin)
router.post('/', authenticateToken, requireRole(['Government Officer', 'Admin']), async (req, res) => {
  const {
    title, problem_statement, desired_outcome, department, category,
    location, budget, pilot_duration, tech_requirements, infra_requirements, kpis, status
  } = req.body;

  if (!title || !problem_statement || !desired_outcome || !department || !budget) {
    return res.status(400).json({ error: 'Missing required challenge fields (title, problem statement, outcome, department, budget).' });
  }

  const id = `chl_${Date.now()}`;
  const challengeStatus = status === 'Published' ? 'Published' : 'Draft';

  try {
    await db.query(
      `INSERT INTO challenges (id, title, problem_statement, desired_outcome, department, category, location, budget, pilot_duration, tech_requirements, infra_requirements, kpis, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        id, title, problem_statement, desired_outcome, department, category || 'General Innovation',
        location || 'Pune', budget, pilot_duration || '3 Months', tech_requirements || '',
        infra_requirements || '', kpis || '', challengeStatus, req.user.id
      ]
    );

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [`aud_${Date.now()}`, `${req.user.name} (${req.user.role})`, 'Challenge Created', title]
    );

    res.status(201).json({ message: 'Challenge created successfully', challengeId: id, status: challengeStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/challenges/:id/publish - Publish a challenge
router.post('/:id/publish', authenticateToken, requireRole(['Government Officer', 'Admin']), async (req, res) => {
  try {
    const challenges = await db.query('SELECT * FROM challenges WHERE id = $1', [req.params.id]);
    if (!challenges || challenges.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await db.query('UPDATE challenges SET status = $1 WHERE id = $2', ['Published', req.params.id]);

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [`aud_${Date.now()}`, `${req.user.name} (${req.user.role})`, 'Challenge Published', challenges[0].title]
    );

    res.json({ message: 'Challenge published successfully', status: 'Published' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/challenges/:id/matches - Find/Run AI matches for a challenge
router.post('/:id/matches', authenticateToken, requireRole(['Government Officer', 'Admin']), async (req, res) => {
  try {
    const challenges = await db.query('SELECT * FROM challenges WHERE id = $1', [req.params.id]);
    if (!challenges || challenges.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = challenges[0];
    const startups = await db.query('SELECT * FROM startups');

    const generatedMatches = [];

    for (const startup of startups) {
      const matchResult = await requestAIMatch(challenge, startup);

      const matchId = `mtc_${challenge.id}_${startup.id}`;
      
      // Delete existing match for this pair if any
      await db.query('DELETE FROM matches WHERE challenge_id = $1 AND startup_id = $2', [challenge.id, startup.id]);

      // Insert new match calculation
      await db.query(
        `INSERT INTO matches (id, challenge_id, startup_id, overall_score, component_scores_json, reasons_json, gaps_json, confidence, shortlisted)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          matchId,
          challenge.id,
          startup.id,
          matchResult.overall_score,
          JSON.stringify(matchResult.component_scores),
          JSON.stringify(matchResult.reasons),
          JSON.stringify(matchResult.gaps),
          matchResult.confidence,
          false
        ]
      );

      generatedMatches.push({
        id: matchId,
        startup_id: startup.id,
        company_name: startup.company_name,
        solution_name: startup.solution_name,
        overall_score: matchResult.overall_score,
        component_scores: matchResult.component_scores,
        reasons: matchResult.reasons,
        gaps: matchResult.gaps,
        confidence: matchResult.confidence,
        mode: matchResult.mode
      });
    }

    // Sort by overall score descending
    generatedMatches.sort((a, b) => b.overall_score - a.overall_score);

    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [`aud_${Date.now()}`, `${req.user.name} (${req.user.role})`, 'AI Match Run', `Matches computed for ${challenge.title}`]
    );

    res.json({
      message: 'AI match evaluation completed successfully',
      challengeId: challenge.id,
      matches: generatedMatches
    });
  } catch (err) {
    console.error('Match generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
