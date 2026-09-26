import React, { useEffect, useState } from 'react';
import {
  Building2,
  Briefcase,
  Target,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Terminal
} from 'lucide-react';
import { Company } from '../types';
import { api } from '../services/api';

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export const CompanyPrepPage: React.FC<Props> = ({ onNavigate }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanySlug, setSelectedCompanySlug] = useState('google');
  const [selectedRole, setSelectedRole] = useState('Software Engineer (L3/L4)');
  const [companyDetail, setCompanyDetail] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompanies().then((res) => {
      setCompanies(res);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getCompanyDetail(selectedCompanySlug, selectedRole).then((res) => {
      setCompanyDetail(res);
      if (res.target_roles && res.target_roles.length > 0 && !res.target_roles.includes(selectedRole)) {
        setSelectedRole(res.target_roles[0]);
      }
      setLoading(false);
    });
  }, [selectedCompanySlug, selectedRole]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Targeted Company Preparation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Company-Oriented Preparation</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Focus on high-yield patterns required by your dream companies. Sourced from community-verified hiring experiences and official syllabi.
        </p>
      </div>

      {/* Company Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['google', 'microsoft', 'amazon', 'tcs', 'infosys', 'wipro', 'accenture'].map((slug) => {
          const isSelected = selectedCompanySlug === slug;
          const label =
            slug === 'google'
              ? 'Google'
              : slug === 'microsoft'
              ? 'Microsoft'
              : slug === 'amazon'
              ? 'Amazon'
              : slug === 'tcs'
              ? 'TCS'
              : slug === 'infosys'
              ? 'Infosys'
              : slug === 'wipro'
              ? 'Wipro'
              : 'Accenture';

          return (
            <button
              key={slug}
              onClick={() => setSelectedCompanySlug(slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {loading || !companyDetail ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Company Hero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-xl">
                  {companyDetail.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{companyDetail.name}</h2>
                  <div className="text-xs text-slate-400 mt-0.5">Difficulty Profile: <strong className="text-indigo-400">{companyDetail.difficulty_profile}</strong></div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {companyDetail.description}
              </p>

              {/* Roles selection */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-400">Target Role:</span>
                {companyDetail.target_roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedRole === role
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Mock Interview Trigger */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/20 flex flex-col justify-between shrink-0 lg:w-72">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Assessment Ready</span>
                <h4 className="text-sm font-bold text-white mt-1">Take {companyDetail.name} Mock</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  45-minute timed coding screen simulating real interview patterns.
                </p>
              </div>
              <button
                onClick={() => onNavigate('mock-interview', { company: companyDetail.name })}
                className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Start Mock Interview</span>
              </button>
            </div>
          </div>

          {/* Topics Coverage & Focus Next (2 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pattern Coverage */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Pattern Coverage</span>
                <span className="text-xs text-slate-400">Your Current Readiness</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-6">Your Preparation for {companyDetail.name}</h3>

              <div className="space-y-4">
                {companyDetail.relevant_topics.map((t) => (
                  <div key={t.topic} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{t.topic}</span>
                      <span className="font-mono font-bold text-indigo-400">{t.coverage}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          t.coverage >= 80 ? 'bg-emerald-500' : t.coverage >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${t.coverage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Next (4 cols) */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Gap Analysis</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-4">Focus Next</h3>
                <p className="text-xs text-slate-400 mb-4">
                  These topics have lower preparation coverage and represent your highest leverage improvement areas for {companyDetail.name}:
                </p>

                <div className="space-y-2">
                  {companyDetail.focus_next.map((fn, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between"
                    >
                      <span>{fn}</span>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold">
                        Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 italic">
                *Coverage is updated as you solve curated 3-3-3 pattern tiers.
              </div>
            </div>
          </div>

          {/* Curated Company Questions Section */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Representative Questions</span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Frequently Tested {companyDetail.name} Problems
                </h3>
              </div>
              <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                Community Sourced & Labelled
              </span>
            </div>

            {/* Compliance Banner */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>Data Transparency:</strong> These questions reflect community-reported interview experiences and public candidate debriefs. DSA Clear Path does not claim proprietary company question bank access.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyDetail.questions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => onNavigate('problem', { slug: 'sliding-window-maximum' })}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {q.frequency} Frequency
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{q.title}</h4>
                    <div className="text-xs text-slate-400 mt-1">
                      Topic: <strong className="text-slate-300">{q.topic_name}</strong> • Pattern: <strong className="text-indigo-300">{q.pattern_name}</strong>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Source: {q.source}</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                      Practice <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
