'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  /** Footer actions (buttons, etc.) */
  actions?: React.ReactNode;
  /** Max-width class — default is max-w-lg */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Hide the close (×) button */
  hideClose?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const sizeMap: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.15 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'lg',
  hideClose = false,
  className,
}: DialogProps) {
  /* --- Escape key --- */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, handleKey]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-forest-deep/40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative z-10 w-full rounded-xl bg-offwhite',
              'border border-border-light shadow-xl',
              'p-6 sm:p-8',
              sizeMap[size],
              className,
            )}
          >
            {/* Close button */}
            {!hideClose && (
              <button
                onClick={onClose}
                className={cn(
                  'absolute right-4 top-4 rounded-md p-1.5',
                  'text-text-tertiary hover:text-text-primary',
                  'transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-forest',
                )}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}

            {/* Header */}
            {(title || description) && (
              <div className="mb-6 pr-8">
                {title && (
                  <h3 className="font-display text-xl text-text-primary">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1.5 text-sm text-text-secondary font-body leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Body */}
            <div>{children}</div>

            {/* Actions */}
            {actions && (
              <div className="mt-6 flex items-center justify-end gap-3">
                {actions}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
