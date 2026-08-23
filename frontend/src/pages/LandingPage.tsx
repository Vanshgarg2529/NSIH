import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { ShieldCheck, Cpu, Award, TrendingUp, CheckCircle, ArrowRight, FileCheck, Layers } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async (role: any) => {
    await demoLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-navy-gradient text-white py-20 px-4 relative overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 bg-[radial-gradient(#F4C542_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-navy-light px-3 py-1 rounded-full text-xs font-semibold text-gold mb-6 border border-gold/30">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>AI-Assisted Innovation Decision Support & Evidence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Turn Government Problems <br />
            <span className="text-gold">Into Proven Innovation.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Connect municipal & departmental challenges with startup solutions, validate performance through structured pilot KPIs, and build verifiable evidence for responsible scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/challenges"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold text-navy-dark font-bold rounded-lg shadow-lg hover:bg-gold-hover transition-colors flex items-center justify-center space-x-2 text-base"
            >
              <span>Explore Challenges</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={() => handleDemoClick('Government Officer')}
              className="w-full sm:w-auto px-8 py-3.5 bg-navy-light text-white font-semibold rounded-lg hover:bg-navy-muted border border-slate-700 transition-colors flex items-center justify-center space-x-2 text-base"
            >
              <span>Demo Government Story</span>
            </button>
          </div>

          <div className="mt-8 text-xs text-slate-400 italic">
            "AI recommends. Government decides. Pilot evidence proves."
          </div>
        </div>
      </section>

      {/* Lifecycle Flow Visual */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-navy-dark">The 5-Stage Evidence Lifecycle</h2>
            <p className="text-sm text-slate-600 mt-1">From challenge definition to evidence-backed scale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">1</div>
              <h3 className="font-bold text-navy-dark mb-1">PROBLEM</h3>
              <p className="text-xs text-slate-600">Department publishes municipal challenge & parameters.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">2</div>
              <h3 className="font-bold text-navy-dark mb-1">AI MATCH</h3>
              <p className="text-xs text-slate-600">Explainable AI evaluates startups across 7 weighted criteria.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">3</div>
              <h3 className="font-bold text-navy-dark mb-1">PILOT</h3>
              <p className="text-xs text-slate-600">3-month deployment with 4 target KPI benchmarks.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">4</div>
              <h3 className="font-bold text-navy-dark mb-1">EVIDENCE</h3>
              <p className="text-xs text-slate-600">Evaluators verify field telemetry and issue Evidence Passport.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">5</div>
              <h3 className="font-bold text-navy-dark mb-1">SCALE</h3>
              <p className="text-xs text-slate-600">Data-backed review for multi-ward procurement tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Presentation Story Banner */}
      <section className="py-16 px-4 bg-slate-100">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-md border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Badge type="demo" label="PRIMARY DEMO STORY" />
              <h3 className="text-xl font-bold text-navy-dark mt-2">
                Pune Municipal Water Department Leakage Challenge
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                See how <strong>AquaSense AI</strong> achieved a <strong>94% AI Match Score</strong> and achieved <strong>89/100 Pilot Evaluation</strong> to generate an Innovation Evidence Passport.
              </p>
            </div>

            <button
              onClick={() => handleDemoClick('Government Officer')}
              className="px-6 py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy-dark transition-colors whitespace-nowrap text-sm shadow"
            >
              Launch Demo Story →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-navy-dark text-slate-400 py-8 px-4 border-t border-slate-800 text-xs text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">GOVINNOVATE</span> — Evidence-Driven Government Innovation Lifecycle
          </div>
          <div>
            AI Recommendations are Decision Support Only. Procurement Authority Remains Outside GovInnovate.
          </div>
        </div>
      </footer>
    </div>
  );
};
