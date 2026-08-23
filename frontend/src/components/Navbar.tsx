import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from './Badge';
import { ShieldCheck, LogOut, FileText, Activity, Layers, Award, UserCheck, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-navy border-b border-navy-light text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gold text-navy-dark font-extrabold flex items-center justify-center text-xl shadow-md group-hover:bg-gold-hover transition-colors">
              GI
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">
                GOVINNOVATE
              </span>
              <span className="text-[10px] uppercase font-medium text-slate-300 tracking-wider">
                Evidence-Driven Government Innovation
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'bg-navy-light text-white' : 'text-slate-300 hover:text-white hover:bg-navy-muted'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/challenges"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/challenges') ? 'bg-navy-light text-white' : 'text-slate-300 hover:text-white hover:bg-navy-muted'
              }`}
            >
              Challenges
            </Link>

            <Link
              to="/pilots/plt_pune_water"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith('/pilots') ? 'bg-navy-light text-white' : 'text-slate-300 hover:text-white hover:bg-navy-muted'
              }`}
            >
              Pilots & KPIs
            </Link>

            <Link
              to="/passport/plt_pune_water"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith('/passport') ? 'bg-navy-light text-white' : 'text-slate-300 hover:text-white hover:bg-navy-muted'
              }`}
            >
              Evidence Passport
            </Link>

            <Link
              to="/scale/plt_pune_water"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith('/scale') ? 'bg-navy-light text-white' : 'text-slate-300 hover:text-white hover:bg-navy-muted'
              }`}
            >
              Scale & Procurement
            </Link>

            <Link
              to="/audit"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/audit') ? 'bg-navy-light text-white' : 'text-slate-300 hover:text-white hover:bg-navy-muted'
              }`}
            >
              Audit Trail
            </Link>
          </nav>

          {/* User Profile & Demo Account Switcher */}
          <div className="flex items-center space-x-3">
            <Badge type="demo" />

            {user ? (
              <div className="flex items-center space-x-3 border-l border-navy-light pl-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[11px] text-gold font-medium">{user.role}</div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-light transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gold text-navy-dark font-semibold px-4 py-1.5 rounded-md text-sm hover:bg-gold-hover transition-colors shadow"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
