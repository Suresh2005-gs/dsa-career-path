import React, { useEffect, useState } from 'react';
import {
  Layers,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Unlock,
  BookOpen,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Topic, Pattern } from '../types';
import { api } from '../services/api';
import { DsaClearPathVisual } from '../components/DsaClearPathVisual';

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export const DsaPathPage: React.FC<Props> = ({ onNavigate }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>('arrays');

  useEffect(() => {
    api.getTopics().then((res) => {
      setTopics(res);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Mastered':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Mastered</span>;
      case 'Completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Completed</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">In Progress</span>;
      case 'Locked':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">Explorable</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">Not Started</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Curated Pattern Hierarchy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">DSA Learning Path</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          14 topics organized into high-probability interview patterns. No artificial locks—explore any pattern freely, but follow the structured progression for optimal intuition.
        </p>
      </div>

      {/* Visual Component */}
      <DsaClearPathVisual onSelectPattern={(slug) => onNavigate('pattern', { slug })} />

      {/* Topics Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">All 14 Topics & Pattern Breakdowns</h2>
          <span className="text-xs text-slate-400">Total Patterns: 36 • Problems: 9 per pattern</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic) => {
            const hasActivePattern = topic.patterns.some((p) => p.status === 'In Progress' || p.status === 'Mastered');

            return (
              <div
                key={topic.id}
                className={`p-5 rounded-2xl bg-slate-900/60 border transition-all duration-300 flex flex-col justify-between ${
                  hasActivePattern
                    ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {topic.order_index}
                      </div>
                      <h3 className="font-bold text-base text-white">{topic.name}</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {topic.skill_level_pct}% Mastery
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {topic.description}
                  </p>

                  {/* Patterns in topic */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Patterns in {topic.name}:
                    </div>

                    {topic.patterns && topic.patterns.length > 0 ? (
                      topic.patterns.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onNavigate('pattern', { slug: p.slug })}
                          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                        >
                          <div>
                            <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {p.solved_count} / {p.total_problems || 9} Curated Solved
                            </div>
                          </div>
                          {getStatusBadge(p.status)}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic p-2 bg-slate-950/30 rounded-lg">
                        Includes core traversal, transformations, and memory representations.
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {topic.patterns ? topic.patterns.length : 1} Pattern Available
                  </span>
                  <button
                    onClick={() => {
                      if (topic.patterns && topic.patterns.length > 0) {
                        onNavigate('pattern', { slug: topic.patterns[0].slug });
                      } else {
                        onNavigate('pattern', { slug: 'sliding-window' });
                      }
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-xs"
                  >
                    <span>View Patterns</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
