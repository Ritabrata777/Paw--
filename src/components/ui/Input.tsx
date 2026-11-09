'use client';

import { forwardRef, useId } from 'react';
import { Search, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label above the input */
  label?: string;
  /** Subtle helper text below the input */
  helperText?: string;
  /** Error message — also applies error styling */
  error?: string;
  /** Renders a Search icon inside the input */
  variant?: 'default' | 'search';
  /** Optional icon on the left (overridden by search variant) */
  iconLeft?: LucideIcon;
  /** Full-width toggle */
  fullWidth?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      helperText,
      error,
      variant = 'default',
      iconLeft: IconLeft,
      fullWidth = false,
      className,
      id: idProp,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const hasError = Boolean(error);
    const isSearch = variant === 'search';
    const LeadIcon = isSearch ? Search : IconLeft;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-primary font-body"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {LeadIcon && (
            <LeadIcon
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              aria-hidden
            />
          )}

          <input
            ref={ref}
            id={id}
            aria-invalid={hasError || undefined}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={cn(
              'w-full rounded-lg border bg-offwhite px-4 py-2.5',
              'text-sm font-body text-text-primary placeholder:text-text-tertiary',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest',
              hasError
                ? 'border-status-error focus:ring-status-error/30'
                : 'border-border hover:border-sage',
              LeadIcon && 'pl-10',
              className,
            )}
            {...rest}
          />
        </div>

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-status-error font-body"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${id}-helper`}
            className="text-xs text-text-tertiary font-body"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
