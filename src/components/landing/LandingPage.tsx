import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  GitBranch,
  Terminal,
  Layers,
  FileCheck2,
  Sparkles,
  Users,
  ChevronRight,
  DollarSign,
  Scale,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ProofGraphDemoWidget } from './ProofGraphDemoWidget';

export const LandingPage: React.FC = () => {
  const { navigateTo, switchRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Clean kicker text (no pill enclosure) */}
            <p className="text-xs md:text-sm font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              Smart Escrow & Milestone Verification Engine
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
              Milestone Escrow Powered by AI Evidence Verification & PayPal
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Clients lock funds into PayPal escrow. Freelancers deliver verified commits, endpoints, and test reports. ProofGraph™ AI audits deliverables and triggers instant payout releases.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  switchRole('client');
                  navigateTo('client-dashboard');
                }}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Explore Client Console
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  switchRole('freelancer');
                  navigateTo('freelancer-dashboard');
                }}
              >
                Freelancer View
              </Button>
            </div>

            {/* Quick Trust Markers */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                PayPal Verified Partner Escrow
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                ProofGraph Forensic AI Audits
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-600" />
                92% Dispute Reduction
              </span>
            </div>
          </div>

          {/* Interactive Sandbox Showcase */}
          <div className="mt-16 max-w-5xl mx-auto">
            <ProofGraphDemoWidget />
          </div>
        </div>
      </section>

      {/* 4-Step Verification Workflow */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              How Proof2Pay Guarantees Zero-Friction Payouts
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              From contract milestones to automated PayPal release in 4 tamper-proof steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                01. Lock Escrow
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Fund via PayPal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Client creates milestones with measurable criteria and deposits funds into PayPal’s secure escrow vault.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                02. Deliver Work
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Submit Evidence
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Freelancer links GitHub repos, commit SHAs, test run logs, video walkthroughs, and live staging URLs.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                03. ProofGraph AI
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Multi-Layer Verification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ProofGraph parses AST code trees, tests coverage, validates GPG signatures, and probes live staging endpoints.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                04. Instant Payout
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Automated Release
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                High-confidence verification score (≥ 85%) authorizes instant release of funds to freelancer’s PayPal wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ProofGraph Engine Deep Dive */}
      <section id="proofgraph" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Proprietary AI Heuristics
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ProofGraph™ replaces subjective reviews with objective technical proof.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Clients shouldn’t have to manually inspect 2,000 lines of git diffs or run local terminal commands to verify if a deliverable works. ProofGraph AI performs deep automated forensics:
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <GitBranch className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Commit Forensics & GPG Authorship
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Audits commit cadence, line diff velocity, branch integrity, and verifies cryptographic contributor signatures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Automated Synthetic Endpoint Probing
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sends synthetic health pings to staging URLs, testing SSL validity, response latencies, and idempotency headers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Acceptance Criteria Matrix Matcher
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Evaluates the codebase AST against the initial milestone specifications to verify functional completeness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigateTo('proofgraph-report', { reportId: 'pg_01_2' })}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View Sample Verification Report
                </Button>
              </div>
            </div>

            {/* Inspection Card Graphic */}
            <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">PROOFGRAPH_SYNTHESIS_V2</span>
                <span className="text-emerald-400 font-bold">STATUS: CONFIRMED (96%)</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <p className="text-slate-400">&gt; Scanning GitHub commits: 18 commits analyzed</p>
                <p className="text-slate-400">&gt; Verifying GPG Signature: Valid [Alex Chen &lt;alex@cheneng.io&gt;]</p>
                <p className="text-slate-400">&gt; Probing staging endpoint: HTTP 200 OK (84ms latency)</p>
                <p className="text-slate-400">&gt; Test suite execution: 64/64 passed (94.2% statement coverage)</p>
                <p className="text-emerald-400 font-semibold">&gt; Verification verdict: APPROVED FOR PAYPAL DISBURSEMENT</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">PAYPAL ESCROW ID</span>
                  <span className="text-slate-200">PAYID-MK873210-9943</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">DISBURSEMENT VALUE</span>
                  <span className="text-blue-400 font-bold text-sm">$2,500.00 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs Proof2Pay */}
      <section id="comparison" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Proof2Pay vs. Traditional Freelance Platforms
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Fair, transparent escrow built for modern software and technical contracts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="p-4 sm:p-5 font-semibold">Contract Dimension</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-400">Legacy Escrow (Upwork/Fiverr)</th>
                  <th className="p-4 sm:p-5 font-bold text-blue-600 dark:text-blue-400">Proof2Pay Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-medium">Deliverable Verification</td>
                  <td className="p-4 sm:p-5 text-slate-500">Manual non-technical client reviews (or 14-day silence auto-release)</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-100">
                    Automated ProofGraph AI code & endpoint verification
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium">Payment Infrastructure</td>
                  <td className="p-4 sm:p-5 text-slate-500">Proprietary ledger holding funds up to 5-10 business days</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-100">
                    Direct PayPal Escrow with instant wallet release
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium">Platform Take Rate</td>
                  <td className="p-4 sm:p-5 text-slate-500">10% - 20% commission on every milestone</td>
                  <td className="p-4 sm:p-5 font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    2.5% Flat Escrow Protection Fee
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium">Dispute Resolution</td>
                  <td className="p-4 sm:p-5 text-slate-500">Weeks of bureaucratic support tickets and arbitrary judgment</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-100">
                    Objective cryptographic audit trail & commit timelines
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to upgrade your client-freelancer escrow?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Experience how ProofGraph verification and PayPal escrow eliminate milestone anxieties.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                switchRole('client');
                navigateTo('create-project');
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create New Contract
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateTo('payment-history')}
            >
              View Escrow Ledger
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
