import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  Send,
  Clock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Building2,
  TrendingUp,
  RotateCcw,
  Code2,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  initialCompany?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const MockInterviewPage: React.FC<Props> = ({ initialCompany = 'Google', onNavigate }) => {
  const [inSession, setInSession] = useState(false);
  const [company, setCompany] = useState(initialCompany);
  const [topic, setTopic] = useState('Arrays & Dynamic Pointers');
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (inSession && timeLeft > 0 && !evaluation) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inSession, timeLeft, evaluation]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = async () => {
    try {
      const res = await api.startMockInterview({
        target_company: company,
        topic: topic,
        difficulty: difficulty,
        time_limit_minutes: 45
      });
      setInterviewData(res);
      setCode(res.problem.starter_code || 'def solve(nums, target):\n    # Enter your interview code\n    pass');
      setTimeLeft(45 * 60);
      setInSession(true);
      setEvaluation(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitInterview = async () => {
    if (!interviewData) return;
    setSubmitting(true);
    try {
      const timeTaken = 45 * 60 - timeLeft;
      const res = await api.submitMockInterview({
        interview_id: interviewData.interview_id,
        code: code,
        time_taken_seconds: timeTaken
      });
      setEvaluation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time Assessment Simulator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Simulated Technical Screen</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Evaluate your pattern recognition, complexity bounds, and code hygiene under timed pressure without hints or labels.
        </p>
      </div>

      {!inSession ? (
        /* Configuration Setup Card */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white">Configure Your Mock Interview</h2>

          <div className="space-y-4 text-xs font-semibold">
            {/* Company selection */}
            <div>
              <label className="text-slate-400 block mb-1.5 uppercase tracking-wider">Target Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
              >
                <option value="Google">Google (SDE-1 / SWE)</option>
                <option value="Microsoft">Microsoft (Software Engineer)</option>
                <option value="Amazon">Amazon (SDE-1)</option>
                <option value="TCS">TCS (Digital / Ninja)</option>
                <option value="Infosys">Infosys (Specialist Programmer)</option>
                <option value="Wipro">Wipro (Project Engineer)</option>
                <option value="Accenture">Accenture (Advanced ASE)</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="text-slate-400 block mb-1.5 uppercase tracking-wider">Interview Focus Area</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
              >
                <option value="Arrays & Dynamic Pointers">Arrays & Dynamic Pointers (Sliding / Two Pointers)</option>
                <option value="Strings & Frequency Maps">Strings & Frequency Maps</option>
                <option value="Binary Search & Monotonic Space">Binary Search & Monotonic Space</option>
                <option value="Trees & Recursive DFS">Trees & Recursive DFS</option>
                <option value="Graphs & Shortest Path BFS">Graphs & Shortest Path BFS</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-slate-400 block mb-1.5 uppercase tracking-wider">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl border text-center transition-all ${
                      difficulty === diff
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Limit Notice */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-slate-300">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <div><strong>Standard Time Limit:</strong> 45 minutes</div>
                <div className="text-[11px] text-slate-400">The pattern name will be masked to evaluate genuine recognition.</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin Technical Screen</span>
          </button>
        </div>
      ) : !evaluation ? (
        /* LIVE INTERVIEW SCREEN */
        <div className="space-y-4">
          {/* Top Session Bar with Timer */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {interviewData.target_company} Technical Screen in Progress
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-indigo-300">Topic: {interviewData.topic}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-mono font-bold text-lg text-amber-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{formatTimer(timeLeft)}</span>
              </div>

              <button
                onClick={handleSubmitInterview}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Evaluating...' : 'Submit Interview'}</span>
              </button>
            </div>
          </div>

          {/* 2-Column Problem & Code Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[550px]">
            {/* Problem Statement (Masked Pattern) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-y-auto max-h-[650px] space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Live Question (Pattern Masked)
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{interviewData.problem.title}</h3>
                <div className="text-xs text-slate-300 mt-3 whitespace-pre-line leading-relaxed">
                  {interviewData.problem.description}
                </div>
              </div>

              {interviewData.problem.examples && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400">Sample Example:</span>
                  {interviewData.problem.examples.slice(0, 1).map((ex: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                      <div>Input: {ex.input}</div>
                      <div className="text-emerald-400 mt-1 font-bold">Output: {ex.output}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 <em>Tip for Interview:</em> Verbalize your time/space invariants before typing the loops. State the boundary conditions explicitly.
              </div>
            </div>

            {/* Code Editor */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 font-medium">editor.py</span>
                <span className="text-[11px] text-slate-500">Python 3 Execution Scope</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                rows={20}
                className="w-full flex-1 p-4 bg-transparent text-slate-200 outline-none resize-none font-mono text-xs leading-relaxed"
                placeholder="Write your clean, interview-ready code here..."
              />
            </div>
          </div>
        </div>
      ) : (
        /* EVALUATION LEARNING FEEDBACK SCREEN */
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  Post-Interview Debrief
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">Educational Learning Feedback</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target: {evaluation.target_company} • Topic: {evaluation.topic} • Difficulty: {evaluation.difficulty}
                </p>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold">
                Educational Review
              </span>
            </div>

            {/* 5-Criteria Rubric Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Correctness</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">{evaluation.correctness_score}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Pattern Recog.</span>
                <div className="text-xl font-bold text-cyan-400 mt-1">{evaluation.pattern_recognition_score}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Time Comp.</span>
                <div className="text-xl font-bold text-indigo-400 mt-1">{evaluation.time_complexity_score}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Space Comp.</span>
                <div className="text-xl font-bold text-blue-400 mt-1">{evaluation.space_complexity_score}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Explanation</span>
                <div className="text-xl font-bold text-amber-400 mt-1">{evaluation.explanation_quality_score}%</div>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {evaluation.learning_feedback}
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {evaluation.strengths.map((s: string, idx: number) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Focus Areas For Real Interview
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {evaluation.areas_for_improvement.map((a: string, idx: number) => (
                    <li key={idx}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setInSession(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Configure Another Mock
              </button>
              <button
                onClick={() => onNavigate('opportunities')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Discover Hiring Opportunities</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
