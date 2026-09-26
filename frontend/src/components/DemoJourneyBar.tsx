import React from 'react';
import { Play, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  currentStepIndex: number;
  onNavigate: (page: string, params?: any) => void;
}

export const DemoJourneyBar: React.FC<Props> = ({ currentStepIndex, onNavigate }) => {
  const demoSteps = [
    { label: '1. Dashboard', page: 'dashboard' },
    { label: '2. DSA Path', page: 'path' },
    { label: '3. Sliding Window', page: 'pattern', params: { slug: 'sliding-window' } },
    { label: '4. Problem Workspace', page: 'problem', params: { slug: 'minimum-size-subarray-sum' } },
    { label: '5. Pattern Test', page: 'pattern-test' },
    { label: '6. Company Prep', page: 'company-prep' },
    { label: '7. Mock Interview', page: 'mock-interview' },
    { label: '8. Opportunities', page: 'opportunities' }
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>JUDGE DEMO FLOW</span>
          </div>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Follow the structured hackathon walkthrough:
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          {demoSteps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            return (
              <button
                key={step.label}
                onClick={() => onNavigate(step.page, step.params)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-md font-medium text-xs transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40 ring-1 ring-indigo-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {step.label}
                {idx < demoSteps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-500 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
