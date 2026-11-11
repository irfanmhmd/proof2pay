import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, ArrowRight, Check, Lock, Building, Mail, Key } from 'lucide-react';
import { Button } from '../ui/Button';
import { MOCK_USERS } from '../../data/mockData';

export const AuthPage: React.FC = () => {
  const { setCurrentUser, navigateTo, showToast } = useApp();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const handleQuickLogin = (userIndex: number) => {
    const user = MOCK_USERS[userIndex];
    setCurrentUser(user);
    showToast({
      type: 'success',
      title: `Signed in as ${user.name}`,
      message: `Role: ${user.role.toUpperCase()} · PayPal Escrow connected.`,
    });
    if (user.role === 'client') {
      navigateTo('client-dashboard');
    } else {
      navigateTo('freelancer-dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `user_${Date.now()}`,
      name: name || (role === 'client' ? 'Client User' : 'Freelancer Specialist'),
      email: email || `${role}@example.io`,
      role,
      avatar:
        role === 'client'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      company: company || (role === 'client' ? 'Global Ventures' : 'Independent Tech LLC'),
      title: role === 'client' ? 'Hiring Lead' : 'Senior Engineer',
      paypalEmail: paypalEmail || email || 'payouts@example.com',
      paypalVerified: true,
      trustScore: role === 'freelancer' ? 98.5 : undefined,
    };

    setCurrentUser(newUser);
    showToast({
      type: 'success',
      title: mode === 'signin' ? 'Welcome back!' : 'Account Created Successfully',
      message: `Signed in to Proof2Pay as ${newUser.name}.`,
    });

    if (role === 'client') {
      navigateTo('client-dashboard');
    } else {
      navigateTo('freelancer-dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {mode === 'signin' ? 'Sign in to Proof2Pay' : 'Create your Proof2Pay account'}
          </h2>
          <p className="text-xs text-slate-500">
            Smart milestone escrow with automated ProofGraph™ verification.
          </p>
        </div>

        {/* 1-Click Quick Demo Presets */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
            Instant Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin(0)}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <img
                  src={MOCK_USERS[0].avatar}
                  alt="Sarah"
                  className="w-7 h-7 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">TechCorp</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Client Mode</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin(1)}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <img
                  src={MOCK_USERS[1].avatar}
                  alt="Alex"
                  className="w-7 h-7 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Alex Chen</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Freelancer Mode</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Regular Auth Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Picker for Register */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                      role === 'client'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <p className="font-bold">Client</p>
                    <p className="text-[11px] opacity-75 mt-0.5">Fund milestones in escrow</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('freelancer')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                      role === 'freelancer'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <p className="font-bold">Freelancer</p>
                    <p className="text-[11px] opacity-75 mt-0.5">Submit evidence & get paid</p>
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  PayPal Payout / Billing Email
                </label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={e => setPaypalEmail(e.target.value)}
                  placeholder="paypal-account@email.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Used for verified milestone escrow funding and instant releases.
                </p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              {mode === 'signin' ? 'Sign In to Workspace' : 'Complete Registration'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
