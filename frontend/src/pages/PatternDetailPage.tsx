import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  Brain,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Pattern, ProblemSummary } from '../types';
import { api } from '../services/api';

interface Props {
  patternSlug: string;
  onNavigate: (page: string, params?: any) => void;
}

export const PatternDetailPage: React.FC<Props> = ({ patternSlug, onNavigate }) => {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'practice' | 'deepdive' | 'flow'>('practice');

  useEffect(() => {
    setLoading(true);
    api.getPattern(patternSlug || 'sliding-window').then((res) => {
      setPattern(res);
      setLoading(false);
    });
  }, [patternSlug]);

  if (loading || !pattern) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm">Loading pattern insights...</div>
        </div>
      </div>
    );
  }

  // Filter problems by difficulty
  const easyProblems = pattern.problems.filter((p) => p.difficulty === 'Easy');
  const mediumProblems = pattern.problems.filter((p) => p.difficulty === 'Medium');
  const hardProblems = pattern.problems.filter((p) => p.difficulty === 'Hard');

  return (
    <div className="space-y-8 pb-12">
      {/* Pattern Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                Topic: {pattern.topic_name || 'Arrays'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Pattern: {pattern.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('pattern-test')}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500 flex items-center gap-2 transition-colors"
              >
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Test Pattern Recognition</span>
              </button>
              <button
                onClick={() => onNavigate('problem', { slug: 'minimum-size-subarray-sum' })}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Continue Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {pattern.name}
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            "{pattern.description}"
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Solved Progress</span>
              <span className="text-white font-bold font-mono text-sm">{pattern.solved_count} / {pattern.total_problems} Problems</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Time Complexity</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">{pattern.time_complexity}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Space Complexity</span>
              <span className="text-blue-400 font-bold font-mono text-sm">{pattern.space_complexity}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Structure</span>
              <span className="text-indigo-300 font-semibold text-sm">3 Easy • 3 Medium • 3 Hard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('practice')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'practice' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Curated Practice (3-3-3)</span>
          {activeTab === 'practice' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('flow')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'flow' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>When to Recognize & Signals</span>
          {activeTab === 'flow' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('deepdive')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'deepdive' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Pattern Unlocked (Deep Dive)</span>
          {activeTab === 'deepdive' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: CURATED PRACTICE (3 Easy, 3 Medium, 3 Hard) */}
      {activeTab === 'practice' && (
        <div className="space-y-8">
          {/* Easy Tier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <h3 className="text-base font-bold text-white">Easy Problems (Foundational Window Invariants)</h3>
              </div>
              <span className="text-xs text-emerald-400 font-medium">3 / 3 Solved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {easyProblems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => onNavigate('problem', { slug: prob.slug })}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {prob.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {prob.estimated_time}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1 leading-snug">{prob.title}</h4>
                    <div className="text-[11px] text-slate-400 mt-1">Topic: Arrays & Subarray Bounds</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                      Solve <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medium Tier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <h3 className="text-base font-bold text-white">Medium Problems (Dynamic Window Contraction & State Maps)</h3>
              </div>
              <span className="text-xs text-amber-400 font-medium">1 / 3 Solved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mediumProblems.map((prob) => {
                const isCurrent = prob.slug === 'minimum-size-subarray-sum';
                const isSolved = prob.status === 'completed';

                return (
                  <div
                    key={prob.id}
                    onClick={() => onNavigate('problem', { slug: prob.slug })}
                    className={`p-5 rounded-2xl bg-slate-900/60 border cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between ${
                      isCurrent
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {prob.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {prob.estimated_time}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1 leading-snug">{prob.title}</h4>
                      <div className="text-[11px] text-slate-400 mt-1">Topic: Variable Window Bounds</div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      {isSolved ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      ) : isCurrent ? (
                        <span className="text-indigo-400 font-bold animate-pulse">
                          Up Next to Solve
                        </span>
                      ) : (
                        <span className="text-slate-400">Not Started</span>
                      )}
                      <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                        Solve <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hard Tier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <h3 className="text-base font-bold text-white">Hard Problems (Monotonic Deques & Multi-pass Sliding)</h3>
              </div>
              <span className="text-xs text-rose-400 font-medium">0 / 3 Solved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hardProblems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => onNavigate('problem', { slug: prob.slug })}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {prob.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {prob.estimated_time}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1 leading-snug">{prob.title}</h4>
                    <div className="text-[11px] text-slate-400 mt-1">Topic: Monotonic Window Deque</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Unlocked for Practice</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                      Solve <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHEN TO RECOGNIZE & SIGNALS & FLOW */}
      {activeTab === 'flow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Signals (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Pattern Diagnostic</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-4">WHEN TO RECOGNIZE IT</h3>
              <ul className="space-y-3">
                {pattern.when_to_recognize.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Trigger Vocabulary</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-4">COMMON SIGNALS</h3>
              <div className="flex flex-wrap gap-2">
                {pattern.common_signals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold"
                  >
                    "{sig}"
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pattern Flow (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Step-by-Step State Flow</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-6">PATTERN FLOW</h3>

            <div className="space-y-4">
              {pattern.pattern_flow.map((step, idx) => (
                <div key={step.step} className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 pb-4 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PATTERN UNLOCKED DEEP DIVE */}
      {activeTab === 'deepdive' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pattern Unlocked</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Full Pattern Anatomy: {pattern.name}</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Understand the invariant structure so you never memorize individual solutions again.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Implementation Structure */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  Typical Implementation Structure
                </span>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                  {pattern.implementation_structure}
                </pre>
              </div>

              {/* Common Mistakes */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Common Mistakes to Avoid in Interviews</span>
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {pattern.common_mistakes}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Time & Space Complexity Proof
                  </span>
                  <div className="text-xs text-slate-300 mt-2 space-y-1">
                    <div>• <strong>Time: {pattern.time_complexity}</strong> — Each element is added once and subtracted at most once.</div>
                    <div>• <strong>Space: {pattern.space_complexity}</strong> — Window state requires only pointers or fixed alphabet maps.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test prompt */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Can you recognize this pattern in an unfamiliar problem?</h4>
                <p className="text-xs text-slate-400">Put your intuition to the test with our pattern recognition challenge.</p>
              </div>
              <button
                onClick={() => onNavigate('pattern-test')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Take Pattern Recognition Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
