import { type LucideIcon, PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './Button';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EmptyStateProps {
  /** Lucide icon component */
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Render an action button */
  action?: {
    label: string;
  } & Omit<ButtonProps, 'children'>;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 px-6',
        className,
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream">
        <Icon size={28} className="text-sage" strokeWidth={1.5} />
      </div>

      <h4 className="font-display text-lg text-text-primary">{title}</h4>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary font-body leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {(() => {
            const { label, ...buttonProps } = action;
            return (
              <Button variant="secondary" size="sm" {...buttonProps}>
                {label}
              </Button>
            );
          })()}
        </div>
      )}
    </div>
  );
}
