'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from './use-toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        dismiss(toast.id);
      }, 4000)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, dismiss]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-lg',
            toast.variant === 'destructive' && 'border-red-500 bg-red-50'
          )}
        >
          <div>
            {toast.title ? <p className="text-sm font-semibold">{toast.title}</p> : null}
            {toast.description ? (
              <p className="text-sm text-slate-600">{toast.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="ml-auto text-slate-400 transition hover:text-slate-600"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
