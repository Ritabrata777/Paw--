'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Animal, GPSLocation, Sighting } from '@/types';

interface TrackingMapProps {
  animals?: (Animal & { lastLocation?: GPSLocation })[];
  selectedAnimalId?: string;
  onAnimalSelect?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  showSightings?: boolean;
  sightings?: Sighting[];
  interactive?: boolean;
  className?: string;
}

const DynamicMapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] bg-cream/60 rounded-2xl border border-border flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-forest" />
      <p className="text-sm font-medium text-text-secondary">
        Loading interactive street telemetry map...
      </p>
    </div>
  ),
});

export const TrackingMap: React.FC<TrackingMapProps> = (props) => {
  return <DynamicMapInner {...props} />;
};

export default TrackingMap;

