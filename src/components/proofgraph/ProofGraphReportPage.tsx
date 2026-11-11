import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Terminal,
  ExternalLink,
  Lock,
  ArrowRight,
  FileCheck2,
  Sparkles,
  Layers,
  ChevronDown,
  Clock,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProofGraphVisualizer } from './ProofGraphVisualizer';

export const ProofGraphReportPage: React.FC = () => {
  const {
    proofGraphReports,
    selectedReportId,
    projects,
    openPayPalReleaseModal,
    navigateTo,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'git' | 'endpoint' | 'tests'>('matrix');

  const report =
    proofGraphReports[selectedReportId] ||
    proofGraphReports['pg_01_2'] ||
    Object.values(proofGraphReports)[0];

  const project = projects.find(p => p.id === report?.projectId) || projects[0];
  const milestone = project?.milestones.find(m => m.id === report?.milestoneId) || project?.milestones[1];

  if (!report) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold">Verification Report Not Found</h2>
        <Button variant="primary" onClick={() => navigateTo('client-dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleRequestRevision = () => {
    showToast({
      type: 'info',
      title: 'Revision Request Dispatched',
      message: 'AI forensic annotations and feedback items sent to freelancer.',
    });
  };

  const handleDispute = () => {
    showToast({
      type: 'warning',
      title: 'Escrow Dispute Initiated',
      message: 'PayPal escrow funds frozen pending third-party arbitration.',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigateTo('client-dashboard')} className="hover:text-slate-800">
            Console
          </button>
          <span>/</span>
          <button
            onClick={() => navigateTo('project-details', { projectId: project.id })}
            className="hover:text-slate-800"
          >
            {project.title.substring(0, 24)}...
          </button>
          <span>/</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">
            ProofGraph #{report.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Audit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('project-details', { projectId: project.id })}
          >
            Contract Details
          </Button>
        </div>
      </div>

      {/* Main Executive Summary Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                AUDIT ENGINE V2.4
              </span>
              <span className="text-xs text-slate-400">
                Generated {new Date(report.generatedAt).toLocaleString()}
              </span>
              <Badge status={report.verdict} size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {milestone?.title || 'Milestone Deliverable'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {report.verdictReason}
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex items-center gap-6 shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Verification Score
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {report.overallScore}
                </span>
                <span className="text-sm font-semibold text-slate-400">/100</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Recommendation:
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                {report.recommendedAction === 'release_payment'
                  ? 'Auto-Release Authorized'
                  : 'Manual Audit Advised'}
              </p>
              <p className="text-[11px] text-slate-400">
                Escrow Value: ${milestone?.amount.toLocaleString()} USD
              </p>
            </div>
          </div>
        </div>

        {/* 4 Core Pillar Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Code Integrity
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums mt-1 block">
              {report.metrics.codeIntegrity}%
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
              GPG signatures valid
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Requirements Match
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums mt-1 block">
              {report.metrics.requirementsMatch}%
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
              All criteria satisfied
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Staging Health
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums mt-1 block">
              {report.metrics.executionHealth}%
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
              84ms latency (TLS 1.3)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Test Assertions
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums mt-1 block">
              {report.metrics.testPassRate}%
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
              64/64 passing
            </span>
          </div>
        </div>
      </div>

      {/* Visual Heuristics Tree */}
      <ProofGraphVisualizer
        nodes={report.nodes}
        edges={report.edges}
        overallScore={report.overallScore}
        verdict={report.verdict}
      />

      {/* Forensic Deep Dive Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-3 px-3 transition-colors ${
              activeTab === 'matrix'
                ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Acceptance Criteria Matrix ({report.checks.length})
          </button>
          <button
            onClick={() => setActiveTab('git')}
            className={`pb-3 px-3 transition-colors ${
              activeTab === 'git'
                ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Git Forensics & Commits
          </button>
          <button
            onClick={() => setActiveTab('endpoint')}
            className={`pb-3 px-3 transition-colors ${
              activeTab === 'endpoint'
                ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Synthetic Prober Logs
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 px-3 transition-colors ${
              activeTab === 'tests'
                ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Test Suite Assertions
          </button>
        </div>

        {/* TAB 1: Criteria Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-3">
            {report.checks.map(chk => (
              <Card key={chk.id} className="p-4 sm:p-5 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 uppercase text-slate-500">
                        {chk.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {chk.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {chk.summary}
                    </p>
                    <p className="text-xs text-slate-400 font-sans">
                      {chk.details}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold font-mono text-emerald-600 tabular-nums block">
                      {chk.score}/100
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ref: {chk.evidenceRef.substring(0, 18)}...
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 2: Git Forensics */}
        {activeTab === 'git' && (
          <Card className="p-6 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold font-sans text-slate-900 dark:text-white">
              Repository & Contributor Authenticity Log
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 text-[10px] block">COMMITS SCANNED</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{report.forensics.commitsAnalyzed}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">LINES MODIFIED</span>
                <span className="font-bold text-emerald-600">+{report.forensics.linesChanged.added} / -{report.forensics.linesChanged.deleted}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">GPG SIGNATURE</span>
                <span className="font-bold text-emerald-600">VERIFIED AUTHENTIC</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">ANOMALY DETECTOR</span>
                <span className="font-bold text-emerald-600">0 FLAGS</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Commit history shows organic iterative development. Authorship matches verified freelancer public key without artificial history squashing.
            </p>
          </Card>
        )}

        {/* TAB 3: Synthetic Prober */}
        {activeTab === 'endpoint' && (
          <Card className="p-6 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold font-sans text-slate-900 dark:text-white">
              Live Synthetic Prober Telemetry
            </h4>
            <div className="p-4 bg-slate-950 text-slate-200 rounded-xl space-y-2">
              <p className="text-emerald-400">&gt; PROBING TARGET: https://staging-billing.techcorp-preview.internal/webhooks/health</p>
              <p>&gt; TLS Handshake: TLS_AES_256_GCM_SHA384 (TLS 1.3)</p>
              <p>&gt; HTTP Response: 200 OK</p>
              <p>&gt; Roundtrip Latency: {report.forensics.stagingLatencyMs}ms (Acceptance threshold: &lt; 250ms)</p>
              <p>&gt; Security Headers: Strict-Transport-Security, X-Frame-Options: DENY, Idempotency-Key: enforced</p>
              <p className="text-emerald-400">&gt; Status: HEALTH CHECK PASSED</p>
            </div>
          </Card>
        )}

        {/* TAB 4: Test Suite */}
        {activeTab === 'tests' && (
          <Card className="p-6 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold font-sans text-slate-900 dark:text-white">
              Automated Test Assertions
            </h4>
            <div className="p-4 bg-slate-950 text-slate-200 rounded-xl space-y-1">
              <p className="text-emerald-400">PASS test/paypal.webhook.signature.spec.ts</p>
              <p>  ✓ verifies genuine PayPal SHA256withRSA certificate (12ms)</p>
              <p>  ✓ rejects forged or tampered webhook payload signatures (8ms)</p>
              <p>  ✓ protects against replay attacks with webhook event ID caching (15ms)</p>
              <p className="text-emerald-400">PASS test/queues/dlq.resilience.spec.ts</p>
              <p>  ✓ handles worker failover and moves poisoned messages to DLQ (120ms)</p>
              <p>  ✓ executes exponential backoff jitter schedule (42ms)</p>
              <p className="text-slate-400 pt-2 border-t border-slate-800">
                Tests: {report.forensics.testsPassed} passed, {report.forensics.testsTotal} total
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Client Action Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Escrow Authorization
          </p>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Ready to release ${milestone?.amount.toLocaleString()} USD to {project.freelancerName}?
          </h3>
          <p className="text-xs text-slate-500">
            Funds are currently held in PayPal Escrow (ID: PAYID-MK873210-9943).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleDispute} className="text-rose-600 hover:text-rose-700">
            Dispute Milestone
          </Button>
          <Button variant="outline" size="sm" onClick={handleRequestRevision}>
            Request Revision
          </Button>
          <Button
            variant="paypal"
            size="lg"
            onClick={() => openPayPalReleaseModal(project.id, milestone?.id || '')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Authorize PayPal Release (${milestone?.amount.toLocaleString()})
          </Button>
        </div>
      </div>
    </div>
  );
};
