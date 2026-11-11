import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  GitBranch,
  Terminal,
  FileCheck2,
  CreditCard,
  Plus,
  Play,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const ProjectDetailsPage: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    currentUser,
    navigateTo,
    openPayPalFundingModal,
    openPayPalReleaseModal,
    openReceiptModal,
    transactions,
    evidences,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'milestones' | 'evidence' | 'proofgraph' | 'financials'>('milestones');

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  if (!project) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold">Project not found</h2>
        <Button variant="primary" onClick={() => navigateTo('client-dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const projectTransactions = transactions.filter(t => t.projectId === project.id);
  const projectEvidences = evidences.filter(e => e.projectId === project.id);
  const completedMilestones = project.milestones.filter(m => m.status === 'released').length;
  const progressPercent = Math.round((completedMilestones / project.milestones.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigateTo('client-dashboard')} className="hover:text-slate-800">
            Projects
          </button>
          <span>/</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
            {project.id}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded">
                {project.category}
              </span>
              <span className="text-xs text-slate-500">Deadline: {project.deadline}</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Contract
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {project.description}
            </p>

            {/* Stakeholder Profiles */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <img
                  src={project.clientAvatar}
                  alt={project.clientName}
                  className="w-6 h-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span>Client: <strong>{project.clientName}</strong> ({project.clientCompany})</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-2">
                <img
                  src={project.freelancerAvatar}
                  alt={project.freelancerName}
                  className="w-6 h-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span>Freelancer: <strong>{project.freelancerName}</strong> ({project.freelancerTitle})</span>
              </div>
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 lg:min-w-[280px]">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Total Contract Value</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                ${project.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-blue-600 font-medium">Locked in PayPal Escrow</span>
              <span className="font-mono font-extrabold text-blue-600 text-base tabular-nums">
                ${project.escrowBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Milestone Progress</span>
                <span className="font-mono font-semibold">{completedMilestones}/{project.milestones.length} ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 px-3 transition-colors relative ${
            activeTab === 'milestones'
              ? 'text-blue-600 font-bold border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Milestones & Deliverables ({project.milestones.length})
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 px-3 transition-colors relative ${
            activeTab === 'evidence'
              ? 'text-blue-600 font-bold border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Evidence Vault ({projectEvidences.length})
        </button>
        <button
          onClick={() => setActiveTab('proofgraph')}
          className={`pb-3 px-3 transition-colors relative ${
            activeTab === 'proofgraph'
              ? 'text-blue-600 font-bold border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ProofGraph AI Reports
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`pb-3 px-3 transition-colors relative ${
            activeTab === 'financials'
              ? 'text-blue-600 font-bold border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          PayPal Escrow Ledger ({projectTransactions.length})
        </button>
      </div>

      {/* TAB 1: Milestones Timeline */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {project.milestones.map((milestone, idx) => {
            const hasSubmittedEvidence =
              milestone.status === 'evidence_submitted' ||
              milestone.status === 'ai_verified' ||
              milestone.status === 'released';

            return (
              <Card key={milestone.id} className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Milestone Info */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Milestone {idx + 1}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">Due {milestone.dueDate}</span>
                      <span className="text-slate-300">·</span>
                      <Badge status={milestone.status} size="sm" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Criteria Tags */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {milestone.criteria.map(c => (
                        <div
                          key={c.id}
                          className="text-[11px] px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300"
                        >
                          <span className="font-mono text-slate-400 uppercase text-[10px] mr-1">
                            [{c.category}]
                          </span>
                          {c.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial & Context Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-6 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                        Milestone Value
                      </span>
                      <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                        ${milestone.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Escrow Fee: ${(milestone.amount * 0.025).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0 sm:min-w-[170px]">
                      {/* Scenario 1: Awaiting funding */}
                      {(milestone.status === 'pending_funding' || milestone.status === 'draft') && (
                        <Button
                          variant="paypal"
                          size="sm"
                          onClick={() => openPayPalFundingModal(project.id, milestone.id)}
                        >
                          Fund via PayPal Escrow
                        </Button>
                      )}

                      {/* Scenario 2: Funded -> Freelancer submits evidence */}
                      {milestone.status === 'funded' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            navigateTo('evidence-submission', {
                              projectId: project.id,
                              milestoneId: milestone.id,
                            })
                          }
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Submit Evidence
                        </Button>
                      )}

                      {/* Scenario 3: Evidence submitted -> Inspect or AI Verify */}
                      {milestone.status === 'evidence_submitted' && (
                        <div className="flex flex-col gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigateTo('proofgraph-report', {
                                reportId: milestone.proofGraphId || 'pg_01_2',
                              })
                            }
                            leftIcon={<ShieldCheck className="w-4 h-4 text-white" />}
                          >
                            Run ProofGraph AI
                          </Button>
                        </div>
                      )}

                      {/* Scenario 4: AI Verified -> Client can release */}
                      {milestone.status === 'ai_verified' && (
                        <div className="flex flex-col gap-1.5">
                          <Button
                            variant="paypal"
                            size="sm"
                            onClick={() => openPayPalReleaseModal(project.id, milestone.id)}
                          >
                            Release ${milestone.amount.toLocaleString()}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigateTo('proofgraph-report', {
                                reportId: milestone.proofGraphId || 'pg_01_2',
                              })
                            }
                          >
                            View Audit (96%)
                          </Button>
                        </div>
                      )}

                      {/* Scenario 5: Released */}
                      {milestone.status === 'released' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const txn = transactions.find(t => t.milestoneId === milestone.id);
                            if (txn) openReceiptModal(txn);
                          }}
                          leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        >
                          View Settlement Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: Evidence Vault */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          {projectEvidences.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No Evidence Submitted Yet
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once milestones are funded, the freelancer will submit repository commits, staging URLs, and test suites.
              </p>
            </Card>
          ) : (
            projectEvidences.map(ev => (
              <Card key={ev.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600">
                      Evidence Submission #{ev.id}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submitted by {ev.submittedBy} on {new Date(ev.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateTo('proofgraph-report', { reportId: 'pg_01_2' })}
                  >
                    Inspect in ProofGraph
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase">GitHub Repository & Commit</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">{ev.githubRepoUrl}</p>
                    <p className="text-blue-600">Commit: {ev.commitSha.substring(0, 16)}...</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase">Live Staging URL</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">{ev.stagingUrl}</p>
                    <p className="text-emerald-600">Status: 200 OK (84ms latency)</p>
                  </div>
                </div>

                {ev.notes && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                    <span className="font-semibold block mb-0.5 text-slate-800 dark:text-slate-100">Freelancer Notes:</span>
                    {ev.notes}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 3: ProofGraph Reports */}
      {activeTab === 'proofgraph' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ProofGraph™ AI Verification Audit Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Automated heuristics reports for completed and in-review deliverables.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigateTo('proofgraph-report', { reportId: 'pg_01_2' })}
            >
              Open Full Forensic View
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">REPORT_ID: pg_01_2</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">SYNTHESIS: 96/100 (VERIFIED)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              All cryptographic signature checks, test assertions, and live webhook endpoint probes exceeded acceptance thresholds with zero security anomalies.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Code Integrity</span>
                <span className="text-emerald-400 font-bold">98%</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Criteria Match</span>
                <span className="text-emerald-400 font-bold">95%</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Execution Health</span>
                <span className="text-emerald-400 font-bold">97%</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Test Pass Rate</span>
                <span className="text-emerald-400 font-bold">100%</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: Financials */}
      {activeTab === 'financials' && (
        <div className="space-y-4">
          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Milestone</th>
                  <th className="p-3.5">PayPal Order ID</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {projectTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-slate-500">{txn.invoiceNumber}</td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{txn.milestoneTitle}</td>
                    <td className="p-3.5 font-mono text-slate-500">{txn.paypalOrderId}</td>
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
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
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
      )}
    </div>
  );
};
