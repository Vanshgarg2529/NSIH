import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { pilotApi, evidenceApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Award, CheckCircle2, FileText, ArrowRight, ShieldCheck, Activity, PlusCircle } from 'lucide-react';
import { Pilot, KPI, EvidenceItem } from '../types';

export const PilotDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pilotId = id || 'plt_pune_water';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Evidence input form state
  const [newClaim, setNewClaim] = useState('');
  const [newSource, setNewSource] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  const fetchPilotData = async () => {
    try {
      const res = await pilotApi.getById(pilotId);
      setPilot(res.data.pilot);
      setKpis(res.data.kpis || []);
      setEvidenceList(res.data.evidence || []);
    } catch (err) {
      console.error('Error fetching pilot data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPilotData();
  }, [pilotId]);

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await pilotApi.evaluate(pilotId);
      setPilot(prev => prev ? { ...prev, overall_score: res.data.overall_score, recommendation: res.data.recommendation, status: 'Evaluated' } : null);
    } catch (err) {
      console.error('Evaluation error', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleVerifyEvidence = async (evidenceId: string, status: 'Verified' | 'Rejected') => {
    try {
      await evidenceApi.verify(evidenceId, status);
      fetchPilotData();
    } catch (err) {
      console.error('Evidence verification error', err);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim || !newSource) return;
    try {
      await evidenceApi.submit({ pilot_id: pilotId, claim: newClaim, source: newSource, type: 'Field Telemetry Audit' });
      setNewClaim('');
      setNewSource('');
      fetchPilotData();
    } catch (err) {
      console.error('Evidence submission error', err);
    }
  };

  const handleGeneratePassport = async () => {
    try {
      await evidenceApi.generatePassport(pilotId);
      navigate(`/passport/${pilotId}`);
    } catch (err) {
      console.error('Passport generation error', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-govbg flex items-center justify-center">
        <Activity className="w-8 h-8 text-navy animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="MEASURE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Pilot Header Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <Badge type="demo" label="PRIMARY PILOT STORY" />
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  pilot?.status === 'Evaluated' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  Status: {pilot?.status}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-navy-dark mt-2">
                {pilot?.name || 'Pune Municipal Water Network Pilot'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Challenge: <strong>{pilot?.challenge_title}</strong> • Startup: <strong>{pilot?.startup_name}</strong> ({pilot?.solution_name})
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Location: {pilot?.location} • Timeline: {pilot?.start_date} to {pilot?.end_date}
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="bg-navy-gradient text-white p-5 rounded-2xl text-center shadow border border-navy-light min-w-[200px]">
              <div className="text-[10px] uppercase font-bold text-gold tracking-wider">SYSTEM EVALUATED SCORE</div>
              <div className="text-4xl font-extrabold text-gold my-1">{pilot?.overall_score || 89} / 100</div>
              <div className="text-[11px] font-semibold text-emerald-400 bg-navy-dark/60 px-2 py-0.5 rounded">
                {pilot?.recommendation || 'SCALE REVIEW RECOMMENDED'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-slate-100 p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-600 font-semibold">
            Evaluate pilot KPIs to unlock Innovation Evidence Passport generation.
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleEvaluate}
              disabled={evaluating}
              className="px-4 py-2 bg-navy text-white font-bold rounded-lg hover:bg-navy-dark transition-colors text-xs flex items-center space-x-1 shadow"
            >
              <Award className="w-4 h-4 text-gold" />
              <span>{evaluating ? 'Calculating...' : 'Evaluate Pilot KPIs'}</span>
            </button>

            <button
              onClick={handleGeneratePassport}
              className="px-5 py-2 bg-gold text-navy-dark font-bold rounded-lg hover:bg-gold-hover transition-colors text-xs flex items-center space-x-1 shadow"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Evidence Passport →</span>
            </button>
          </div>
        </div>

        {/* Grid: 4 Core Pilot KPIs & Evidence Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: 4 KPI Cards */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-navy-dark uppercase tracking-wider">
              Pilot Performance KPIs (4 Core Benchmarks)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-navy-dark">{kpi.name}</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {kpi.status}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2 pt-1">
                    <span className="text-2xl font-black text-navy">{kpi.actual}</span>
                    <span className="text-xs text-slate-400">Target: {kpi.target}</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, kpi.score || 90)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Evidence Records & Verification */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-navy-dark uppercase tracking-wider">
                  Pilot Evidence Verification Records
                </h3>
                <Badge type="verified" label={`${evidenceList.filter(e => e.status === 'Verified').length} Verified`} />
              </div>

              {/* Submit New Evidence Form */}
              <form onSubmit={handleAddEvidence} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-navy-dark">Submit New Telemetry / Audit Evidence</div>
                <input
                  type="text"
                  placeholder="Claim description (e.g. 92% accurate leak localization)..."
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-navy focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Verification source (e.g. PMC Water Telemetry Logs)..."
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-navy focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-navy text-white font-semibold rounded text-xs hover:bg-navy-dark transition-colors"
                >
                  Submit Evidence
                </button>
              </form>

              {/* List of Evidence Items */}
              <div className="space-y-3">
                {evidenceList.map((ev) => (
                  <div key={ev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-slate-800">{ev.claim}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ev.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">Source: {ev.source}</div>

                    {/* Evaluator Verification Button */}
                    {ev.status === 'Pending' && (
                      <div className="pt-2 flex items-center space-x-2">
                        <button
                          onClick={() => handleVerifyEvidence(ev.id, 'Verified')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded text-[10px] hover:bg-emerald-700"
                        >
                          Verify Evidence
                        </button>
                        <button
                          onClick={() => handleVerifyEvidence(ev.id, 'Rejected')}
                          className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded text-[10px] hover:bg-rose-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
