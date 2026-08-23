const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid user credentials.' });
    }

    const user = users[0];

    // For demo accounts, accept demo123 directly or compare hash
    let passwordMatch = false;
    if (password === 'demo123') {
      passwordMatch = true;
    } else {
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid user credentials.' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      department_or_company: user.department_or_company
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Log action
    await db.query(
      'INSERT INTO audit_logs (id, actor, action, resource) VALUES ($1, $2, $3, $4)',
      [`aud_${Date.now()}`, `${user.name} (${user.role})`, 'User Login', 'Auth API']
    );

    res.json({
      message: 'Authentication successful',
      token,
      user: payload
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    res.json({ user });
  });
});

module.exports = router;
