const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbDriver = 'sqlite';
let pgPool = null;
let sqliteDb = null;

const dbPath = path.join(__dirname, 'govinnovate.sqlite');

// Initialize database
function initDb() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (process.env.USE_POSTGRES === 'true' && dbUrl) {
    try {
      pgPool = new Pool({ connectionString: dbUrl });
      console.log('[DB] Connecting to PostgreSQL via pool...');
      dbDriver = 'postgres';
      return;
    } catch (e) {
      console.warn('[DB] PostgreSQL pool creation failed, falling back to SQLite:', e.message);
    }
  }

  console.log('[DB] Initializing SQLite local database at:', dbPath);
  sqliteDb = new sqlite3.Database(dbPath);
  dbDriver = 'sqlite';
  
  // Enable foreign keys
  sqliteDb.run('PRAGMA foreign_keys = ON');
}

initDb();

// Generic query runner supporting both PostgreSQL and SQLite parameter styles ($1 vs ?)
async function query(text, params = []) {
  if (dbDriver === 'postgres' && pgPool) {
    try {
      const res = await pgPool.query(text, params);
      return res.rows;
    } catch (err) {
      console.warn('[DB Postgres Error, falling back to SQLite]', err.message);
    }
  }

  // SQLite execution
  return new Promise((resolve, reject) => {
    // Convert $1, $2 to ? for SQLite compatibility
    let sql = text.replace(/\$\d+/g, '?');
    
    // SQLite adjustments for types/syntax
    sql = sql.replace(/TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP');
    sql = sql.replace(/CURRENT_TIMESTAMP - INTERVAL '(\d+) DAYS'/gi, "datetime('now', '-$1 days')");
    sql = sql.replace(/BOOLEAN DEFAULT FALSE/gi, 'INTEGER DEFAULT 0');
    sql = sql.replace(/BOOLEAN DEFAULT TRUE/gi, 'INTEGER DEFAULT 1');
    sql = sql.replace(/TRUE/g, '1');
    sql = sql.replace(/FALSE/g, '0');

    const trimmed = sql.trim();
    if (trimmed.toUpperCase().startsWith('SELECT') || trimmed.toUpperCase().startsWith('PRAGMA')) {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    } else {
      sqliteDb.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve([{ changes: this.changes, lastID: this.lastID }]);
      });
    }
  });
}

function getDriver() {
  return dbDriver;
}

module.exports = {
  query,
  getDriver,
  sqliteDb,
  dbPath
};
