'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextValue {
  toast: (params: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within <NotificationProvider>');
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Style maps                                                         */
/* ------------------------------------------------------------------ */

const iconMap: Record<NotificationType, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap: Record<NotificationType, string> = {
  success: 'border-status-online/30 bg-status-online/5',
  error:   'border-status-error/30 bg-status-error/5',
  info:    'border-forest/30 bg-forest/5',
  warning: 'border-status-stale/30 bg-status-stale/5',
};

const iconColorMap: Record<NotificationType, string> = {
  success: 'text-status-online',
  error:   'text-status-error',
  info:    'text-forest',
  warning: 'text-status-stale',
};

/* ------------------------------------------------------------------ */
/*  Single Toast                                                       */
/* ------------------------------------------------------------------ */

function Toast({
  data,
  onDismiss,
}: {
  data: ToastData;
  onDismiss: (id: string) => void;
}) {
  const Icon = iconMap[data.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-lg border',
        'px-4 py-3.5 shadow-lg backdrop-blur-md',
        'w-full max-w-sm',
        styleMap[data.type],
      )}
      role="alert"
    >
      <Icon size={18} className={cn('mt-0.5 shrink-0', iconColorMap[data.type])} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary font-body">
          {data.title}
        </p>
        {data.message && (
          <p className="mt-0.5 text-xs text-text-secondary font-body leading-relaxed">
            {data.message}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(data.id)}
        className="shrink-0 rounded p-0.5 text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (params: Omit<ToastData, 'id'>) => {
      const id = `toast-${++counterRef.current}`;
      const duration = params.duration ?? 5000;

      setToasts((prev) => [...prev, { ...params, id }]);

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  return (
    <NotificationContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2.5 pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} data={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
