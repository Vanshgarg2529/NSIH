import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { challengeApi, pilotApi, auditApi } from '../services/api';
import { ShieldCheck, Cpu, Award, TrendingUp, Layers, PlusCircle, ArrowRight, FileCheck } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chRes, pltRes, logRes] = await Promise.all([
          challengeApi.getAll(),
          pilotApi.getAll(),
          auditApi.getLogs()
        ]);
        setChallenges(chRes.data.challenges || []);
        setPilots(pltRes.data.pilots || []);
        setLogs(logRes.data.logs || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openChallengesCount = challenges.filter(c => c.status === 'Published').length;
  const activePilotsCount = pilots.length;

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="DISCOVER" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold text-navy uppercase tracking-wider">Government Officer Workspace</span>
              <Badge type="demo" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-dark">
              Welcome back, {user?.name || 'Officer'}
            </h1>
            <p className="text-xs text-slate-500">
              {user?.department_or_company || 'Municipal Water Department, Pune'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/challenges/new"
              className="px-4 py-2 bg-navy text-white font-bold rounded-lg hover:bg-navy-dark transition-colors text-xs flex items-center space-x-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4 text-gold" />
              <span>Create Challenge</span>
            </Link>
          </div>
        </div>

        {/* Core KPI Stat Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Open Challenges</div>
            <div className="text-3xl font-extrabold text-navy-dark mt-2">{openChallengesCount || 9}</div>
            <div className="text-[11px] text-emerald-600 mt-1">Active for AI Match</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">AI Matches</div>
            <div className="text-3xl font-extrabold text-navy-dark mt-2">10</div>
            <div className="text-[11px] text-indigo-600 mt-1">Explainable Scores</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Active Pilots</div>
            <div className="text-3xl font-extrabold text-navy-dark mt-2">{activePilotsCount || 3}</div>
            <div className="text-[11px] text-amber-600 mt-1">KPI Telemetry Live</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Verified Evidence</div>
            <div className="text-3xl font-extrabold text-navy-dark mt-2">3</div>
            <div className="text-[11px] text-emerald-600 mt-1">Audit Logged</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Scale Ready</div>
            <div className="text-3xl font-extrabold text-navy-dark mt-2">1</div>
            <div className="text-[11px] text-purple-600 mt-1">Evidence Passport</div>
          </div>
        </div>

        {/* Main Demo Story Hero Card */}
        <div className="bg-navy-gradient text-white rounded-2xl p-6 shadow-lg mb-8 relative overflow-hidden border border-navy-light">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Badge type="demo" label="PRIMARY HACKATHON DEMO STORY" />
                <Badge type="ai" label="94% MATCH SCORE" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Pune Water Leakage Detection Challenge
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Department: <strong>Municipal Water Department (Pune)</strong> • Budget: <strong>₹20 Lakhs</strong> • Duration: <strong>3 Months</strong>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Top Solution: <strong>AquaSense AI (HydroPulse AI Leak Detector)</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                to="/challenges/chl_water_pune/matches"
                className="px-5 py-2.5 bg-gold text-navy-dark font-bold rounded-lg hover:bg-gold-hover transition-colors text-xs text-center shadow"
              >
                View AI Matches (94%)
              </Link>
              <Link
                to="/pilots/plt_pune_water"
                className="px-5 py-2.5 bg-navy-light text-white font-semibold rounded-lg hover:bg-navy-muted border border-slate-700 transition-colors text-xs text-center"
              >
                View Pilot & KPIs
              </Link>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Active Challenges & Recent Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-navy-dark">Government Challenges</h3>
              <Link to="/challenges" className="text-xs font-semibold text-navy hover:underline">
                View All ({challenges.length}) →
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
              {challenges.slice(0, 5).map((c) => (
                <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-navy-dark">{c.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {c.department} • {c.location} • Budget: {c.budget}
                    </div>
                  </div>

                  <Link
                    to={`/challenges/${c.id}/matches`}
                    className="px-3 py-1.5 bg-slate-100 text-navy font-semibold rounded text-xs hover:bg-navy hover:text-white transition-colors"
                  >
                    Find Matches
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-navy-dark">System Audit Trail</h3>
              <Link to="/audit" className="text-xs font-semibold text-navy hover:underline">
                Full Log →
              </Link>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">{log.resource}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{log.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
