import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { evidenceApi } from '../services/api';
import { Award, ShieldCheck, CheckCircle2, Printer, ArrowRight, FileCheck, Layers } from 'lucide-react';
import { EvidencePassport } from '../types';

export const EvidencePassportPage: React.FC = () => {
  const { pilotId } = useParams<{ pilotId: string }>();
  const id = pilotId || 'plt_pune_water';

  const [passport, setPassport] = useState<EvidencePassport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const res = await evidenceApi.getPassport(id);
        setPassport(res.data.passport);
      } catch (err) {
        // Auto-generate if missing
        try {
          const genRes = await evidenceApi.generatePassport(id);
          setPassport({
            id: `pass_${Date.now()}`,
            pilot_id: id,
            passport_number: genRes.data.passport.passport_number,
            status: 'Verified',
            data: genRes.data.passport
          });
        } catch (e) {
          console.error('Failed to generate passport', e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-govbg flex items-center justify-center">
        <Award className="w-8 h-8 text-navy animate-pulse" />
      </div>
    );
  }

  const pData = passport?.data;

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="EVIDENCE" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Printable Control Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div className="flex items-center space-x-2">
            <Badge type="platform" label="PLATFORM-GENERATED EVIDENCE PASSPORT" />
            <Badge type="demo" />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-xs flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Passport</span>
            </button>

            <Link
              to={`/scale/${id}`}
              className="px-5 py-2 bg-gold text-navy-dark font-bold rounded-lg hover:bg-gold-hover transition-colors text-xs flex items-center space-x-1 shadow"
            >
              <span>Scale & Procurement Review →</span>
            </Link>
          </div>
        </div>

        {/* The Formal Passport Document Certificate Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-navy relative overflow-hidden print:shadow-none print:border-2">
          {/* Decorative Stamp watermark */}
          <div className="absolute top-8 right-8 border-4 border-gold/40 text-gold/50 rounded-full w-28 h-28 flex items-center justify-center font-black text-center text-xs transform rotate-12 pointer-events-none select-none">
            EVIDENCE<br />VERIFIED
          </div>

          {/* Document Header */}
          <div className="border-b-2 border-slate-200 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy text-gold font-extrabold flex items-center justify-center text-2xl mb-2 shadow">
                GI
              </div>
              <h1 className="text-2xl font-black tracking-tight text-navy-dark uppercase">
                INNOVATION EVIDENCE PASSPORT
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official Platform Evaluation Summary & Telemetry Certificate
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PASSPORT NUMBER</div>
              <div className="text-sm font-mono font-bold text-navy bg-slate-100 px-3 py-1 rounded border border-slate-200 mt-1">
                {pData?.passport_number || 'INNO-PASS-2026-PUNE-WATER-001'}
              </div>
            </div>
          </div>

          {/* Key Facts Summary Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">STARTUP & SOLUTION</span>
              <div className="font-extrabold text-navy-dark text-sm">{pData?.startup || 'AquaSense AI'}</div>
              <div className="text-slate-600 font-medium">{pData?.solution || 'HydroPulse AI Leak Detector'}</div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">GOVERNMENT DEPARTMENT</span>
              <div className="font-extrabold text-navy-dark text-sm">{pData?.department || 'Municipal Water Department, Pune'}</div>
              <div className="text-slate-600 font-medium">{pData?.location || 'Ward 4 & 7, Pune Municipal Corp'}</div>
            </div>

            <div className="sm:col-span-2 border-t border-slate-200 pt-4">
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">CHALLENGE STATEMENT</span>
              <div className="font-semibold text-slate-800">{pData?.challenge_title}</div>
            </div>
          </div>

          {/* Evaluated Score & Recommendation Banner */}
          <div className="bg-navy-gradient text-white p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-navy-light shadow-md">
            <div>
              <div className="text-xs font-bold text-gold uppercase tracking-wider">OFFICIAL SYSTEM EVALUATION RESULT</div>
              <div className="text-2xl font-black text-white mt-1">
                {pData?.recommendation || 'SCALE REVIEW RECOMMENDED'}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Verified by: <strong>{pData?.evaluator || 'Dr. Aris Mehta'}</strong> ({pData?.verification_date})
              </div>
            </div>

            <div className="text-center sm:text-right bg-navy-dark/80 px-6 py-3 rounded-xl border border-gold/30">
              <div className="text-[10px] text-slate-300 font-bold uppercase">OVERALL PILOT SCORE</div>
              <div className="text-3xl font-black text-gold">{pData?.overall_score || 89} / 100</div>
            </div>
          </div>

          {/* Verified KPI Results Table */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-navy-dark uppercase tracking-wider mb-3">
              Verified Telemetry KPI Benchmark Results
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-navy uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">KPI Benchmark Indicator</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Actual Result</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(pData?.kpis || []).map((k: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{k.name}</td>
                      <td className="p-3 text-slate-500">{k.target}</td>
                      <td className="p-3 font-bold text-navy">{k.actual}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          ✓ {k.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Disclaimers & Footers */}
          <div className="border-t-2 border-slate-200 pt-6 text-[11px] text-slate-500 space-y-2">
            <div className="font-bold text-slate-700">IMPORTANT PLATFORM NOTICE:</div>
            <div>• {pData?.disclaimer || 'Platform-generated Evidence Passport based on verified pilot telemetry.'}</div>
            <div>• <strong>Not government certification.</strong> Procurement authority remains outside GovInnovate.</div>
          </div>
        </div>
      </main>
    </div>
  );
};
