import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { ShieldCheck, User, Building, Award, Settings, Lock } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('gov@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div>
          <div className="w-12 h-12 rounded-xl bg-navy text-gold font-extrabold flex items-center justify-center text-2xl mx-auto shadow-md">
            GI
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold text-navy-dark">
            Sign in to GovInnovate
          </h2>
          <p className="mt-1 text-center text-xs text-slate-500">
            Government Innovation Decision Support Platform
          </p>
          <div className="mt-3 text-center">
            <Badge type="demo" label="DEMO PLATFORM ACCOUNTS" />
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* 1-Click Quick Demo Role Buttons */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
            Click to Sign In as Demo Role:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('Government Officer')}
              className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-left hover:bg-slate-100 hover:border-navy transition-colors text-xs"
            >
              <div className="font-bold text-navy flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-gold" />
                Gov Officer
              </div>
              <div className="text-[10px] text-slate-500 truncate">gov@demo.com</div>
            </button>

            <button
              onClick={() => handleQuickDemo('Startup')}
              className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-left hover:bg-slate-100 hover:border-navy transition-colors text-xs"
            >
              <div className="font-bold text-navy flex items-center">
                <Building className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                Startup Rep
              </div>
              <div className="text-[10px] text-slate-500 truncate">startup@demo.com</div>
            </button>

            <button
              onClick={() => handleQuickDemo('Evaluator')}
              className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-left hover:bg-slate-100 hover:border-navy transition-colors text-xs"
            >
              <div className="font-bold text-navy flex items-center">
                <Award className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Evaluator
              </div>
              <div className="text-[10px] text-slate-500 truncate">evaluator@demo.com</div>
            </button>

            <button
              onClick={() => handleQuickDemo('Admin')}
              className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-left hover:bg-slate-100 hover:border-navy transition-colors text-xs"
            >
              <div className="font-bold text-navy flex items-center">
                <Settings className="w-3.5 h-3.5 mr-1 text-purple-500" />
                Admin
              </div>
              <div className="text-[10px] text-slate-500 truncate">admin@demo.com</div>
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or Manual Login</span></div>
        </div>

        {/* Standard Manual Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-navy text-white font-bold rounded-lg hover:bg-navy-dark transition-colors shadow text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400">
          Password for all demo accounts: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">demo123</code>
        </div>
      </div>
    </div>
  );
};
