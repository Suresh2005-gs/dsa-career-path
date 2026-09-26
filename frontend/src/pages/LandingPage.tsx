import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Compass,
  Code2,
  Cpu,
  Building2,
  Briefcase,
  Layers,
  Zap,
  TrendingUp
} from 'lucide-react';
import { CareerJourneyVisual } from '../components/CareerJourneyVisual';
import { DsaClearPathVisual } from '../components/DsaClearPathVisual';

interface Props {
  onStartDemo: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStartDemo, onOpenLogin }) => {
  const struggleCards = [
    {
      title: 'Random Practice',
      desc: 'Solving 500+ questions arbitrarily without categorizing logic creates fatigue without transferable intuition.',
      icon: XCircle,
      tag: 'Quantity Trap'
    },
    {
      title: 'Pattern Confusion',
      desc: 'Knowing what a "Two Pointer" or "Sliding Window" is in theory, but freezing when given a masked problem in an interview.',
      icon: HelpCircle,
      tag: 'Recognition Gap'
    },
    {
      title: 'Getting Stuck & Peeking',
      desc: 'Looking at solutions within 10 minutes leads to false mastery. You remember the answer, not the derivation.',
      icon: XCircle,
      tag: 'Memorization Loop'
    },
    {
      title: 'No Personal Guidance',
      desc: 'Standard forums give full code immediately rather than progressive pedagogical hints that prompt your own thinking.',
      icon: Cpu,
      tag: 'Passive Learning'
    },
    {
      title: 'The Interview Gap',
      desc: 'Interviews test thinking aloud, clarifying constraints, and identifying underlying structures—not typing speed.',
      icon: TrendingUp,
      tag: 'Evaluation Disconnect'
    },
    {
      title: 'Fragmented Company Prep',
      desc: 'Interview patterns for Google, Amazon, and TCS are scattered across hundreds of disorganized posts and forums.',
      icon: Building2,
      tag: 'Disorganized Sourcing'
    }
  ];

  const steps = [
    { num: '01', title: 'Assess', desc: 'Baseline your algorithmic intuition and current pattern recognition accuracy.' },
    { num: '02', title: 'Learn Patterns', desc: 'Master the core signals, triggers, and invariant structures behind each pattern.' },
    { num: '03', title: 'Practice Curated 3-3-3', desc: 'Solve exactly 3 Easy, 3 Medium, and 3 Hard problems designed to build deep muscle memory.' },
    { num: '04', title: 'Get AI Guidance', desc: 'Receive progressive 5-tier hints that guide your conceptual thinking instead of spoiling code.' },
    { num: '05', title: 'Test Pattern Recognition', desc: 'Identify optimal patterns in unlabelled problem statements without hints.' },
    { num: '06', title: 'Prepare for Companies', desc: 'Align your preparation to Google, Microsoft, Amazon, TCS, Infosys, and Accenture hiring bars.' },
    { num: '07', title: 'Discover Opportunities', desc: 'Apply directly to verified hiring challenges, hackathons, and internship assessments.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-lg">
              ⚡
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">DSA CLEAR PATH</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onStartDemo}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              Explore Demo Mode
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Stop Solving Random DSA Problems. Start Mastering Patterns.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Stop Solving Random <br />
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DSA Problems.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Build problem-solving intuition, recognize patterns, and prepare for technical interviews with a clear DSA learning path.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Start Your DSA Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Demo</span>
          </button>
        </div>

        {/* Visual Comparison: RANDOM PRACTICE vs DSA CLEAR PATH */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">The Core Difference</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Why Method Trumps Quantity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Random Practice Card */}
            <div className="rounded-2xl p-6 sm:p-8 bg-rose-950/20 border border-rose-900/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Old Way</span>
                <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 text-xs font-bold border border-rose-500/20">
                  High Anxiety
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Random Practice</h3>

              <div className="space-y-3 font-mono text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/40 border border-rose-900/20">
                  <span className="text-rose-400 font-bold">1</span> Random Problems
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/40 border border-rose-900/20">
                  <span className="text-rose-400 font-bold">2</span> Solve
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/40 border border-rose-900/20">
                  <span className="text-rose-400 font-bold">3</span> Forget
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/40 border border-rose-900/20">
                  <span className="text-rose-400 font-bold">4</span> Repeat
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 font-semibold">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Still Struggle in Interview</span>
                </div>
              </div>
            </div>

            {/* DSA CLEAR PATH Card */}
            <div className="rounded-2xl p-6 sm:p-8 bg-indigo-950/30 border border-indigo-500/40 backdrop-blur-sm shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">DSA Clear Path</span>
                <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                  High Transferability
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">DSA Clear Path</h3>

              <div className="space-y-3 font-mono text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/60 border border-indigo-500/20">
                  <span className="text-indigo-400 font-bold">1</span> Understand Logic & Invariants
                </div>
                <div className="text-center text-indigo-400/60">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/60 border border-indigo-500/20">
                  <span className="text-indigo-400 font-bold">2</span> Recognize Pattern Signals
                </div>
                <div className="text-center text-indigo-400/60">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/60 border border-indigo-500/20">
                  <span className="text-indigo-400 font-bold">3</span> Practice Curated 3-3-3 Problems
                </div>
                <div className="text-center text-indigo-400/60">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/60 border border-indigo-500/20">
                  <span className="text-indigo-400 font-bold">4</span> Get Progressive AI Guidance
                </div>
                <div className="text-center text-indigo-400/60">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-slate-900/60 border border-indigo-500/20">
                  <span className="text-indigo-400 font-bold">5</span> Test Yourself on Unlabelled Problems
                </div>
                <div className="text-center text-indigo-400/60">↓</div>
                <div className="flex items-center gap-3 p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Prepare for Target Companies & Get Hired</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Roadmap Component Showcase */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <DsaClearPathVisual onSelectPattern={() => onStartDemo()} />
      </section>

      {/* Why Students Struggle With DSA */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold">Root Cause Analysis</span>
          <h2 className="text-3xl font-bold text-white mt-1">Why Students Struggle With DSA</h2>
          <p className="text-slate-400 text-sm mt-2">
            The problem isn't intelligence or lack of effort. It is practicing quantity over pattern recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {struggleCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How DSA Clear Path Works (7 Steps) */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Structured Methodology</span>
          <h2 className="text-3xl font-bold text-white mt-1">How DSA Clear Path Works</h2>
          <p className="text-slate-400 text-sm mt-2">
            A linear, high-signal blueprint taking you from fundamentals to confident interview execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-indigo-500/40 block mb-2">{st.num}</span>
                <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Career Journey Component */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <CareerJourneyVisual />
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Master DSA Patterns?
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Skip the random grind. Experience our interactive demo mode with pre-populated progress immediately.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onStartDemo}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
              >
                Launch Demo Mode Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 DSA Clear Path. Built for hackathon demonstration.</div>
          <div className="flex items-center gap-4">
            <span>Pattern-First Learning</span>
            <span>•</span>
            <span>AI Progressive Mentorship</span>
            <span>•</span>
            <span>Company Screening</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
