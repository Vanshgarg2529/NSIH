const fs = require('fs');
const path = require('path');
const db = require('./index');

async function runSeed() {
  console.log('[SEED] Running GovInnovate seed script...');
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../../../database/schema.sql'), 'utf-8');
    const seedSql = fs.readFileSync(path.join(__dirname, '../../../database/seed.sql'), 'utf-8');

    // Split statements
    const schemaStatements = schemaSql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of schemaStatements) {
      try {
        await db.query(stmt);
      } catch (err) {
        // ignore table drop / exists warnings
      }
    }

    const seedStatements = seedSql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of seedStatements) {
      try {
        await db.query(stmt);
      } catch (err) {
        console.error('[SEED Warning]', err.message);
      }
    }

    console.log('[SEED] Database schema and seed data loaded successfully!');
  } catch (err) {
    console.error('[SEED Error]', err);
  }
}

if (require.main === module) {
  runSeed().then(() => process.exit(0));
}

module.exports = { runSeed };
