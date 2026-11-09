'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      helperText,
      error,
      fullWidth = false,
      className,
      id: idProp,
      rows = 4,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const hasError = Boolean(error);

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

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={hasError || undefined}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={cn(
            'w-full rounded-lg border bg-offwhite px-4 py-2.5',
            'text-sm font-body text-text-primary placeholder:text-text-tertiary',
            'transition-colors duration-200 resize-y min-h-[80px]',
            'focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest',
            hasError
              ? 'border-status-error focus:ring-status-error/30'
              : 'border-border hover:border-sage',
            className,
          )}
          {...rest}
        />

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

Textarea.displayName = 'Textarea';
