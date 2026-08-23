import React, { useState, useEffect } from 'react';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { auditApi } from '../services/api';
import { ShieldCheck, Clock, Activity, Search } from 'lucide-react';
import { AuditLog } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await auditApi.getLogs();
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error('Error fetching audit logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(l =>
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.resource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="PROCUREMENT" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-navy-dark">System Audit Trail</h1>
              <Badge type="platform" label="APPEND-ONLY LOG" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Immutably records all challenge publications, AI match executions, evidence verifications, and procurement updates.
            </p>
          </div>
        </div>

        {/* Search Filter */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action type, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy shadow-sm"
          />
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-navy text-white uppercase font-bold text-[11px] border-b border-navy-light">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor (User / Role)</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-semibold text-navy-dark">
                    {log.actor}
                  </td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 truncate max-w-md">
                    {log.resource}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
