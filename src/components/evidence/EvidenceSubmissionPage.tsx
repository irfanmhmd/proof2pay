import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  GitBranch,
  Terminal,
  ExternalLink,
  Video,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const EvidenceSubmissionPage: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    selectedMilestoneId,
    submitEvidence,
    runProofGraphAnalysis,
    navigateTo,
    currentUser,
  } = useApp();

  const [activeProjectId, setActiveProjectId] = useState(selectedProjectId || projects[0]?.id || 'proj_01');
  const project = projects.find(p => p.id === activeProjectId) || projects[0];

  const eligibleMilestones = project?.milestones.filter(
    m => m.status === 'funded' || m.status === 'evidence_submitted' || m.status === 'ai_verified'
  ) || [];

  const [activeMilestoneId, setActiveMilestoneId] = useState(
    selectedMilestoneId || eligibleMilestones[0]?.id || project?.milestones[0]?.id || ''
  );
  const milestone = project?.milestones.find(m => m.id === activeMilestoneId);

  // Form Fields
  const [repoUrl, setRepoUrl] = useState('https://github.com/techcorp-ventures/billing-service');
  const [commitSha, setCommitSha] = useState('8f7a93c4e12d5b6a78c90123ef4567890abcdef1');
  const [branchName, setBranchName] = useState('feature/paypal-webhook-pipeline');
  const [stagingUrl, setStagingUrl] = useState('https://staging-billing.techcorp-preview.internal/webhooks/health');
  const [videoUrl, setVideoUrl] = useState('https://loom.com/share/demo-paypal-ipn-proof2pay-verification');
  const [testOutput, setTestOutput] = useState(
    `PASS test/paypal.webhook.signature.spec.ts\n  ✓ verifies genuine PayPal SHA256withRSA certificate (12ms)\n  ✓ rejects forged or tampered webhook payload signatures (8ms)\nPASS test/queues/dlq.resilience.spec.ts\n  ✓ handles worker failover and moves poisoned messages to DLQ (120ms)\n\nTest Suites: 8 passed, 8 total\nTests: 64 passed, 64 total\nCoverage: 94.2% statements`
  );
  const [notes, setNotes] = useState(
    'Implemented the PayPal Webhook listener with public certificate validation, Redis BullMQ queues, and automated DLQ alerting. Live health check endpoint is ready for automated probing.'
  );

  // Pre-flight scan state
  const [isPreflightRunning, setIsPreflightRunning] = useState(false);
  const [preflightResult, setPreflightResult] = useState<{
    score: number;
    gitValid: boolean;
    endpointStatus: number;
    testsPassing: boolean;
  } | null>(null);

  const handleRunPreflight = () => {
    setIsPreflightRunning(true);
    setTimeout(() => {
      setIsPreflightRunning(false);
      setPreflightResult({
        score: 96,
        gitValid: true,
        endpointStatus: 200,
        testsPassing: true,
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestone) return;

    submitEvidence({
      milestoneId: milestone.id,
      projectId: project.id,
      submittedBy: currentUser.name,
      githubRepoUrl: repoUrl,
      commitSha,
      branchName,
      stagingUrl,
      videoDemoUrl: videoUrl,
      testSuiteOutput: testOutput,
      notes,
    });

    // Provide immediate option to run ProofGraph
    runProofGraphAnalysis(milestone.id).then(() => {
      navigateTo('proofgraph-report', { reportId: `pg_${milestone.id}` });
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Deliverable Evidence Submission
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit verifiable repositories, commits, and endpoints for ProofGraph™ automated audit.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigateTo('freelancer-dashboard')}>
          Back to Hub
        </Button>
      </div>

      {/* Contract & Milestone Selector Strip */}
      <Card className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Active Project Contract
            </label>
            <select
              value={activeProjectId}
              onChange={e => {
                setActiveProjectId(e.target.value);
                const nextProj = projects.find(p => p.id === e.target.value);
                if (nextProj && nextProj.milestones[0]) {
                  setActiveMilestoneId(nextProj.milestones[0].id);
                }
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} (${p.totalBudget.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Target Milestone
            </label>
            <select
              value={activeMilestoneId}
              onChange={e => setActiveMilestoneId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {project?.milestones.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title} (${m.amount.toLocaleString()} - {m.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {milestone && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Escrow Value: ${milestone.amount.toLocaleString()} USD
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">Due: {milestone.dueDate}</span>
            </div>
            <div className="flex gap-1.5">
              {milestone.criteria.map(c => (
                <span key={c.id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {c.category}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Main Evidence Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            {/* 1. Git Repository & Commit */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                  GitHub Repository URL & Branch
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Public or Deploy-Key Authorized</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="sm:col-span-2 px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  placeholder="branch (e.g. main)"
                  className="px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 2. Commit SHA */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Commit SHA-1 Hash
              </label>
              <input
                type="text"
                required
                value={commitSha}
                onChange={e => setCommitSha(e.target.value)}
                placeholder="40-character SHA hash"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                ProofGraph verifies cryptographic GPG signatures and commit continuity to prevent plagiarism.
              </p>
            </div>

            {/* 3. Live Staging Endpoint */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  Live Staging / Preview Endpoint
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Synthetically Probed</span>
              </div>
              <input
                type="url"
                required
                value={stagingUrl}
                onChange={e => setStagingUrl(e.target.value)}
                placeholder="https://staging.app.io/api/health"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 4. Video Walkthrough */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                <Video className="w-3.5 h-3.5 text-indigo-600" />
                Video Demo Walkthrough URL (Loom / YouTube / MP4)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://loom.com/share/..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 5. Test Suite Logs */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-600" />
                Automated Test Execution Output & Code Coverage
              </label>
              <textarea
                rows={4}
                value={testOutput}
                onChange={e => setTestOutput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 6. Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Release Notes & Implementation Summary
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Key architecture decisions, migration commands, or credentials for client review..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pre-flight Heuristics Check Drawer */}
          {preflightResult && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pre-flight AI Heuristics Validated (Score: {preflightResult.score}/100)
                </span>
                <span className="font-mono">Ready for Client Audit</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                <div>✓ Git Tree & GPG Verified</div>
                <div>✓ HTTP 200 OK Response (84ms)</div>
                <div>✓ 64/64 Unit Tests Passing</div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleRunPreflight}
              isLoading={isPreflightRunning}
              leftIcon={<Sparkles className="w-4 h-4 text-blue-600" />}
            >
              Run ProofGraph Pre-flight Scan
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit Evidence & Trigger ProofGraph
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
