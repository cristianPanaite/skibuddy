import * as React from 'react';

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

const ToastContext = React.createContext<{
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const { toasts, setToasts } = context;

  const toast = React.useCallback((options: Omit<Toast, 'id'>) => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...options }]);
  }, [setToasts]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, [setToasts]);

  return { toasts, toast, dismiss };
}
