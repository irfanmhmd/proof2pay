import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Briefcase,
  FolderPlus,
  ShieldCheck,
  FileCheck2,
  CreditCard,
  User,
  ExternalLink,
  Lock,
  CheckCircle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, currentPage, navigateTo, projects, transactions } = useApp();

  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const inEscrowTransactionsCount = transactions.filter(t => t.status === 'in_escrow').length;

  const navItems = [
    {
      id: 'client-dashboard',
      label: 'Client Dashboard',
      icon: LayoutDashboard,
      page: 'client-dashboard' as const,
      badge: currentUser.role === 'client' ? 'Active' : undefined,
    },
    {
      id: 'freelancer-dashboard',
      label: 'Freelancer Hub',
      icon: User,
      page: 'freelancer-dashboard' as const,
      badge: currentUser.role === 'freelancer' ? 'Active' : undefined,
    },
    {
      id: 'project-details',
      label: 'Projects & Contracts',
      icon: Briefcase,
      page: 'project-details' as const,
      params: { projectId: 'proj_01' },
      count: activeProjectsCount,
    },
    {
      id: 'create-project',
      label: 'Create Project',
      icon: FolderPlus,
      page: 'create-project' as const,
    },
    {
      id: 'evidence-submission',
      label: 'Evidence Submission',
      icon: FileCheck2,
      page: 'evidence-submission' as const,
      params: { projectId: 'proj_01', milestoneId: 'ms_01_2' },
    },
    {
      id: 'proofgraph-report',
      label: 'ProofGraph AI Reports',
      icon: ShieldCheck,
      page: 'proofgraph-report' as const,
      params: { reportId: 'pg_01_2' },
    },
    {
      id: 'payment-history',
      label: 'Payment & Escrow Ledger',
      icon: CreditCard,
      page: 'payment-history' as const,
      count: inEscrowTransactionsCount > 0 ? inEscrowTransactionsCount : undefined,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
              {currentUser.role} · {currentUser.company || 'Enterprise'}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Workspace
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.page, item.params)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom PayPal Trust Box */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="text-[#003087] font-bold">Pay</span><span className="text-[#0079C1] font-bold">Pal</span> Escrow
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono truncate">
            {currentUser.paypalEmail}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
            <span>Escrow Protection</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Active (2.5%)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
