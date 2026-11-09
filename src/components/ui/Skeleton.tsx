import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Base Skeleton                                                      */
/* ------------------------------------------------------------------ */

export interface SkeletonBaseProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonBaseProps) {
  return (
    <div
      className={cn('skeleton rounded', className)}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SkeletonText                                                       */
/* ------------------------------------------------------------------ */

export interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Width of the last line (Tailwind class) */
  lastLineWidth?: string;
  className?: string;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = 'w-3/5',
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton h-3.5 rounded',
            i === lines - 1 ? lastLineWidth : 'w-full',
          )}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SkeletonImage                                                      */
/* ------------------------------------------------------------------ */

export interface SkeletonImageProps {
  /** Tailwind aspect-ratio class, e.g. aspect-video, aspect-square */
  aspectRatio?: string;
  className?: string;
}

export function SkeletonImage({
  aspectRatio = 'aspect-[4/3]',
  className,
}: SkeletonImageProps) {
  return (
    <div
      className={cn('skeleton w-full rounded-lg', aspectRatio, className)}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SkeletonCard                                                       */
/* ------------------------------------------------------------------ */

export interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-light bg-offwhite p-5',
        className,
      )}
      aria-hidden="true"
    >
      <SkeletonImage />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AnimalCardSkeleton                                                 */
/* ------------------------------------------------------------------ */

export interface AnimalCardSkeletonProps {
  className?: string;
}

export function AnimalCardSkeleton({ className }: AnimalCardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-light bg-offwhite overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <SkeletonImage aspectRatio="aspect-[4/3]" className="rounded-none" />

      <div className="p-4 space-y-3">
        {/* ID + Species badges */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Name */}
        <Skeleton className="h-5 w-3/4" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2" />

        {/* Status row */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
    </div>
  );
}
