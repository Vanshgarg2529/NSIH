import React from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface LifecycleStepperProps {
  currentStage?: 'PROBLEM' | 'DISCOVER' | 'MATCH' | 'SHORTLIST' | 'PILOT' | 'MEASURE' | 'EVIDENCE' | 'SCALE' | 'PROCUREMENT';
}

const STAGES = [
  { key: 'PROBLEM', label: 'PROBLEM' },
  { key: 'DISCOVER', label: 'DISCOVER' },
  { key: 'MATCH', label: 'AI MATCH' },
  { key: 'SHORTLIST', label: 'SHORTLIST' },
  { key: 'PILOT', label: 'PILOT' },
  { key: 'MEASURE', label: 'MEASURE' },
  { key: 'EVIDENCE', label: 'EVIDENCE' },
  { key: 'SCALE', label: 'SCALE' },
  { key: 'PROCUREMENT', label: 'PROCUREMENT' },
];

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({ currentStage = 'PROBLEM' }) => {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className="bg-navy-dark border-b border-slate-800 text-white py-3 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto text-xs scrollbar-none space-x-1">
        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={stage.key}>
              <div className={`flex items-center px-2 py-1 rounded transition-colors whitespace-nowrap ${
                isCurrent 
                  ? 'bg-gold text-navy-dark font-bold shadow-sm' 
                  : isPassed 
                  ? 'text-emerald-400 font-medium' 
                  : 'text-slate-400'
              }`}>
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                <span>{stage.label}</span>
              </div>
              {idx < STAGES.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
