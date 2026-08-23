# GOVINNOVATE — Evidence-Driven Government Innovation Lifecycle

> *"From Government Problems to Proven Innovation."*  
> **Core Principle**: *"AI recommends. Government decides. Pilot evidence proves."*

GovInnovate connects government departmental challenges with startup solutions, providing explainable AI match scoring, pilot KPI evaluation, Innovation Evidence Passport generation, and administrative scale/procurement tracking.

---

## 🚀 Quick Start & Running Instructions

### 1. Install Backend Dependencies & Start API Server
```bash
cd backend
npm install
npm run seed   # Populates schema.sql and seed.sql
npm run dev    # Starts backend on http://localhost:5000
```

### 2. Install Frontend Dependencies & Start React UI
```bash
cd frontend
npm install
npm run dev    # Starts Vite frontend on http://localhost:5173
```

### 3. (Optional) Start Python AI Service
```bash
cd ai
pip install -r requirements.txt
python train.py
python api.py   # Starts FastAPI on http://localhost:8000
```
*(Note: If the Python service is offline, the Node.js backend automatically runs the identical deterministic ML fallback matcher with a clear `"Demo AI Mode"` badge.)*

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Government Officer** | `gov@demo.com` | `demo123` | Create challenge, view AI matches, shortlist, create pilot, view scale |
| **Startup** | `startup@demo.com` | `demo123` | View challenges, manage solution profile, submit telemetry evidence |
| **Evaluator** | `evaluator@demo.com` | `demo123` | Verify evidence, evaluate pilot KPIs, generate Evidence Passport |
| **Admin** | `admin@demo.com` | `demo123` | System oversight, user audit logs, AI run logs |

---

## 🌊 Primary Presentation Demo Story (Under 5 Minutes)

1. **Sign In**: Login as **Government Officer** (`gov@demo.com`) with 1-click preset.
2. **Dashboard**: Navigate to **Pune Water Leakage Detection Challenge**.
3. **Find AI Matches**: Click **"Find AI Matches"** to trigger the explainable match engine.
4. **Inspect Match**: View **AquaSense AI (94% Match Score)** and review:
   - Match breakdown (Domain 30%, Tech 20%, Readiness 15%, Cost 10%, Geography 10%, Evidence 9%, Infra 0%).
   - *"Why this match?"* AI strengths.
   - Identified SCADA integration gap.
5. **Shortlist & Create Pilot**: Click **Shortlist**, then **Create Pilot** (*"Pune Municipal Water Network Pilot"*).
6. **KPI Evaluation**: Inspect the 4 core KPI metrics:
   - Leakage Accuracy: **92%**
   - Cost Reduction: **18%**
   - Reliability: **96%**
   - User Satisfaction: **87%**
   - Click **Evaluate Pilot** -> System calculates **89/100** -> *"SCALE REVIEW RECOMMENDED"*.
7. **Evidence Passport**: Click **Generate Evidence Passport** to view the formal platform-generated certificate (`INNO-PASS-2026-PUNE-WATER-001`).
8. **Scale & Procurement Tracking**: View illustrative multi-ward deployment scenario (5 → 100 → 1000+ Villages) and update procurement tracking status.
9. **Audit Trail**: Check immutable append-only event log recording all user actions.

---

## 🛡️ Product Boundaries & Disclaimers

- **Decision Support Only**: AI recommends solutions; final procurement decisions remain strictly with authorized government officials.
- **Not Certification**: Innovation Evidence Passports summarize verified pilot telemetry and do not constitute formal legal government certification.
- **Demo Data**: Synthetic organizations and metrics are clearly labeled as `DEMO DATA`.
"# NSIH" 
