import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, ArrowRight, Wallet, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole, currentPage, navigateTo } = useApp();

  const isAppView = currentPage !== 'landing' && currentPage !== 'auth';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
              Proof<span className="text-blue-600">2</span>Pay
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        {!isAppView ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              How It Works
            </a>
            <a href="#proofgraph" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              ProofGraph AI
            </a>
            <a href="#paypal-escrow" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              PayPal Escrow
            </a>
            <a href="#comparison" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Comparison
            </a>
            <button
              onClick={() => navigateTo('payment-history')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Ledger
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => navigateTo('client-dashboard')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'client-dashboard' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Client Console
            </button>
            <button
              onClick={() => navigateTo('freelancer-dashboard')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'freelancer-dashboard' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Freelancer Hub
            </button>
            <button
              onClick={() => navigateTo('project-details', { projectId: 'proj_01' })}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'project-details' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Active Projects
            </button>
            <button
              onClick={() => navigateTo('proofgraph-report', { reportId: 'pg_01_2' })}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'proofgraph-report' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              ProofGraph Report
            </button>
            <button
              onClick={() => navigateTo('payment-history')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'payment-history' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Payments
            </button>
          </nav>
        )}

        {/* Zone 3: 1 Primary Action & Context Control */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Demo Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => switchRole('client')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentUser.role === 'client'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Client Mode
            </button>
            <button
              onClick={() => switchRole('freelancer')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentUser.role === 'freelancer'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Freelancer Mode
            </button>
          </div>

          {!isAppView ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('auth')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigateTo('client-dashboard')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Enter App
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigateTo('create-project')}
              >
                New Project
              </Button>
              <button
                onClick={() => navigateTo('landing')}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 ml-1 underline"
              >
                Landing
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
