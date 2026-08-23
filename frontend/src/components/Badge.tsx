import React from 'react';

interface BadgeProps {
  type: 'demo' | 'ai' | 'calculated' | 'platform' | 'verified' | 'pending' | 'role';
  label?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, label }) => {
  if (type === 'demo') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
        {label || 'DEMO DATA'}
      </span>
    );
  }

  if (type === 'ai') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
        {label || 'AI-ASSISTED'}
      </span>
    );
  }

  if (type === 'calculated') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        {label || 'SYSTEM CALCULATED'}
      </span>
    );
  }

  if (type === 'platform') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
        {label || 'PLATFORM GENERATED'}
      </span>
    );
  }

  if (type === 'verified') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
        ✓ {label || 'Verified Evidence'}
      </span>
    );
  }

  if (type === 'pending') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-300">
        ⏳ {label || 'Pending Audit'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
      {label}
    </span>
  );
};
