import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePawtraceId(): string {
  const num = Math.floor(Math.random() * 99999) + 1;
  return `PT-${String(num).padStart(5, '0')}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}

export function getTrackingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    recently_updated: 'Recently Updated',
    last_reported: 'Last Reported',
    offline: 'Offline',
    gps_unavailable: 'GPS Unavailable',
    no_collar: 'No Collar Assigned',
  };
  return labels[status] || status;
}

export function getTrackingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    recently_updated: 'var(--color-status-online)',
    last_reported: 'var(--color-status-stale)',
    offline: 'var(--color-status-offline)',
    gps_unavailable: 'var(--color-status-offline)',
    no_collar: 'var(--color-status-offline)',
  };
  return colors[status] || 'var(--color-status-offline)';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function approximateLocation(lat: number, lng: number, precision: number = 3): { lat: number; lng: number } {
  return {
    lat: Number(lat.toFixed(precision)),
    lng: Number(lng.toFixed(precision)),
  };
}

export function validateGPSCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function getSpeciesEmoji(species: string): string {
  return species === 'dog' ? '🐕' : '🐈';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

