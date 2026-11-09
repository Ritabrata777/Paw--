import React from 'react';
import { cn } from '@/lib/utils';
import { TrackingStatus, SightingStatus, AnimalSpecies } from '@/types';

export interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function TrackingBadge({
  status,
  size = 'md',
  className,
}: {
  status: TrackingStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const configs: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
    recently_updated: {
      label: 'Live Fix',
      bg: 'bg-[#4FCB77]/20',
      text: 'text-[#241F4E]',
      dot: 'bg-[#4FCB77]',
      border: 'border-[#4FCB77]/60',
    },
    last_reported: {
      label: 'Stale Signal',
      bg: 'bg-[#FFC93C]/25',
      text: 'text-[#241F4E]',
      dot: 'bg-[#FFC93C]',
      border: 'border-[#FFC93C]/60',
    },
    offline: {
      label: 'Offline',
      bg: 'bg-[#DFDFDF]/50',
      text: 'text-[#5F5A8C]',
      dot: 'bg-[#5F5A8C]',
      border: 'border-[#DFDFDF]',
    },
    gps_unavailable: {
      label: 'GPS Unavailable',
      bg: 'bg-[#DFDFDF]/50',
      text: 'text-[#5F5A8C]',
      dot: 'bg-[#5F5A8C]',
      border: 'border-[#DFDFDF]',
    },
    no_collar: {
      label: 'No Collar',
      bg: 'bg-[#FFF7E8]',
      text: 'text-[#5F5A8C]',
      dot: 'bg-[#B7B2DC]',
      border: 'border-[#DFDFDF]',
    },
  };

  const current = configs[status] || configs.no_collar;
  const isSm = size === 'sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold font-display select-none whitespace-nowrap border',
        current.bg,
        current.text,
        current.border,
        isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-[13px]',
        className
      )}
    >
      <span className={cn('rounded-full shrink-0 animate-pulse', current.dot, isSm ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {current.label}
    </span>
  );
}

export function SpeciesBadge({
  species,
  className,
}: {
  species: AnimalSpecies | string;
  className?: string;
}) {
  const isDog = species === 'dog';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-display font-bold select-none border-2 border-[#241F4E]',
        isDog
          ? 'bg-[#FFC93C] text-[#241F4E]'
          : 'bg-[#8B6BFF] text-white',
        className
      )}
    >
      <span>{isDog ? '🐕' : '🐈'}</span>
      <span className="capitalize">{species}</span>
    </span>
  );
}

export function SightingBadge({
  status,
  size = 'md',
  className,
}: {
  status: SightingStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const styles: Record<string, { label: string; bg: string; text: string; border: string }> = {
    pending: { label: 'Review Pending', bg: 'bg-[#FFC93C]/20', text: 'text-[#241F4E]', border: 'border-[#FFC93C]' },
    confirmed: { label: 'Verified Spotting', bg: 'bg-[#4FCB77]/20', text: 'text-[#241F4E]', border: 'border-[#4FCB77]' },
    rejected: { label: 'Rejected', bg: 'bg-[#FF5470]/20', text: 'text-[#FF5470]', border: 'border-[#FF5470]' },
    needs_review: { label: 'Needs Verification', bg: 'bg-[#FF8A3D]/20', text: 'text-[#FF8A3D]', border: 'border-[#FF8A3D]' },
  };

  const info = styles[status] || styles.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-display font-bold whitespace-nowrap select-none border',
        info.bg,
        info.text,
        info.border,
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-[13px]',
        className
      )}
    >
      {info.label}
    </span>
  );
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-display font-bold bg-[#FFF7E8] text-[#241F4E] border-2 border-[#241F4E]',
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
