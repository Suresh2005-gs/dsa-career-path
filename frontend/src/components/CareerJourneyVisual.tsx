import React from 'react';
import { BookOpen, Code2, Sparkles, HelpCircle, Building2, Briefcase, Send, ArrowRight } from 'lucide-react';

export const CareerJourneyVisual: React.FC = () => {
  const journey = [
    { title: 'LEARN', desc: 'Pattern intuition & signals', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { title: 'PRACTICE', desc: '3 Easy, 3 Medium, 3 Hard', icon: Code2, color: 'from-indigo-500 to-purple-600' },
    { title: 'MASTER PATTERNS', desc: 'Deep dive structure & signals', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
    { title: 'ASSESS', desc: 'Pattern Recognition test', icon: HelpCircle, color: 'from-pink-500 to-rose-600' },
    { title: 'COMPANY PREP', desc: 'Target roles & topics', icon: Building2, color: 'from-rose-500 to-amber-600' },
    { title: 'OPPORTUNITIES', desc: 'Challenges & hackathons', icon: Briefcase, color: 'from-amber-500 to-emerald-600' },
    { title: 'APPLY', desc: 'Land top software roles', icon: Send, color: 'from-emerald-500 to-teal-600' }
  ];

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Structured Career Roadmap</span>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1">The Complete DSA Clear Path Journey</h3>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-0">
          Transforming interview preparation into predictable career offers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative">
        {journey.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative flex flex-col items-center text-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="text-xs font-bold text-white tracking-wide mb-1">{item.title}</div>
              <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>

              {idx < journey.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
