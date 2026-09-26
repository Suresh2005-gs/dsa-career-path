import React, { useEffect, useState } from 'react';
import {
  User,
  Sparkles,
  Building2,
  Briefcase,
  Flame,
  Trophy,
  Brain,
  CheckCircle2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.getCurrentUser().then((res) => {
      setProfile(res);
    });
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const badges = [
    { title: 'Sliding Window Initiate', desc: 'Solved 4/9 sliding window tiers', date: 'Earned this week', icon: '🪟' },
    { title: 'Pattern Intuition Master', desc: 'Maintained 80%+ recognition accuracy', date: 'Earned yesterday', icon: '🧠' },
    { title: '7-Day Hot Streak', desc: 'Practiced patterns 7 consecutive days', date: 'Active streak', icon: '🔥' },
    { title: 'Google Screen Prep', desc: 'Completed array & hashing review', date: 'Earned 3 days ago', icon: '🎯' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-1 flex items-center justify-center shadow-xl shadow-indigo-600/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white text-2xl font-black">
              {profile.name[0]}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO CANDIDATE
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                {profile.target_role}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                Target: {profile.target_company}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center px-4">
            <div className="flex items-center justify-center gap-1 text-orange-400 font-bold text-sm">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{profile.current_streak} Days</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Streak</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center px-4">
            <div className="text-cyan-400 font-bold text-sm font-mono">{profile.recognition_score}%</div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Accuracy</span>
          </div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">DSA Progress</span>
          <div className="text-2xl font-bold text-white">38%</div>
          <div className="text-[11px] text-indigo-400 mt-1 font-medium">Foundation complete</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Patterns Mastered</span>
          <div className="text-2xl font-bold text-emerald-400">1 / 14</div>
          <div className="text-[11px] text-slate-400 mt-1">Converging Two Pointers</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Problems Solved</span>
          <div className="text-2xl font-bold text-white">4 Curated</div>
          <div className="text-[11px] text-slate-400 mt-1">Quality over volume</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Recognition Score</span>
          <div className="text-2xl font-bold text-cyan-400">{profile.tests_correct} / {profile.tests_completed}</div>
          <div className="text-[11px] text-slate-400 mt-1">80.0% Intuition rating</div>
        </div>
      </div>

      {/* Badges and Mastery Milestones */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Earned Mastery Milestones</h2>
          <span className="text-xs text-slate-400">4 Badges Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3.5"
            >
              <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                {b.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{b.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
                <span className="text-[10px] text-indigo-400 font-semibold block mt-1">{b.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
