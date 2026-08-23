import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { Badge } from '../components/Badge';
import { challengeApi } from '../services/api';
import { Save, Send, ArrowLeft, AlertCircle } from 'lucide-react';

export const CreateChallengePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    problem_statement: '',
    desired_outcome: '',
    department: 'Municipal Water Department',
    category: 'Water & Sanitation',
    location: 'Pune',
    budget: '₹20 Lakhs',
    pilot_duration: '3 Months',
    tech_requirements: 'Acoustic sensing, IoT pressure telemetry, Machine Learning leakage detection model',
    infra_requirements: 'Compatibility with existing SCADA pipeline flow telemetry',
    kpis: 'Leakage Accuracy > 90%, Cost Reduction > 15%, Pipeline Reliability > 95%, Ward User Satisfaction > 85%'
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    setError('');

    if (!formData.title || !formData.problem_statement || !formData.desired_outcome || !formData.department || !formData.budget) {
      setError('Please fill in all required fields (Title, Problem Statement, Outcome, Department, Budget).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await challengeApi.create({ ...formData, status });
      const challengeId = res.data.challengeId;

      if (status === 'Published') {
        // Automatically run AI matches after publish
        await challengeApi.runMatches(challengeId);
        navigate(`/challenges/${challengeId}/matches`);
      } else {
        navigate('/challenges');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create challenge');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-govbg pb-12">
      <LifecycleStepper currentStage="PROBLEM" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/challenges')}
          className="flex items-center text-xs font-semibold text-slate-500 hover:text-navy mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Challenges
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-navy-dark">Create Government Challenge</h1>
                <Badge type="demo" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Define the public sector problem statement, budget, and KPI metrics for AI solution matching.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-navy-dark mb-1">Challenge Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AI-based water leakage detection for municipal pipelines"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-dark mb-1">Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-dark mb-1">Category Sector *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Smart Mobility">Smart Mobility</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Environment & Climate">Environment & Climate</option>
                  <option value="Public Health">Public Health</option>
                  <option value="Clean Energy">Clean Energy</option>
                  <option value="Urban Infrastructure">Urban Infrastructure</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-dark mb-1">Problem Statement *</label>
              <textarea
                name="problem_statement"
                rows={3}
                value={formData.problem_statement}
                onChange={handleChange}
                placeholder="Describe the municipal bottleneck, loss percentage, or operational pain point..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-dark mb-1">Desired Outcome *</label>
              <textarea
                name="desired_outcome"
                rows={2}
                value={formData.desired_outcome}
                onChange={handleChange}
                placeholder="Expected impact, target precision, or performance goal..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-dark mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-dark mb-1">Budget Allocation *</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-dark mb-1">Pilot Duration *</label>
                <input
                  type="text"
                  name="pilot_duration"
                  value={formData.pilot_duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-dark mb-1">Technology Requirements</label>
              <input
                type="text"
                name="tech_requirements"
                value={formData.tech_requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-dark mb-1">Infrastructure Requirements</label>
              <input
                type="text"
                name="infra_requirements"
                value={formData.infra_requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-dark mb-1">Target KPIs</label>
              <input
                type="text"
                name="kpis"
                value={formData.kpis}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => handleSave('Draft')}
                disabled={submitting}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave('Published')}
                disabled={submitting}
                className="px-6 py-2.5 bg-navy text-white font-bold rounded-lg hover:bg-navy-dark transition-colors text-xs flex items-center space-x-1.5 shadow"
              >
                <Send className="w-4 h-4 text-gold" />
                <span>Publish & Find AI Matches</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
