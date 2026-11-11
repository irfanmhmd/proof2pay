import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  Download,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Printer,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TransactionStatus } from '../../types';

export const PaymentHistoryPage: React.FC = () => {
  const { transactions, openReceiptModal, currentUser, projects } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.milestoneTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.payeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.paypalOrderId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalInEscrow = transactions
    .filter(t => t.status === 'in_escrow')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReleased = transactions
    .filter(t => t.status === 'released')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = transactions.reduce((sum, t) => sum + t.platformFee, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            PayPal Escrow & Settlement Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete audit trail of funded milestones, platform fee deductions, and PayPal disbursements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Export Ledger
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active PayPal Escrow
            </span>
            <Lock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums mt-2">
            ${totalInEscrow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-1">Held securely awaiting proof</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Released Payouts
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-2">
            ${totalReleased.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-1">Disbursed to verified wallets</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Proof2Pay Escrow Fees (2.5%)
            </span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-2">
            ${totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-1">Includes AI verification & guarantees</p>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, milestone, payee, or PayPal ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
          {(['all', 'in_escrow', 'released'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === tab
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'all' ? 'All Transactions' : tab === 'in_escrow' ? 'In Escrow' : 'Released'}
            </button>
          ))}
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Milestone Deliverable</th>
              <th className="p-4">Payer / Payee</th>
              <th className="p-4 text-right">Gross (USD)</th>
              <th className="p-4 text-right">Fee (2.5%)</th>
              <th className="p-4 text-right">Net Settlement</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  No transactions match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-slate-500 tabular-nums">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {txn.invoiceNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{txn.milestoneTitle}</p>
                    <p className="text-[11px] text-slate-400">{txn.projectName}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{txn.payeeName}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">{txn.payeeEmail}</p>
                  </td>
                  <td className="p-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100 font-semibold">
                    ${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-right font-mono tabular-nums text-slate-400">
                    -${txn.platformFee.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                    ${txn.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <Badge status={txn.status === 'released' ? 'released' : 'funded'}>
                      {txn.status === 'released' ? 'Settled' : 'In Escrow'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openReceiptModal(txn)}
                      className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-semibold underline"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
