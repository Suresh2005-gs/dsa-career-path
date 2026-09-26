import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  Target,
  Trophy,
  BookOpen,
  TrendingUp,
  Brain,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DashboardData } from '../types';
import { api } from '../services/api';
import { DsaClearPathVisual } from '../components/DsaClearPathVisual';

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export const DashboardPage: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm">Loading your DSA path...</div>
        </div>
      </div>
    );
  }

  const { user, stats, continue_path, todays_goal, skill_map, recommended_next } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pattern Mastery Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Preparing for <strong className="text-slate-200">{user.target_role}</strong> at <strong className="text-indigo-400">{user.target_company}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pattern-test')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium hover:border-slate-700 hover:text-white transition-all flex items-center gap-2"
          >
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Test Recognition</span>
          </button>
          <button
            onClick={() => onNavigate('pattern', { slug: continue_path.pattern_slug })}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <span>Resume Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Stats 5-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Overall Progress */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Overall Progress</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.overall_progress_pct}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.overall_progress_pct}%` }}
            />
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.problems_solved} <span className="text-xs text-slate-500 font-normal">curated</span></div>
          <div className="text-[11px] text-emerald-400 mt-2 font-medium">Quality over quantity</div>
        </div>

        {/* Patterns Mastered */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Patterns Mastered</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.patterns_mastered} <span className="text-xs text-slate-500 font-normal">/ 14</span></div>
          <div className="text-[11px] text-amber-400/90 mt-2">1 Mastered • 1 In Progress</div>
        </div>

        {/* Current Streak */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.current_streak_days} <span className="text-xs text-slate-500 font-normal">Days</span></div>
          <div className="text-[11px] text-orange-400 mt-2 font-medium">Consistency builds intuition</div>
        </div>

        {/* Recognition Score */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="text-indigo-300 font-semibold">Recognition Score</span>
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">{stats.recognition_score_pct}%</div>
          <div className="text-[11px] text-slate-400 mt-2">Accuracy: <strong className="text-white">{stats.recognition_accuracy}</strong></div>
        </div>
      </div>

      {/* Large Card: CONTINUE YOUR PATH */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>CONTINUE YOUR PATH</span>
            </div>

            <div>
              <div className="text-xs text-slate-400">Current Topic: <strong className="text-slate-200">{continue_path.current_topic}</strong></div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Current Pattern: {continue_path.current_pattern}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
                Up next: <span className="font-semibold text-white">{continue_path.next_problem_title}</span> ({continue_path.next_problem_difficulty}) — Dynamic boundary contraction logic.
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Progress</span>
                <span className="text-indigo-400 font-bold">{continue_path.solved_in_pattern} / {continue_path.total_in_pattern} Problems</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(continue_path.solved_in_pattern / continue_path.total_in_pattern) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>3 Easy (Solved)</span>
                <span>1 Medium (In Progress)</span>
                <span>3 Hard (Next)</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigate('problem', { slug: continue_path.next_problem_slug })}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('pattern', { slug: continue_path.pattern_slug })}
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <span>View Pattern Deep Dive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Today's Goal + Skill Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Goal (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Daily Objective</span>
              <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                1 / 3 Done
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">{todays_goal.title}</h3>

            <div className="space-y-3">
              {todays_goal.items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (idx === 1) onNavigate('problem', { slug: continue_path.next_problem_slug });
                    if (idx === 2) onNavigate('pattern-test');
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    item.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.completed ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-medium leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
            Completing daily objectives maintains neural pattern retention.
          </div>
        </div>

        {/* Your Skill Map (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Intuition Metrics</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Your Skill Map</h3>
            </div>
            <span className="text-xs text-slate-400">Weighted by pattern recognition tests</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {skill_map.map((skill) => (
              <div key={skill.topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{skill.topic}</span>
                  <span className="font-mono font-bold text-white">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      skill.percentage >= 70
                        ? 'bg-emerald-500'
                        : skill.percentage >= 50
                        ? 'bg-blue-500'
                        : skill.percentage >= 40
                        ? 'bg-indigo-500'
                        : skill.percentage >= 25
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Next Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Recommended Next</span>
              <div className="text-sm font-bold text-white">{recommended_next.pattern_name} ({recommended_next.difficulty})</div>
              <div className="text-xs text-slate-400">{recommended_next.reason}</div>
            </div>
            <button
              onClick={() => onNavigate('pattern', { slug: recommended_next.pattern_slug })}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Start Pattern
            </button>
          </div>
        </div>
      </div>

      {/* Visual Component: Your DSA Clear Path */}
      <DsaClearPathVisual onSelectPattern={(slug) => onNavigate('pattern', { slug })} />
    </div>
  );
};
