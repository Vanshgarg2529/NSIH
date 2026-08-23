import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { challengeApi, matchApi, pilotApi } from '../services/api';
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Award, Layers, Sparkles } from 'lucide-react';
import { Challenge, Match } from '../types';

export const MatchResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!id) return;
      try {
        const res = await challengeApi.getById(id);
        setChallenge(res.data.challenge);
        
        let matchResults = res.data.matches || [];
        if (matchResults.length === 0) {
          // Trigger match generation
          const runRes = await challengeApi.runMatches(id);
          matchResults = runRes.data.matches || [];
        }

        // Parse JSON strings if needed
        const parsed = matchResults.map((m: any) => ({
          ...m,
          component_scores: typeof m.component_scores_json === 'string' ? JSON.parse(m.component_scores_json) : m.component_scores,
          reasons: typeof m.reasons_json === 'string' ? JSON.parse(m.reasons_json) : m.reasons,
          gaps: typeof m.gaps_json === 'string' ? JSON.parse(m.gaps_json) : m.gaps
        }));

        setMatches(parsed);
        if (parsed.length > 0) setSelectedMatch(parsed[0]);
      } catch (err) {
        console.error('Error fetching match results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [id]);

  const handleShortlist = async (matchId: string) => {
    try {
      const res = await matchApi.shortlist(matchId);
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, shortlisted: res.data.shortlisted } : m));
      if (selectedMatch && selectedMatch.id === matchId) {
        setSelectedMatch(prev => prev ? { ...prev, shortlisted: res.data.shortlisted } : null);
      }
    } catch (err) {
      console.error('Shortlist error', err);
    }
  };

  const handleCreatePilot = async (match: Match) => {
    try {
      const res = await pilotApi.create({
        name: `${challenge?.location || 'Pune'} Municipal Water Network Pilot`,
        challenge_id: challenge?.id || 'chl_water_pune',
        startup_id: match.startup_id,
        location: `${challenge?.location || 'Pune'} Municipal Corp`,
        start_date: '2026-03-01',
        end_date: '2026-06-01'
      });
      navigate(`/pilots/${res.data.pilotId}`);
    } catch (err) {
      console.error('Failed to create pilot', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-govbg flex items-center justify-center">
        <div className="text-center">
          <Cpu className="w-10 h-10 text-navy animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-navy-dark">Computing Explainable AI Matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="MATCH" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Badge type="ai" label="DETERMINISTIC ML MATCH ENGINE" />
                <Badge type="demo" />
              </div>
              <h1 className="text-2xl font-extrabold text-navy-dark mt-2">
                {challenge?.title || 'AI-based water leakage detection for municipal pipelines'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Department: {challenge?.department} • Location: {challenge?.location} • Budget: {challenge?.budget}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Engine Mode</div>
              <div className="text-xs font-bold text-indigo-700">Deterministic Explainable Matcher v1</div>
            </div>
          </div>
        </div>

        {/* Legal & Decision Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-xs text-amber-900 mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              <strong>AI-assisted recommendation</strong> — final decision remains with authorized government officials.
            </span>
          </div>
          <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded font-semibold">DECISION SUPPORT ONLY</span>
        </div>

        {/* Main Grid: Matches List & Selected Match Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Top Match Cards */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-navy-dark uppercase tracking-wider">Top Matched Startup Solutions</h3>

            {matches.map((m) => {
              const isSelected = selectedMatch?.id === m.id;
              const isAquaSense = m.company_name?.toLowerCase().includes('aquasense');

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`bg-white p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'border-2 border-navy ring-2 ring-navy/20 shadow-md' : 'border-slate-200 hover:border-navy-light'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-navy-dark text-base">{m.company_name}</h4>
                        {m.shortlisted && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            ★ Shortlisted
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{m.solution_name}</div>
                    </div>

                    <div className="text-right">
                      <div className={`text-2xl font-black ${isAquaSense ? 'text-emerald-600' : 'text-navy'}`}>
                        {m.overall_score}%
                      </div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">MATCH SCORE</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Confidence: <strong className="text-navy">{m.confidence}</strong></span>
                    <span>Readiness: <strong className="text-navy">{m.readiness}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Explanation & Score Breakdown */}
          {selectedMatch && (
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <div className="text-xs font-bold text-gold uppercase tracking-wider">Detailed Match Explanation</div>
                    <h3 className="text-xl font-extrabold text-navy-dark">{selectedMatch.company_name}</h3>
                    <p className="text-xs text-slate-500">{selectedMatch.solution_name}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShortlist(selectedMatch.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                        selectedMatch.shortlisted
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-navy hover:bg-slate-200'
                      }`}
                    >
                      {selectedMatch.shortlisted ? '★ Shortlisted' : 'Shortlist Startup'}
                    </button>

                    <button
                      onClick={() => handleCreatePilot(selectedMatch)}
                      className="px-5 py-2 bg-gold text-navy-dark font-bold rounded-lg hover:bg-gold-hover transition-colors text-xs flex items-center space-x-1 shadow"
                    >
                      <span>Create Pilot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-navy-dark uppercase tracking-wider mb-3">
                    Weighted Match Score Breakdown (Total: {selectedMatch.overall_score}%)
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-700 font-semibold mb-1">
                        <span>Domain Similarity (Max 30%)</span>
                        <span>{selectedMatch.component_scores?.domain || 30} / 30</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-navy h-full rounded-full" style={{ width: `${((selectedMatch.component_scores?.domain || 30) / 30) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 font-semibold mb-1">
                        <span>Technology Compatibility (Max 20%)</span>
                        <span>{selectedMatch.component_scores?.technology || 20} / 20</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${((selectedMatch.component_scores?.technology || 20) / 20) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 font-semibold mb-1">
                        <span>Deployment Readiness (Max 15%)</span>
                        <span>{selectedMatch.component_scores?.readiness || 15} / 15</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${((selectedMatch.component_scores?.readiness || 15) / 15) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 font-semibold mb-1">
                        <span>Cost & Budget Compatibility (Max 10%)</span>
                        <span>{selectedMatch.component_scores?.cost || 10} / 10</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${((selectedMatch.component_scores?.cost || 10) / 10) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why This Match? (Strengths) */}
                <div className="mb-6 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                    Why This Match? (AI Strengths)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {(selectedMatch.reasons || []).map((r, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-emerald-600 mr-2 font-bold">✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps / Risk Analysis */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5" />
                    Identified Gaps & Verification Items
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {(selectedMatch.gaps || []).map((g, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-amber-600 mr-2 font-bold">⚠</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
