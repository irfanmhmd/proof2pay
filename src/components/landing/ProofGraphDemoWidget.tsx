import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Play, RefreshCw, Lock, Sparkles, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProofGraphDemoWidget: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'standard' | 'perfect' | 'anomaly'>('perfect');
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const scenarios = {
    perfect: {
      name: 'High-Integrity Node.js API',
      repo: 'github.com/techcorp/auth-service',
      commit: '8f7a93c (Verified GPG)',
      staging: 'https://staging.techcorp.io (200 OK · 78ms)',
      tests: '64/64 Passing (94.2% Coverage)',
      score: 96,
      verdict: 'APPROVED',
      action: 'Auto-Release PayPal Milestone ($2,500.00)',
      status: 'pass',
    },
    standard: {
      name: 'Frontend UI Components',
      repo: 'github.com/techcorp/design-system',
      commit: '3e14b90 (Standard Git)',
      staging: 'https://storybook-preview.internal (200 OK)',
      tests: '28/30 Passing (88.5% Coverage)',
      score: 84,
      verdict: 'REVIEW_REQUIRED',
      action: 'Client Review Required Before Payout',
      status: 'warning',
    },
    anomaly: {
      name: 'Discrepant PR (Unverified Commits)',
      repo: 'github.com/techcorp/legacy-sync',
      commit: '0c72f1a (Unsigned · Divergent SHA)',
      staging: 'https://broken-preview.internal (502 Bad Gateway)',
      tests: '12/40 Passing (35% Coverage)',
      score: 41,
      verdict: 'FLAGGED_DISCREPANCY',
      action: 'Escrow Frozen · Revision Requested',
      status: 'fail',
    },
  };

  const current = scenarios[activeScenario];

  const handleSimulate = (scenarioKey: 'standard' | 'perfect' | 'anomaly') => {
    setActiveScenario(scenarioKey);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Interactive Sandbox
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Test the ProofGraph™ Verification Engine
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {(['perfect', 'standard', 'anomaly'] as const).map(key => (
            <button
              key={key}
              onClick={() => handleSimulate(key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeScenario === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {key === 'perfect' ? 'Verified (96%)' : key === 'standard' ? 'Review (84%)' : 'Anomaly (41%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Submitted Artifacts */}
        <div className="lg:col-span-7 space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-slate-500">Repository</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[240px]">
              {current.repo}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-slate-500">Git Commit Forensics</span>
            <span className={`font-semibold ${current.status === 'fail' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {current.commit}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-slate-500">Live Endpoint Prober</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[240px]">
              {current.staging}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-slate-500">Test Assertion Suite</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {current.tests}
            </span>
          </div>
        </div>

        {/* Right: Heuristics Evaluation & Score Verdict */}
        <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center flex flex-col items-center justify-center">
          {isSimulating ? (
            <div className="py-8 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Running AST parsers & synthetic probers...
              </p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  ProofGraph Verification Score
                </span>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-extrabold font-mono tabular-nums ${
                    current.status === 'pass'
                      ? 'text-emerald-600'
                      : current.status === 'warning'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {current.score}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-block">
                {current.status === 'pass' && (
                  <span className="text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded">
                    ✓ Verified: {current.verdict}
                  </span>
                )}
                {current.status === 'warning' && (
                  <span className="text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-3 py-1 rounded">
                    ⚠ Manual Review: {current.verdict}
                  </span>
                )}
                {current.status === 'fail' && (
                  <span className="text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 px-3 py-1 rounded">
                    ✕ Escrow Frozen: {current.verdict}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {current.action}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Protected by PayPal Milestone Escrow</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
