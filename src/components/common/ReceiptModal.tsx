import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, Printer, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, closeReceiptModal, showToast } = useApp();

  if (!selectedReceipt) return null;

  const handleDownload = () => {
    showToast({
      type: 'success',
      title: 'Invoice Downloaded',
      message: `Saved ${selectedReceipt.invoiceNumber}.pdf to your device.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Proof2Pay Escrow Receipt
            </span>
          </div>
          <button
            onClick={closeReceiptModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice printable content */}
        <div className="p-6 md:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {/* Top Branding & Invoice Meta */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Proof<span className="text-blue-600">2</span>Pay
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated AI Milestone Verification</p>
              <p className="text-xs text-slate-500 font-mono mt-2">
                Invoice: {selectedReceipt.invoiceNumber}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                selectedReceipt.status === 'released'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedReceipt.status === 'released' ? 'Settled & Paid' : 'Held in Escrow'}
              </span>
              <p className="text-xs text-slate-400 font-mono mt-2">
                Date: {new Date(selectedReceipt.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-wider font-semibold">Payer / Client</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{selectedReceipt.payerName}</p>
              <p className="text-slate-500 font-mono">{selectedReceipt.payerEmail}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase tracking-wider font-semibold">Payee / Freelancer</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{selectedReceipt.payeeName}</p>
              <p className="text-slate-500 font-mono">{selectedReceipt.payeeEmail}</p>
            </div>
          </div>

          {/* Project & Milestone */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 font-semibold text-xs text-slate-600 dark:text-slate-300">
              Milestone Deliverable
            </div>
            <div className="p-4 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedReceipt.milestoneTitle}
              </p>
              <p className="text-xs text-slate-500">
                Project: {selectedReceipt.projectName}
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Gross Milestone Budget</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                ${selectedReceipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Proof2Pay Escrow Platform Fee (2.5%)</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                -${selectedReceipt.platformFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Net Settled Amount</span>
              <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400">
                ${selectedReceipt.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* PayPal Settlement IDs */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60 font-mono text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>PayPal Order Reference:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedReceipt.paypalOrderId}</span>
            </div>
            {selectedReceipt.paypalCaptureId && (
              <div className="flex justify-between">
                <span>PayPal Capture Reference:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedReceipt.paypalCaptureId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <Button variant="ghost" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={closeReceiptModal}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
