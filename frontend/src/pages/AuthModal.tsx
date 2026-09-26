import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('Suresh G');
  const [email, setEmail] = useState('suresh@dsaclearpath.dev');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const user = await api.loginDemo();
      onSuccess(user);
      onClose();
    } catch (e) {
      console.error(e);
      // Fallback
      onSuccess({
        id: 1,
        name: 'Suresh G',
        email: 'suresh@dsaclearpath.dev',
        target_role: 'AI Engineer',
        target_company: 'Google',
        current_streak: 7,
        recognition_score: 80.0
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, target_role: targetRole, target_company: targetCompany })
        });
        const user = await res.json();
        onSuccess(user);
      } else {
        const user = await api.loginDemo();
        onSuccess(user);
      }
      onClose();
    } catch (err) {
      console.error(err);
      handleDemoLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DSA Clear Path Access</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Sign In to Your Path' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build your pattern memory and track company readiness.
          </p>
        </div>

        {/* 1-Click Demo Mode Button */}
        <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-center space-y-2">
          <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block">
            ⭐ Hackathon Judge Quick Entry
          </span>
          <p className="text-[11px] text-slate-400">
            Enter with pre-populated progress (Suresh G, 4/9 Sliding Window solved, 7-day streak).
          </p>
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Hackathon Demo Mode</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-medium absolute">
            or continue with email
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                defaultValue="password123"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-indigo-400 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-indigo-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
