import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  GitBranch,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const FreelancerDashboard: React.FC = () => {
  const { currentUser, projects, navigateTo, openReceiptModal, transactions } = useApp();

  // Find milestones assigned to this freelancer
  const freelancerProjects = projects.filter(
    p => p.freelancerId === currentUser.id || p.freelancerName === currentUser.name
  );

  const allAssignedMilestones = freelancerProjects.flatMap(p =>
    p.milestones.map(m => ({ ...m, project: p }))
  );

  const activeMilestones = allAssignedMilestones.filter(m => m.status !== 'released');
  const inReviewMilestones = allAssignedMilestones.filter(
    m => m.status === 'evidence_submitted' || m.status === 'ai_verified'
  );
  const completedMilestones = allAssignedMilestones.filter(m => m.status === 'released');

  const inReviewAmount = inReviewMilestones.reduce((sum, m) => sum + m.amount, 0);
  const inEscrowAmount = activeMilestones.reduce((sum, m) => (m.status === 'funded' ? sum + m.amount : sum), 0);
  const settledAmount = completedMilestones.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="space-y-8">
      {/* Title & PayPal Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Freelancer Payout & Deliverables Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking your verified commits, deliverable evidence, and automated PayPal releases.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500">PayPal Wallet:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {currentUser.paypalEmail}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Awaiting Release
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              ${inReviewAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Under ProofGraph AI audit</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Funded in Escrow
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              ${inEscrowAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Locked in PayPal by client</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Settled Payouts
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              ${settledAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Disbursed via PayPal</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            ProofGraph Trust Index
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
              {currentUser.trustScore || 99.2}%
            </span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Tier 1 Verified Contributor</p>
        </Card>
      </div>

      {/* Action Required: Deliverables Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Active Milestone Deliverables
          </h2>
          <span className="text-xs text-slate-500">
            Submit verifiable artifacts (Repo, Staging, Tests) for instant audit
          </span>
        </div>

        <div className="space-y-4">
          {activeMilestones.map(milestone => {
            const hasSubmittedEvidence =
              milestone.status === 'evidence_submitted' || milestone.status === 'ai_verified';

            return (
              <Card key={milestone.id} className="p-5 sm:p-6" hoverEffect>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Milestone Info */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {milestone.project.title}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">Due {milestone.dueDate}</span>
                      <span className="text-slate-300">·</span>
                      <Badge status={milestone.status} size="sm" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Criteria Tags */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {milestone.criteria.map(c => (
                        <span
                          key={c.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                        >
                          {c.category.toUpperCase()}: {c.description.substring(0, 36)}...
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Value */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-6 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                        Milestone Value
                      </span>
                      <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                        ${milestone.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">
                        PayPal Escrow Funded
                      </span>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      {!hasSubmittedEvidence ? (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() =>
                            navigateTo('evidence-submission', {
                              projectId: milestone.projectId,
                              milestoneId: milestone.id,
                            })
                          }
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Submit Evidence
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() =>
                            navigateTo('proofgraph-report', {
                              reportId: milestone.proofGraphId || 'pg_01_2',
                            })
                          }
                          leftIcon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
                        >
                          View ProofGraph
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigateTo('project-details', { projectId: milestone.projectId })
                        }
                      >
                        Contract Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed & Settled Milestones */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Completed & Released Deliverables
        </h2>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="p-3.5">Milestone</th>
                <th className="p-3.5">Contract</th>
                <th className="p-3.5">Released Date</th>
                <th className="p-3.5 text-right">Net Payout</th>
                <th className="p-3.5">Audit Status</th>
                <th className="p-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {completedMilestones.map(m => {
                const txn = transactions.find(t => t.milestoneId === m.id);
                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                      {m.title}
                    </td>
                    <td className="p-3.5 text-slate-500">{m.project.title}</td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {m.releasedAt ? new Date(m.releasedAt).toLocaleDateString() : 'Settled'}
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold tabular-nums text-emerald-600">
                      ${m.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified 98/100
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {txn && (
                        <button
                          onClick={() => openReceiptModal(txn)}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium underline"
                        >
                          Invoice PDF
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
