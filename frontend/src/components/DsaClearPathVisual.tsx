import React from 'react';
import { CheckCircle2, ChevronRight, Sparkles, Compass, Target, Award } from 'lucide-react';

interface Props {
  onSelectPattern?: (slug: string) => void;
}

export const DsaClearPathVisual: React.FC<Props> = ({ onSelectPattern }) => {
  const steps = [
    { id: 'foundation', name: 'FOUNDATION', desc: 'Complexity Analysis & Math', status: 'completed', icon: Compass },
    { id: 'arrays', name: 'ARRAYS', desc: 'Prefix Sum & Traversal', status: 'completed', icon: CheckCircle2 },
    { id: 'hashing', name: 'HASHING', desc: 'Complement & Frequency Maps', status: 'completed', icon: CheckCircle2 },
    { id: 'two-pointers', name: 'TWO POINTERS', desc: 'Sorted Bounds & Palindromes', status: 'completed', slug: 'converging-two-pointers', icon: CheckCircle2 },
    { id: 'sliding-window', name: 'SLIDING WINDOW', desc: 'Dynamic & Fixed Range', status: 'current', slug: 'sliding-window', icon: Sparkles },
    { id: 'binary-search', name: 'BINARY SEARCH', desc: 'Monotonic Boundaries', status: 'upcoming', slug: 'binary-search-monotonic', icon: Target },
    { id: 'trees', name: 'TREES', desc: 'Recursion & Subtree DFS', status: 'upcoming', slug: 'dfs-tree-traversal', icon: Target },
    { id: 'graphs', name: 'GRAPHS', desc: 'BFS Shortest Path & Topo', status: 'upcoming', slug: 'bfs-graph', icon: Target },
    { id: 'advanced', name: 'ADVANCED PATTERNS', desc: 'Dynamic Programming & Trie', status: 'upcoming', icon: Target },
    { id: 'ready', name: 'INTERVIEW READY', desc: 'Company Screenings & Tests', status: 'goal', icon: Award }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Visual Differentiator
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Your DSA Clear Path</h2>
            <p className="text-slate-400 text-sm mt-1">From random DSA practice to structured pattern mastery.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Pattern Recognition Flow
            </span>
          </div>
        </div>

        {/* Path Flow Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 md:gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isGoal = step.status === 'goal';

            return (
              <div
                key={step.id}
                onClick={() => step.slug && onSelectPattern && onSelectPattern(step.slug)}
                className={`relative flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 ${
                  step.slug ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                } ${
                  isCurrent
                    ? 'bg-indigo-600/25 border-2 border-indigo-400 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                    : isCompleted
                    ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
                    : isGoal
                    ? 'bg-amber-950/20 border border-amber-500/30 text-amber-300'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Step number badge */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 font-bold text-xs ${
                    isCurrent
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50 animate-bounce'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isGoal
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="font-semibold text-xs text-white leading-tight mb-1">{step.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2">{step.desc}</div>

                {isCurrent && (
                  <span className="mt-2 text-[9px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/30 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
                {isCompleted && (
                  <span className="mt-2 text-[9px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Mastered
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Descriptive Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Completed Foundations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              Current Working Pattern
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
              Upcoming Pattern Roadmap
            </span>
          </div>
          <div className="text-indigo-300/80 italic">
            "Solve fewer problems with deeper pattern intuition."
          </div>
        </div>
      </div>
    </div>
  );
};
