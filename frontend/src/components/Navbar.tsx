import React from 'react';
import { Search, Bell, Sparkles, User as UserIcon, Code2, Menu } from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User | null;
  onOpenMobileMenu: () => void;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<Props> = ({ user, onOpenMobileMenu, onNavigate, onOpenSearch }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                DSA CLEAR PATH
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MVP
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Stop Random Problems. Master Patterns.
              </div>
            </div>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs hover:border-slate-700 cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search topics, patterns, company questions... (e.g. Sliding Window)</span>
            <kbd className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right User & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target: <strong className="text-white">{user?.target_company || 'Google'}</strong></span>
          </div>

          <button
            onClick={() => alert("Notification: You've completed 4 of 9 Sliding Window problems! Continue to unlock mastery.")}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
          </button>

          {/* Profile pill */}
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-medium text-white leading-none">{user?.name || 'Suresh Kumar'}</div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">7-Day Streak 🔥</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
