'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'orange' | 'green' | 'violet' | 'outline-sage';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  iconLeft?: any;
  rightIcon?: React.ReactNode;
  iconRight?: any;
  href?: string;
  fullWidth?: boolean;
  as?: any;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      leftIcon,
      iconLeft: IconLeftComponent,
      rightIcon,
      iconRight: IconRightComponent,
      href,
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isSpinner = isLoading || loading;

    // Paw Traces signature retro-pop button style
    const baseStyles =
      'inline-flex items-center justify-center font-display font-bold select-none cursor-pointer rounded-full transition-all duration-120 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants: Record<ButtonVariant, string> = {
      // Primary: Paw Traces Tangerine with #241F4E border and 0 6px 0 pop shadow
      primary:
        'bg-[#FF8A3D] text-white border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#241F4E] active:translate-y-1 active:shadow-[0_2px_0_#241F4E]',
      orange:
        'bg-[#FF8A3D] text-white border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#241F4E] active:translate-y-1 active:shadow-[0_2px_0_#241F4E]',
      green:
        'bg-[#4FCB77] text-[#241F4E] border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#241F4E] active:translate-y-1 active:shadow-[0_2px_0_#241F4E]',
      violet:
        'bg-[#8B6BFF] text-white border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#241F4E] active:translate-y-1 active:shadow-[0_2px_0_#241F4E]',
      secondary:
        'bg-[#FFF7E8] text-[#241F4E] border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#241F4E] active:translate-y-1 active:shadow-[0_2px_0_#241F4E]',
      ghost:
        'bg-transparent text-[#241F4E] hover:bg-[#FFF7E8] border-[3px] border-transparent hover:border-[#DFDFDF]',
      'outline-sage':
        'bg-white text-[#241F4E] border-[3px] border-[#DFDFDF] hover:border-[#241F4E] shadow-[0_4px_0_#DFDFDF]',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-[13px] px-4 py-1.5 gap-1.5 h-9',
      md: 'text-[15px] px-6 py-2.5 gap-2 h-11',
      lg: 'text-[17px] px-8 py-3.5 gap-2.5 h-13',
    };

    const combinedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {isSpinner && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isSpinner && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {!isSpinner && !leftIcon && IconLeftComponent && (
          <IconLeftComponent className="w-4 h-4 shrink-0" />
        )}
        <span>{children}</span>
        {!isSpinner && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        {!isSpinner && !rightIcon && IconRightComponent && (
          <IconRightComponent className="w-4 h-4 shrink-0" />
        )}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isSpinner}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
