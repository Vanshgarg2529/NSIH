import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { scaleApi, procurementApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, ShieldCheck, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

export const ScaleProcurementPage: React.FC = () => {
  const { pilotId } = useParams<{ pilotId: string }>();
  const id = pilotId || 'plt_pune_water';
  const { user } = useAuth();

  const [scenario, setScenario] = useState<any>(null);
  const [procurementStatus, setProcurementStatus] = useState<string>('Procurement Review');
  const [notes, setNotes] = useState<string>('Recommended for multi-ward expansion under Smart City Innovation fund.');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scRes, prcRes] = await Promise.all([
          scaleApi.getScenario(id),
          procurementApi.get(id)
        ]);
        setScenario(scRes.data.scenario);
        if (prcRes.data.procurement) {
          setProcurementStatus(prcRes.data.procurement.status);
          setNotes(prcRes.data.procurement.notes || '');
        }
      } catch (err) {
        console.error('Error loading scale data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateProcurement = async (newStatus: string) => {
    setUpdating(true);
    setMsg('');
    try {
      await procurementApi.update(id, newStatus, notes);
      setProcurementStatus(newStatus);
      setMsg(`Procurement tracking status updated to '${newStatus}'`);
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-govbg flex items-center justify-center">
        <TrendingUp className="w-8 h-8 text-navy animate-pulse" />
      </div>
    );
  }

  const statuses = ['Pilot', 'Procurement Review', 'Order', 'Scale'];

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="PROCUREMENT" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Badge type="demo" label="SCALE & PROCUREMENT TRACKING" />
                <Badge type="platform" />
              </div>
              <h1 className="text-2xl font-extrabold text-navy-dark mt-2">
                Deployment Scale & Procurement Oversight
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Pilot: <strong>{scenario?.pilotName}</strong> • Startup: <strong>{scenario?.startup}</strong> ({scenario?.solution})
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Banner */}
        <div className="bg-blue-50 border border-blue-300 p-4 rounded-xl text-xs text-blue-900 mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <span>
              <strong>Procurement authority remains outside GovInnovate.</strong> Status updates are for administrative tracking & oversight only.
            </span>
          </div>
          <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded font-bold">OVERSIGHT ONLY</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Procurement Status Tracker */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-navy-dark uppercase tracking-wider mb-4">
                Procurement Administrative Lifecycle Status
              </h3>

              {msg && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-xs font-semibold">
                  {msg}
                </div>
              )}

              {/* Status Step Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {statuses.map((st) => {
                  const isCurrent = procurementStatus === st;
                  return (
                    <button
                      key={st}
                      onClick={() => handleUpdateProcurement(st)}
                      disabled={updating}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-navy text-white border-navy font-bold shadow'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold text-slate-400">STAGE</div>
                      <div className="text-sm font-bold mt-1">{st}</div>
                      {isCurrent && <div className="text-[10px] text-gold mt-1">● Current Active Status</div>}
                    </button>
                  );
                })}
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-xs font-bold text-navy-dark mb-1">Administrative Review Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
                ></textarea>
                <button
                  onClick={() => handleUpdateProcurement(procurementStatus)}
                  disabled={updating}
                  className="mt-2 w-full py-2 bg-navy text-white font-bold rounded-lg hover:bg-navy-dark text-xs transition-colors shadow"
                >
                  Save Procurement Note
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Illustrative Deployment Scenario */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-navy-dark uppercase tracking-wider">
                  Illustrative Deployment Scenario
                </h3>
                <Badge type="demo" label="PROJECTION SCENARIO" />
              </div>

              <div className="space-y-4">
                {(scenario?.phases || []).map((ph: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-dark text-sm">{ph.stage}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ph.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {ph.status}
                      </span>
                    </div>

                    <div className="text-slate-700">Target Scope: <strong>{ph.target}</strong></div>
                    <div className="text-slate-500">Pipeline Coverage: {ph.coverage} • Est. Budget: {ph.estimateBudget}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-[11px] text-slate-400 italic text-center">
                {scenario?.notice}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
