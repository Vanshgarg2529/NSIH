import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { challengeApi } from '../services/api';
import { PlusCircle, Search, Cpu, Building2, MapPin, IndianRupee } from 'lucide-react';
import { Challenge } from '../types';

export const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await challengeApi.getAll();
        setChallenges(res.data.challenges || []);
      } catch (err) {
        console.error('Error fetching challenges', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const filtered = challenges.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="PROBLEM" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-navy-dark">Government Challenges</h1>
              <Badge type="demo" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Public sector challenges published by government municipal departments requiring startup innovations.
            </p>
          </div>

          <Link
            to="/challenges/new"
            className="px-4 py-2.5 bg-navy text-white font-bold rounded-lg hover:bg-navy-dark transition-colors text-xs flex items-center justify-center space-x-1.5 shadow"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>Create New Challenge</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges by title, department, or sector category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy shadow-sm"
          />
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-xl border p-6 shadow-sm flex flex-col justify-between card-hover ${
                c.id === 'chl_water_pune' ? 'border-2 border-gold ring-1 ring-gold/50' : 'border-slate-200'
              }`}
            >
              <div>
                {c.id === 'chl_water_pune' && (
                  <div className="mb-3">
                    <Badge type="demo" label="PRIMARY DEMO CHALLENGE" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-navy uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-dark mb-2 leading-snug line-clamp-2">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {c.problem_statement}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.department}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{c.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Budget: <strong>{c.budget}</strong> ({c.pilot_duration})</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/challenges/${c.id}/matches`}
                  className="w-full py-2 bg-navy text-white font-bold rounded-lg text-xs hover:bg-navy-dark transition-colors text-center flex items-center justify-center space-x-1"
                >
                  <Cpu className="w-3.5 h-3.5 text-gold" />
                  <span>Find AI Matches</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
