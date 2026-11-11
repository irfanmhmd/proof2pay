import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const ClientDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    transactions,
    navigateTo,
    openPayPalFundingModal,
    openPayPalReleaseModal,
    openReceiptModal,
  } = useApp();

  // Metrics
  const totalEscrowLocked = projects.reduce((sum, p) => sum + p.escrowBalance, 0);
  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingReviewMilestones = projects.flatMap(p =>
    p.milestones
      .filter(m => m.status === 'evidence_submitted' || m.status === 'ai_verified')
      .map(m => ({ ...m, project: p }))
  );
  const totalReleased = transactions
    .filter(t => t.status === 'released')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Client Escrow Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Managing active contracts, verified deliverables, and PayPal escrow balances for {currentUser.company || 'TechCorp'}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('payment-history')}
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            Escrow Ledger
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigateTo('create-project')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Project
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Locked in Escrow
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              ${totalEscrowLocked.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <Lock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Secured via PayPal Gateway</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Active Contracts
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {activeProjects.length}
            </span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 2 specialized teams</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Awaiting Verification
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {pendingReviewMilestones.length}
            </span>
            <FileCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Evidence ready for audit</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Total Settled Payouts
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              ${totalReleased.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">100% verified milestones</p>
        </Card>
      </div>

      {/* High-Priority Verification Alert Card if pending review */}
      {pendingReviewMilestones.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold">
                ProofGraph™ Verification Ready for Review
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Freelancer {pendingReviewMilestones[0].project.freelancerName} has submitted deliverable evidence for &quot;{pendingReviewMilestones[0].title}&quot;. AI heuristics audit score: 96/100 (Pass).
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateTo('proofgraph-report', { reportId: 'pg_01_2' })}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Inspect ProofGraph Audit
            </Button>
            <Button
              variant="paypal"
              size="sm"
              onClick={() =>
                openPayPalReleaseModal(
                  pendingReviewMilestones[0].project.id,
                  pendingReviewMilestones[0].id
                )
              }
            >
              Release ${pendingReviewMilestones[0].amount.toLocaleString()}
            </Button>
          </div>
        </div>
      )}

      {/* Active Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Active Projects & Escrow Health
          </h2>
          <button
            onClick={() => navigateTo('create-project')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Add Contract</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => {
            const completedCount = project.milestones.filter(m => m.status === 'released').length;
            const totalCount = project.milestones.length;
            const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const nextMilestone = project.milestones.find(
              m => m.status !== 'released'
            ) || project.milestones[project.milestones.length - 1];

            return (
              <Card key={project.id} className="p-5 sm:p-6" hoverEffect>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Project Info */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400">Created {project.createdAt}</span>
                    </div>

                    <h3
                      onClick={() => navigateTo('project-details', { projectId: project.id })}
                      className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Freelancer Profile */}
                    <div className="pt-2 flex items-center gap-2.5">
                      <img
                        src={project.freelancerAvatar}
                        alt={project.freelancerName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {project.freelancerName} ({project.freelancerTitle})
                      </span>
                    </div>
                  </div>

                  {/* Financials & Milestones Progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-6 shrink-0">
                    <div className="space-y-1.5 min-w-[140px]">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Milestones</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                          {completedCount}/{totalCount} ({progressPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Next: {nextMilestone?.title.substring(0, 24)}...
                      </p>
                    </div>

                    <div className="space-y-0.5 text-right sm:min-w-[110px]">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                        Locked Escrow
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                        ${project.escrowBalance.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        of ${project.totalBudget.toLocaleString()} total
                      </span>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigateTo('project-details', { projectId: project.id })}
                      >
                        Manage Milestones
                      </Button>
                      {nextMilestone && nextMilestone.status === 'pending_funding' && (
                        <Button
                          variant="paypal"
                          size="sm"
                          onClick={() => openPayPalFundingModal(project.id, nextMilestone.id)}
                        >
                          Fund Next (${nextMilestone.amount})
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent PayPal Escrow Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent PayPal Escrow Activity
          </h2>
          <button
            onClick={() => navigateTo('payment-history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Full Ledger →
          </button>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Milestone / Contract</th>
                <th className="p-3.5">Recipient</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {transactions.slice(0, 4).map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-slate-500">{txn.invoiceNumber}</td>
                  <td className="p-3.5">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{txn.milestoneTitle}</p>
                    <p className="text-[11px] text-slate-400">{txn.projectName}</p>
                  </td>
                  <td className="p-3.5">{txn.payeeName}</td>
                  <td className="p-3.5 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    ${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5">
                    <Badge status={txn.status === 'released' ? 'released' : 'funded'}>
                      {txn.status === 'released' ? 'Settled' : 'In Escrow'}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => openReceiptModal(txn)}
                      className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium underline"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
