const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { runSeed } = require('./db/seed');

const authRoutes = require('./routes/auth');
const challengeRoutes = require('./routes/challenges');
const matchRoutes = require('./routes/matches');
const startupRoutes = require('./routes/startups');
const pilotRoutes = require('./routes/pilots');
const evidenceRoutes = require('./routes/evidence');
const scaleRoutes = require('./routes/scale');
const procurementRoutes = require('./routes/procurement');
const auditRoutes = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'GovInnovate REST API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/scale', scaleRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/audit', auditRoutes);

// Seed DB on start if empty or requested
runSeed().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 GOVINNOVATE Express Backend API running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}).catch(err => {
  console.error('Failed to initialize database seed:', err);
  app.listen(PORT, () => {
    console.log(`🚀 GOVINNOVATE Express Backend API running on port ${PORT} (without fresh seed)`);
  });
});
