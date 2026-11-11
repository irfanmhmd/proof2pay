import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
          error: <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
        };

        const bgBorders = {
          success: 'border-emerald-200 dark:border-emerald-800',
          warning: 'border-amber-200 dark:border-amber-800',
          error: 'border-rose-200 dark:border-rose-800',
          info: 'border-blue-200 dark:border-blue-800',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl bg-white dark:bg-slate-900 border ${bgBorders[toast.type]} shadow-lg flex items-start gap-3 transition-all duration-200`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
