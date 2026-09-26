import React, { useEffect, useState } from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  RotateCcw,
  Compass
} from 'lucide-react';
import { PatternQuestion, PatternAnswerResult } from '../types';
import { api } from '../services/api';

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export const PatternTestPage: React.FC<Props> = ({ onNavigate }) => {
  const [questions, setQuestions] = useState<PatternQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PatternAnswerResult | null>(null);

  useEffect(() => {
    api.getPatternQuestions().then((res) => {
      setQuestions(res);
      setLoading(false);
    });
  }, []);

  const handleSelectOption = (opt: string) => {
    if (result) return; // already submitted
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !questions[currentIndex]) return;
    setSubmitting(true);
    try {
      const res = await api.submitPatternAnswer(questions[currentIndex].id, selectedOption);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setResult(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (loading || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm">Loading Pattern Recognition Assessments...</div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pattern Recognition Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Can You Recognize the Underlying Pattern?
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Interviews don't label problems with tags. Identify the winning algorithmic strategy without code hints.
          </p>
        </div>

        {/* Accuracy Counter */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400">Recognition Accuracy</div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {result ? `${result.total_correct} / ${result.total_answered}` : '8 / 10'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {result ? `${result.user_score_pct}% Intuition Score` : '80.0% Intuition Score'}
          </div>
        </div>
      </div>

      {/* Core Philosophical Callout */}
      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        <span>
          <strong>Key Philosophy:</strong> Solving problems and recognizing patterns are separate skills.
          Practicing pattern diagnostics primes your brain for unfamiliar interview problems.
        </span>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-indigo-400 font-semibold">Unlabelled Interview Scenario</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">{currentQ.title}</h2>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
            "{currentQ.problem_snippet}"
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Which approach would you consider first?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt;
              let btnClass = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';

              if (result) {
                if (opt.toLowerCase() === result.correct_pattern.toLowerCase()) {
                  btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30';
                } else if (isSelected && !result.is_correct) {
                  btnClass = 'bg-rose-950/40 border-rose-500 text-rose-300';
                } else {
                  btnClass = 'opacity-40 bg-slate-950/40 border-slate-800 text-slate-500';
                }
              } else if (isSelected) {
                btnClass = 'bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-500/40';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={!!result}
                  className={`p-4 rounded-xl border text-left font-semibold text-sm transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {result && opt.toLowerCase() === result.correct_pattern.toLowerCase() && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {result && isSelected && !result.is_correct && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {!result ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption || submitting}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Evaluating...' : 'Confirm Pattern Selection'}
          </button>
        ) : (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
            {/* Answer banner */}
            <div
              className={`p-4 rounded-xl border ${
                result.is_correct
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {result.is_correct ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct Recognition! Pattern: {result.correct_pattern}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect. The optimal pattern is {result.correct_pattern}</span>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-300 mt-2 leading-relaxed">
                <strong>Why?</strong> {result.explanation}
              </div>
              <div className="text-xs text-slate-400 mt-1.5 italic">
                {result.why_it_works}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Next Pattern Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
