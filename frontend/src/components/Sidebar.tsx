import React from 'react';
import {
  LayoutDashboard,
  Map,
  Layers,
  Code2,
  HelpCircle,
  Building2,
  Terminal,
  Briefcase,
  BarChart3,
  User,
  ExternalLink,
  Flame
} from 'lucide-react';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'path', label: 'DSA Path', icon: Map, badge: 'Roadmap' },
    { id: 'patterns', label: 'Pattern Library', icon: Layers, badge: null },
    { id: 'problem', label: 'Problem Workspace', icon: Code2, badge: 'Active' },
    { id: 'pattern-test', label: 'Pattern Recognition', icon: HelpCircle, badge: '80%' },
    { id: 'company-prep', label: 'Company Prep', icon: Building2, badge: '7 Top' },
    { id: 'mock-interview', label: 'Mock Interview', icon: Terminal, badge: 'New' },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, badge: '6 Live' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null }
  ];

  const handleSelect = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-30 w-64 bg-slate-950/95 md:bg-slate-950/60 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleSelect('dashboard')}
            className="cursor-pointer"
          >
            <div className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">⚡</span> DSA CLEAR PATH
            </div>
            <div className="text-[10px] text-slate-400">Pattern-First Interview Prep</div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 py-2">
            Learning Journey
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive
                        ? 'bg-indigo-700/60 text-indigo-100'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom card: Streak indicator */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">7-Day Streak</div>
                  <div className="text-[10px] text-slate-400">Keep solving daily</div>
                </div>
              </div>
              <span className="text-xs font-bold text-orange-400">+120 XP</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
