import React, { useState, useEffect } from 'react';
import { User } from './types';
import { api } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoJourneyBar } from './components/DemoJourneyBar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DsaPathPage } from './pages/DsaPathPage';
import { PatternDetailPage } from './pages/PatternDetailPage';
import { ProblemWorkspacePage } from './pages/ProblemWorkspacePage';
import { PatternTestPage } from './pages/PatternTestPage';
import { CompanyPrepPage } from './pages/CompanyPrepPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthModal } from './pages/AuthModal';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [pageParams, setPageParams] = useState<any>({});
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    api.getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => {
        // Fallback default demo user
        setUser({
          id: 1,
          name: 'Suresh G',
          email: 'suresh@dsaclearpath.dev',
          target_role: 'AI Engineer',
          target_company: 'Google',
          current_streak: 7,
          recognition_score: 80.0,
          tests_completed: 10,
          tests_correct: 8
        });
      });
  }, []);

  // Keyboard shortcut ⌘K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDemo = () => {
    navigateTo('dashboard');
  };

  const getStepIndex = () => {
    switch (currentPage) {
      case 'dashboard':
        return 0;
      case 'path':
        return 1;
      case 'pattern':
        return 2;
      case 'problem':
        return 3;
      case 'pattern-test':
        return 4;
      case 'company-prep':
        return 5;
      case 'mock-interview':
        return 6;
      case 'opportunities':
        return 7;
      default:
        return 0;
    }
  };

  // If user is on landing page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <LandingPage
          onStartDemo={handleStartDemo}
          onOpenLogin={() => setAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(u) => {
            setUser(u);
            navigateTo('dashboard');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Judge Demo Journey walkthrough bar */}
      <DemoJourneyBar
        currentStepIndex={getStepIndex()}
        onNavigate={(page, params) => navigateTo(page, params)}
      />

      {/* Main app layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => navigateTo(page)}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            user={user}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onNavigate={(page) => navigateTo(page)}
            onOpenSearch={() => setSearchModalOpen(true)}
          />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {currentPage === 'dashboard' && <DashboardPage onNavigate={navigateTo} />}
            {currentPage === 'path' && <DsaPathPage onNavigate={navigateTo} />}
            {currentPage === 'pattern' && (
              <PatternDetailPage
                patternSlug={pageParams.slug || 'sliding-window'}
                onNavigate={navigateTo}
              />
            )}
            {currentPage === 'problem' && (
              <ProblemWorkspacePage
                problemSlug={pageParams.slug || 'minimum-size-subarray-sum'}
                onNavigate={navigateTo}
              />
            )}
            {currentPage === 'pattern-test' && <PatternTestPage onNavigate={navigateTo} />}
            {currentPage === 'company-prep' && <CompanyPrepPage onNavigate={navigateTo} />}
            {currentPage === 'mock-interview' && (
              <MockInterviewPage
                initialCompany={pageParams.company || 'Google'}
                onNavigate={navigateTo}
              />
            )}
            {currentPage === 'opportunities' && <OpportunitiesPage />}
            {currentPage === 'analytics' && <AnalyticsPage />}
            {currentPage === 'profile' && <ProfilePage />}
          </main>
        </div>
      </div>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div
          onClick={() => setSearchModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-4 space-y-3"
          >
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, patterns, problems (e.g. Sliding Window, Two Pointers)..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />

            <div className="space-y-1 text-xs">
              <div
                onClick={() => {
                  navigateTo('pattern', { slug: 'sliding-window' });
                  setSearchModalOpen(false);
                }}
                className="p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-slate-200"
              >
                <span>🪟 <strong>Sliding Window</strong> (Arrays / Subarrays)</span>
                <span className="text-indigo-400 font-semibold">Active Pattern</span>
              </div>
              <div
                onClick={() => {
                  navigateTo('problem', { slug: 'minimum-size-subarray-sum' });
                  setSearchModalOpen(false);
                }}
                className="p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-slate-200"
              >
                <span>⚡ <strong>Minimum Size Subarray Sum</strong> (Medium)</span>
                <span className="text-amber-400 font-semibold">Current Problem</span>
              </div>
              <div
                onClick={() => {
                  navigateTo('pattern-test');
                  setSearchModalOpen(false);
                }}
                className="p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-slate-200"
              >
                <span>🧠 <strong>Pattern Recognition Challenge</strong></span>
                <span className="text-cyan-400 font-semibold">Assessment</span>
              </div>
              <div
                onClick={() => {
                  navigateTo('company-prep');
                  setSearchModalOpen(false);
                }}
                className="p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-slate-200"
              >
                <span>🏢 <strong>Google / Amazon Interview Prep</strong></span>
                <span className="text-slate-400">Company Prep</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          navigateTo('dashboard');
        }}
      />
    </div>
  );
}

export default App;
