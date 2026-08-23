-- GOVINNOVATE Database Schema (PostgreSQL Compatible)

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- Government Officer, Startup, Evaluator, Admin
  name VARCHAR(255) NOT NULL,
  department_or_company VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS challenges (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  problem_statement TEXT NOT NULL,
  desired_outcome TEXT NOT NULL,
  department VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  budget VARCHAR(100) NOT NULL,
  pilot_duration VARCHAR(100) NOT NULL,
  tech_requirements TEXT NOT NULL,
  infra_requirements TEXT NOT NULL,
  kpis TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft', -- Draft, Published, Pilot Created, Closed
  created_by VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS startups (
  id VARCHAR(64) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  solution_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  technology VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  geography VARCHAR(100) NOT NULL,
  readiness VARCHAR(100) NOT NULL,
  infra_reqs TEXT NOT NULL,
  cost_band VARCHAR(100) NOT NULL,
  previous_pilots TEXT NOT NULL,
  user_id VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solutions (
  id VARCHAR(64) PRIMARY KEY,
  startup_id VARCHAR(64) REFERENCES startups(id),
  solution_name VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  tech_stack VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(64) PRIMARY KEY,
  challenge_id VARCHAR(64) REFERENCES challenges(id),
  startup_id VARCHAR(64) REFERENCES startups(id),
  overall_score INT NOT NULL,
  component_scores_json TEXT NOT NULL,
  reasons_json TEXT NOT NULL,
  gaps_json TEXT NOT NULL,
  confidence VARCHAR(50) NOT NULL,
  shortlisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pilots (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  challenge_id VARCHAR(64) REFERENCES challenges(id),
  startup_id VARCHAR(64) REFERENCES startups(id),
  location VARCHAR(100) NOT NULL,
  start_date VARCHAR(50) NOT NULL,
  end_date VARCHAR(50) NOT NULL,
  overall_score INT DEFAULT 0,
  recommendation VARCHAR(255) DEFAULT 'EVALUATION_PENDING',
  status VARCHAR(50) DEFAULT 'Active', -- Active, Evaluated, Scaled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kpis (
  id VARCHAR(64) PRIMARY KEY,
  pilot_id VARCHAR(64) REFERENCES pilots(id),
  name VARCHAR(255) NOT NULL,
  target VARCHAR(100) NOT NULL,
  actual VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  score INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'On Track',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
  id VARCHAR(64) PRIMARY KEY,
  pilot_id VARCHAR(64) REFERENCES pilots(id),
  claim TEXT NOT NULL,
  source TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Verified, Rejected
  verified_by VARCHAR(64) REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence_passports (
  id VARCHAR(64) PRIMARY KEY,
  pilot_id VARCHAR(64) REFERENCES pilots(id),
  passport_number VARCHAR(100) UNIQUE NOT NULL,
  data_json TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Verified',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS procurement (
  id VARCHAR(64) PRIMARY KEY,
  pilot_id VARCHAR(64) REFERENCES pilots(id),
  status VARCHAR(50) DEFAULT 'Pilot', -- Pilot, Procurement Review, Order, Scale
  notes TEXT,
  updated_by VARCHAR(64) REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  actor VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
