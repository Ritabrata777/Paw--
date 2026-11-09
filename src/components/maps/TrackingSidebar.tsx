'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Radio, Battery, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Animal, GPSLocation } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';
import { TrackingBadge } from '@/components/ui/Badge';

interface TrackingSidebarProps {
  animals: (Animal & { lastLocation?: GPSLocation })[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const TrackingSidebar: React.FC<TrackingSidebarProps> = ({
  animals,
  selectedId,
  onSelect,
  className,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filtered = animals.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.pawtraceId.toLowerCase().includes(search.toLowerCase()) ||
      a.locality.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'online') {
      return matchesSearch && a.trackingStatus === 'recently_updated';
    }
    if (statusFilter === 'offline') {
      return (
        matchesSearch &&
        (a.trackingStatus === 'offline' || a.trackingStatus === 'gps_unavailable')
      );
    }
    return matchesSearch;
  });

  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-2xl border border-border/80 shadow-sm overflow-hidden h-[600px] lg:h-full',
        className
      )}
    >
      {/* Search Header */}
      <div className="p-4 border-b border-border-light bg-cream/30 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collar or animal..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-full border border-border text-xs focus:outline-none focus:border-forest"
          />
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-2.5 py-1 rounded-full font-medium transition-colors',
              statusFilter === 'all'
                ? 'bg-forest text-cream'
                : 'bg-white text-text-secondary hover:bg-cream'
            )}
          >
            All Collars ({animals.length})
          </button>
          <button
            onClick={() => setStatusFilter('online')}
            className={cn(
              'px-2.5 py-1 rounded-full font-medium transition-colors',
              statusFilter === 'online'
                ? 'bg-forest text-cream'
                : 'bg-white text-text-secondary hover:bg-cream'
            )}
          >
            Live Signals
          </button>
          <button
            onClick={() => setStatusFilter('offline')}
            className={cn(
              'px-2.5 py-1 rounded-full font-medium transition-colors',
              statusFilter === 'offline'
                ? 'bg-forest text-cream'
                : 'bg-white text-text-secondary hover:bg-cream'
            )}
          >
            Offline
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border-light p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-text-secondary text-xs">
            No smart collars matching filter.
          </div>
        ) : (
          filtered.map((animal) => {
            const isSelected = animal.id === selectedId;
            return (
              <div
                key={animal.id}
                onClick={() => onSelect(animal.id)}
                className={cn(
                  'group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all',
                  isSelected
                    ? 'bg-cream/70 border-l-4 border-l-forest shadow-sm'
                    : 'hover:bg-cream/40 border-l-4 border-l-transparent'
                )}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-cream">
                  <Image
                    src={
                      animal.primaryPhoto && !animal.primaryPhoto.startsWith('/images/')
                        ? animal.primaryPhoto
                        : animal.species === 'cat'
                        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200'
                        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={animal.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-display text-sm font-semibold text-text-primary truncate">
                      {animal.name}
                    </h4>
                    <span className="text-[10px] font-mono text-text-tertiary shrink-0">
                      {animal.deviceId || animal.pawtraceId}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary truncate mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sage shrink-0" />
                    {animal.locality}
                  </p>

                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-text-tertiary">
                    <TrackingBadge status={animal.trackingStatus} size="sm" />
                    {animal.lastLocation && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelativeTime(animal.lastLocation.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TrackingSidebar;

