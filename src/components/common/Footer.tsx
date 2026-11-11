import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Proof<span className="text-blue-600">2</span>Pay
              </p>
              <p className="text-xs text-slate-500">
                Automated Milestone Verification & PayPal Escrow Infrastructure
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <button onClick={() => navigateTo('landing')} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Overview
            </button>
            <button onClick={() => navigateTo('client-dashboard')} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Client Console
            </button>
            <button onClick={() => navigateTo('freelancer-dashboard')} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Freelancer Hub
            </button>
            <button onClick={() => navigateTo('payment-history')} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Escrow Ledger
            </button>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="font-mono text-slate-400">PayPal Verified Partner</span>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Proof2Pay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
