import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    problems_solved_over_time,
    patterns_mastered_data,
    recognition_accuracy_history,
    hint_usage_distribution
  } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Learning Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Progress & Mastery Analytics</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Visual evidence of intuition development, pattern recognition growth, and decreasing hint dependency over time.
        </p>
      </div>

      {/* Row 1: Problems Solved Over Time + Hint Dependency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Problems Solved (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Consistency</span>
              <h3 className="text-base font-bold text-white mt-0.5">Problems Solved (Past 7 Days)</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              15 Problems Total
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-800">
            {problems_solved_over_time.map((d: any) => {
              const heightPct = Math.round((d.solved / 5) * 100);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.solved}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                    style={{ height: `${heightPct}%`, minHeight: '12px' }}
                  />
                  <span className="text-xs font-semibold text-slate-400">{d.date}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500">
            Steady pacing avoids cognitive overload and promotes long-term synaptic consolidation.
          </p>
        </div>

        {/* Hint Usage Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Independence Trend</span>
                <h3 className="text-base font-bold text-white mt-0.5">Hint Level Usage</h3>
              </div>
              <Lightbulb className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-3 mt-4">
              {hint_usage_distribution.map((h: any) => {
                const pct = Math.round((h.count / 33) * 100);
                return (
                  <div key={h.level} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{h.level}</span>
                      <span className="font-mono text-indigo-400 font-bold">{h.count} requests</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            💡 Notice that 70% of requests are Level 1 & 2 conceptual clues. Complete solutions are rarely needed!
          </div>
        </div>
      </div>

      {/* Row 2: Pattern Recognition Accuracy Trend & Topic Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pattern Recognition Trend (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Evaluation</span>
              <h3 className="text-base font-bold text-white mt-0.5">Recognition Accuracy Over Time</h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
              80% Current Accuracy
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {recognition_accuracy_history.map((s: any) => (
              <div key={s.session} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{s.session}</span>
                  <span className="font-mono font-bold text-white">{s.score}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Breakdown (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Roadmap Coverage</span>
              <h3 className="text-base font-bold text-white mt-0.5">Topic Patterns Status</h3>
            </div>
            <span className="text-xs text-slate-400">Mastered vs In Progress</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {patterns_mastered_data.map((t: any) => (
              <div
                key={t.topic}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-200">{t.topic}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    {t.mastered} Mastered
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                    {t.in_progress} Active
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                    {t.unstarted} Next
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
