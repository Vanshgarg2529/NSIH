export type UserRole = 'Government Officer' | 'Startup' | 'Evaluator' | 'Admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  department_or_company?: string;
}

export interface Challenge {
  id: string;
  title: string;
  problem_statement: string;
  desired_outcome: string;
  department: string;
  category: string;
  location: string;
  budget: string;
  pilot_duration: string;
  tech_requirements: string;
  infra_requirements: string;
  kpis: string;
  status: 'Draft' | 'Published' | 'Pilot Created' | 'Closed';
  created_by?: string;
  created_at?: string;
}

export interface Startup {
  id: string;
  company_name: string;
  solution_name: string;
  description: string;
  technology: string;
  sector: string;
  geography: string;
  readiness: string;
  infra_reqs: string;
  cost_band: string;
  previous_pilots: string;
}

export interface ComponentScores {
  domain: number;
  technology: number;
  readiness: number;
  cost: number;
  geography: number;
  evidence: number;
  infra: number;
}

export interface Match {
  id: string;
  challenge_id: string;
  startup_id: string;
  company_name: string;
  solution_name: string;
  technology: string;
  readiness: string;
  cost_band: string;
  previous_pilots: string;
  overall_score: number;
  component_scores?: ComponentScores;
  component_scores_json?: string;
  reasons?: string[];
  reasons_json?: string;
  gaps?: string[];
  gaps_json?: string;
  confidence: 'High' | 'Medium' | 'Low';
  shortlisted: boolean;
  mode?: string;
}

export interface Pilot {
  id: string;
  name: string;
  challenge_id: string;
  startup_id: string;
  challenge_title?: string;
  department?: string;
  startup_name?: string;
  solution_name?: string;
  location: string;
  start_date: string;
  end_date: string;
  overall_score: number;
  recommendation: string;
  status: 'Active' | 'Evaluated' | 'Scaled';
}

export interface KPI {
  id: string;
  pilot_id: string;
  name: string;
  target: string;
  actual: string;
  unit: string;
  score: number;
  status: string;
}

export interface EvidenceItem {
  id: string;
  pilot_id: string;
  claim: string;
  source: string;
  type: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  verified_by?: string;
  verified_at?: string;
}

export interface EvidencePassportData {
  passport_number: string;
  challenge_title: string;
  department: string;
  startup: string;
  solution: string;
  pilot_name: string;
  location: string;
  duration: string;
  overall_score: number;
  recommendation: string;
  evaluator: string;
  verification_date: string;
  kpis: Array<{ name: string; target: string; actual: string; status: string }>;
  evidence_count: number;
  disclaimer: string;
}

export interface EvidencePassport {
  id: string;
  pilot_id: string;
  passport_number: string;
  status: string;
  data: EvidencePassportData;
  generated_at?: string;
}

export interface Procurement {
  id: string;
  pilot_id: string;
  status: 'Pilot' | 'Procurement Review' | 'Order' | 'Scale';
  notes?: string;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
}
