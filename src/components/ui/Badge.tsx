import React from 'react';
import { MilestoneStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, ArrowUpRight, Lock, FileCode } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  status?: MilestoneStatus | 'approved' | 'review_required' | 'flagged';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  status,
  className = '',
  size = 'md',
}) => {
  // If status is provided, auto-map icon and style
  if (status) {
    switch (status) {
      case 'released':
      case 'approved':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{children || (status === 'released' ? 'Funds Released' : 'Approved')}</span>
          </span>
        );
      case 'funded':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{children || 'Funded in Escrow'}</span>
          </span>
        );
      case 'ai_verified':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{children || 'ProofGraph Verified'}</span>
          </span>
        );
      case 'evidence_submitted':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <FileCode className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{children || 'Evidence In Review'}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{children || 'In Progress'}</span>
          </span>
        );
      case 'review_required':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{children || 'Review Required'}</span>
          </span>
        );
      case 'disputed':
      case 'flagged':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{children || (status === 'disputed' ? 'Disputed' : 'Flagged')}</span>
          </span>
        );
      case 'pending_funding':
      case 'draft':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{children || (status === 'draft' ? 'Draft' : 'Awaiting Funding')}</span>
          </span>
        );
    }
  }

  const styles = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    error: 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    info: 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    purple: 'bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md ${styles[variant]} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}>
      {children}
    </span>
  );
};
