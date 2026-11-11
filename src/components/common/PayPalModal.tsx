import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldCheck, X, Check, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { Button } from '../ui/Button';

export const PayPalModal: React.FC = () => {
  const { payPalModal, closePayPalModal, fundMilestone, releaseMilestoneFunds } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');

  if (!payPalModal.isOpen) return null;

  const isFunding = payPalModal.type === 'fund';
  const amount = payPalModal.amount;
  const platformFee = Number((amount * 0.025).toFixed(2));
  const totalCharge = isFunding ? amount + platformFee : amount;
  const netFreelancerPayout = amount - platformFee;

  const handleConfirm = () => {
    setIsProcessing(true);
    setStep('processing');

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      setTimeout(() => {
        if (isFunding) {
          const generatedOrderId = `PAYID-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
          fundMilestone(payPalModal.projectId, payPalModal.milestoneId, generatedOrderId);
        } else {
          releaseMilestoneFunds(payPalModal.projectId, payPalModal.milestoneId);
        }
        setStep('review');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black italic tracking-tighter">
              <span className="text-[#003087]">Pay</span>
              <span className="text-[#0079C1]">Pal</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase tracking-wider">
              Escrow Gateway
            </span>
          </div>
          <button
            onClick={closePayPalModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#003087] border-t-transparent animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {isFunding ? 'Securing Escrow Vault with PayPal...' : 'Authorizing PayPal Payout Transfer...'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Validating cryptographic milestone state and generating PayPal settlement receipts.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {isFunding ? 'Escrow Deposit Confirmed' : 'Payment Released via PayPal'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Transaction recorded to the immutable ledger. Updating dashboard.
              </p>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {isFunding ? 'Funding Milestone Escrow' : 'Release Milestone Payout'}
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {payPalModal.milestoneTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Project: {payPalModal.projectTitle}
                </p>
              </div>

              {/* Amount Breakdown Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-sm">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Milestone Value</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-xs">
                  <span className="flex items-center gap-1">
                    Proof2Pay Escrow Protection Fee (2.5%)
                    <Info className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className="font-mono tabular-nums">
                    ${platformFee.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold">
                  <span className="text-slate-900 dark:text-slate-100">
                    {isFunding ? 'Total PayPal Escrow Hold' : 'Net Freelancer Transfer'}
                  </span>
                  <span className="text-lg text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                    ${(isFunding ? totalCharge : netFreelancerPayout).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Escrow Guarantee Notice */}
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">PayPal Buyer & Seller Protection Active</p>
                  <p className="text-blue-700 dark:text-blue-300 mt-0.5 leading-relaxed">
                    {isFunding
                      ? 'Funds are held securely by PayPal Escrow. They will not be disbursed until ProofGraph AI verifies the deliverables or you manually authorize release.'
                      : 'Funds will be immediately credited to the freelancer’s verified PayPal wallet. A printable invoice is automatically generated.'}
                  </p>
                </div>
              </div>

              {/* Connected Account Preview */}
              <div className="flex items-center justify-between text-xs text-slate-500 py-1">
                <span>PayPal Account:</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {isFunding ? 'billing@techcorp.io' : 'alex.payouts@cheneng.io'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={closePayPalModal}>
                  Cancel
                </Button>
                <Button
                  variant="paypal"
                  size="lg"
                  onClick={handleConfirm}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isFunding ? 'Authorize PayPal Escrow' : 'Release PayPal Funds'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
