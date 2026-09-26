import React, { useEffect, useState } from 'react';
import {
  Play,
  Send,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Code2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Cpu,
  Layers,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { ProblemDetail } from '../types';
import { api } from '../services/api';

interface Props {
  problemSlug: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ProblemWorkspacePage: React.FC<Props> = ({ problemSlug, onNavigate }) => {
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<'tests' | 'output' | 'complexity'>('tests');
  const [runResult, setRunResult] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // AI Assistant states
  const [aiAction, setAiAction] = useState<string>('give_hint');
  const [hintStep, setHintStep] = useState<number>(1);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: "👋 I'm your DSA Mentor. Instead of giving you answers, I'll guide your thinking through progressive clues. How can I help you unpack this problem?"
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getProblem(problemSlug || 'minimum-size-subarray-sum').then((res) => {
      setProblem(res);
      setCode(res.starter_code || 'def min_sub_array_len(target, nums):\n    # Enter code\n    pass');
      setLoading(false);
    });
  }, [problemSlug]);

  const handleRunCode = async () => {
    if (!problem) return;
    setRunning(true);
    try {
      const res = await api.runCode(problem.id, code);
      setRunResult(res);
      setActiveTab('output');
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const res = await api.submitCode(problem.id, code);
      setRunResult(res);
      setActiveTab('output');
      if (res.status === 'Accepted') {
        setProblem((prev) => (prev ? { ...prev, current_status: 'completed' } : null));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // AI Mentor Quick Actions
  const handleAiAction = async (actionType: string) => {
    if (!problem) return;
    setAiLoading(true);
    setAiAction(actionType);

    try {
      const res = await api.askAiMentor({
        problem_id: problem.id,
        action_type: actionType,
        current_code: code,
        hint_step: hintStep
      });

      if (actionType === 'give_hint' && res.hint_step) {
        setHintStep(res.hint_step);
      }

      setAiMessages((prev) => [
        ...prev,
        {
          role: 'user',
          text:
            actionType === 'give_hint'
              ? `Give me a hint (Level ${hintStep})`
              : actionType === 'explain_problem'
              ? 'Explain the problem intuitively'
              : actionType === 'find_pattern'
              ? 'Help me identify the pattern'
              : actionType === 'find_mistake'
              ? 'Find my mistake'
              : actionType === 'explain_complexity'
              ? 'Explain the optimal complexity'
              : 'Analyze my approach'
        },
        { role: 'ai', text: res.message }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendCustomAiMessage = async () => {
    if (!aiInput.trim() || !problem) return;
    const msg = aiInput.trim();
    setAiInput('');
    setAiLoading(true);

    setAiMessages((prev) => [...prev, { role: 'user', text: msg }]);

    try {
      const res = await api.askAiMentor({
        problem_id: problem.id,
        action_type: 'chat',
        current_code: code,
        user_message: msg
      });
      setAiMessages((prev) => [...prev, { role: 'ai', text: res.message }]);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading || !problem) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm">Opening problem workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('pattern', { slug: 'sliding-window' })}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            ← Back to Sliding Window
          </button>
          <span className="text-slate-700">|</span>
          <span className="text-xs font-bold text-white">{problem.title}</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              problem.difficulty === 'Easy'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : problem.difficulty === 'Medium'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {problem.difficulty}
          </span>
          {problem.current_status === 'completed' && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Solved
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAiAction('give_hint')}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
            <span>Get Hint (Level {hintStep}/5)</span>
          </button>
          <button
            onClick={handleRunCode}
            disabled={running}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{running ? 'Running...' : 'Run Code'}</span>
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={submitting}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Coding Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[620px]">
        {/* LEFT COLUMN: Problem Statement (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between overflow-y-auto max-h-[700px]">
          <div className="space-y-5">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Problem Description
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{problem.title}</h2>
              <div className="text-xs text-slate-300 mt-3 whitespace-pre-line leading-relaxed">
                {problem.description}
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold text-slate-400">Examples</div>
              {problem.examples &&
                problem.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono">
                    <div className="text-slate-400">Input: <span className="text-slate-200">{ex.input}</span></div>
                    <div className="text-slate-400 mt-1">Output: <span className="text-emerald-400 font-bold">{ex.output}</span></div>
                    {ex.explanation && (
                      <div className="text-slate-500 font-sans text-[11px] mt-1 italic">
                        Explanation: {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <div className="text-xs uppercase font-bold text-slate-400">Constraints</div>
              <ul className="space-y-1">
                {problem.constraints &&
                  problem.constraints.map((c, idx) => (
                    <li key={idx} className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      {c}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-6 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Pattern: {problem.pattern_name}</span>
            <span>Target: O(N) Time • O(1) Space</span>
          </div>
        </div>

        {/* CENTER COLUMN: Code Editor + Test Output (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 max-h-[700px]">
          {/* Code Editor */}
          <div className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-slate-300 font-medium">solution.py (Python 3)</span>
              </div>
              <button
                onClick={() => setCode(problem.starter_code)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                title="Reset to starter code"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="flex-1 p-3 font-mono text-xs overflow-auto bg-[#0a0d17]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                rows={16}
                className="w-full h-full bg-transparent text-slate-200 outline-none resize-none font-mono text-xs leading-relaxed"
                placeholder="Write your python solution here..."
              />
            </div>
          </div>

          {/* Bottom Tabs: Test Cases / Output / Complexity */}
          <div className="h-56 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('tests')}
                className={`pb-1 border-b-2 transition-colors ${
                  activeTab === 'tests' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('output')}
                className={`pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'output' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Output
                {runResult && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      runResult.status === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('complexity')}
                className={`pb-1 border-b-2 transition-colors ${
                  activeTab === 'complexity' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Complexity Analysis
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono">
              {activeTab === 'tests' && (
                <div className="space-y-2">
                  {problem.test_cases &&
                    problem.test_cases.map((tc, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        <div><strong className="text-slate-500">Case {idx + 1}:</strong> {tc.input}</div>
                        <div className="text-slate-400 mt-0.5">Expected: <span className="text-emerald-400 font-bold">{tc.expected}</span></div>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === 'output' && (
                <div>
                  {runResult ? (
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {runResult.status === 'Accepted' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          )}
                          <span
                            className={`text-sm font-bold ${
                              runResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {runResult.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Runtime: {runResult.runtime_ms} ms • Memory: {runResult.memory_mb} MB
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        {runResult.learning_feedback}
                      </div>

                      <div className="space-y-1.5 font-mono">
                        {runResult.test_results &&
                          runResult.test_results.map((tr: any) => (
                            <div
                              key={tr.test_num}
                              className={`p-2 rounded border text-[11px] flex items-center justify-between ${
                                tr.passed
                                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                              }`}
                            >
                              <span>Test {tr.test_num}: {tr.input_str}</span>
                              <span className="font-bold">{tr.passed ? 'PASSED' : 'FAILED'}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-center py-6 font-sans">
                      Click "Run Code" or "Submit" to execute against test suite.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'complexity' && (
                <div className="space-y-3 font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Time Complexity</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">O(N) Amortized</div>
                      <div className="text-[11px] text-slate-400 mt-1">Left and right pointers advance at most N times total.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Space Complexity</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5">O(1) Auxiliary</div>
                      <div className="text-[11px] text-slate-400 mt-1">Only scalar integer variables maintained.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI DSA Assistant (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-slate-900/70 border border-indigo-500/25 p-4 flex flex-col justify-between max-h-[700px] shadow-lg shadow-indigo-500/5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">AI DSA Mentor</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded">
                Socratic Mode
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 my-3">
              <button
                onClick={() => handleAiAction('explain_problem')}
                className="px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-medium text-left truncate transition-colors"
                title="Explain Problem"
              >
                📖 Explain Problem
              </button>
              <button
                onClick={() => handleAiAction('give_hint')}
                className="px-2 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-[11px] font-semibold text-left truncate transition-colors"
                title="Give Me a Hint"
              >
                💡 Hint ({hintStep}/5)
              </button>
              <button
                onClick={() => handleAiAction('find_pattern')}
                className="px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-medium text-left truncate transition-colors"
                title="Help Me Find the Pattern"
              >
                🔍 Find Pattern
              </button>
              <button
                onClick={() => handleAiAction('explain_approach')}
                className="px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-medium text-left truncate transition-colors"
                title="Explain My Approach"
              >
                📐 My Approach
              </button>
              <button
                onClick={() => handleAiAction('find_mistake')}
                className="px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] font-medium text-left truncate transition-colors"
                title="Find My Mistake"
              >
                🧐 Find Mistake
              </button>
              <button
                onClick={() => handleAiAction('explain_complexity')}
                className="px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-medium text-left truncate transition-colors"
                title="Explain Complexity"
              >
                ⏱️ Complexity
              </button>
            </div>

            {/* Chat Transcript */}
            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-slate-950/80 border border-indigo-500/20 text-slate-200'
                      : 'bg-indigo-600/30 border border-indigo-400/30 text-indigo-100 ml-4 font-medium'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {msg.role === 'ai' ? '🤖 DSA Mentor' : '👤 You'}
                  </div>
                  <div className="whitespace-pre-line text-[11px]">{msg.text}</div>
                </div>
              ))}
              {aiLoading && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-400 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Mentor is formulating conceptual clue...</span>
                </div>
              )}
            </div>
          </div>

          {/* AI input footer */}
          <div className="pt-3 border-t border-slate-800 mt-2">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustomAiMessage()}
                placeholder="Ask mentor (e.g. 'I am stuck')..."
                className="bg-transparent text-xs text-white placeholder-slate-500 outline-none flex-1"
              />
              <button
                onClick={handleSendCustomAiMessage}
                className="text-indigo-400 hover:text-indigo-300 p-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
