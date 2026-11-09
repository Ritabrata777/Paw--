'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DropdownItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  /** Destructive action — renders in red */
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownDivider {
  key: string;
  divider: true;
}

export type DropdownEntry = DropdownItem | DropdownDivider;

export interface DropdownProps {
  /** The trigger element (usually a button) */
  trigger: React.ReactNode;
  items: DropdownEntry[];
  /** Alignment relative to trigger */
  align?: 'left' | 'right';
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isDivider(entry: DropdownEntry): entry is DropdownDivider {
  return 'divider' in entry && entry.divider === true;
}

const menuVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Dropdown({
  trigger,
  items,
  align = 'right',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  const handleOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  /* Close on Escape */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, handleOutside, handleKey]);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute z-50 mt-2 min-w-[180px] rounded-lg',
              'border border-border-light bg-offwhite shadow-lg',
              'py-1.5 overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            {items.map((entry) => {
              if (isDivider(entry)) {
                return (
                  <div
                    key={entry.key}
                    className="my-1.5 border-t border-border-light"
                    role="separator"
                  />
                );
              }

              const Icon = entry.icon;
              return (
                <button
                  key={entry.key}
                  disabled={entry.disabled}
                  onClick={() => {
                    entry.onClick?.();
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3.5 py-2 text-sm font-body',
                    'transition-colors duration-150 text-left',
                    entry.danger
                      ? 'text-status-error hover:bg-status-error/5'
                      : 'text-text-primary hover:bg-cream',
                    entry.disabled && 'opacity-40 pointer-events-none',
                  )}
                >
                  {Icon && <Icon size={15} className="shrink-0" aria-hidden />}
                  {entry.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
