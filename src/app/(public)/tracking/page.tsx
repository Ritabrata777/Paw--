'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Search,
  Filter,
  Info,
  Clock,
  Compass,
  Battery,
  AlertCircle,
  Maximize2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { TrackingMap } from '@/components/maps/TrackingMap';
import { TrackingSidebar } from '@/components/maps/TrackingSidebar';
import { Animal, GPSLocation } from '@/types';
import { Button } from '@/components/ui/Button';

export default function TrackingPage() {
  const [trackedAnimals, setTrackedAnimals] = useState<
    (Animal & { lastLocation?: GPSLocation })[]
  >([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tracking');
      if (res.ok) {
        const json = await res.json();
        const data = json.data || [];
        setTrackedAnimals(data);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchTrackingData, 30000);
    return () => clearInterval(interval);
  }, []);

  const selectedAnimal = trackedAnimals.find((a) => a.id === selectedId);

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16 flex flex-col">
      {/* Title & Status Bar */}
      <div className="max-w-[var(--container-wide)] w-full mx-auto px-6 lg:px-12 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-light">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-status-online animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
                TELEMETRY MESH
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-text-primary mt-1">
              Live GPS Tracking Dashboard
            </h1>
          </div>

          {/* Quick Refresh & Stats */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-tertiary">
              Updated: {lastRefreshed.toLocaleTimeString()}
            </span>
            <Button
              onClick={fetchTrackingData}
              variant="secondary"
              size="sm"
              isLoading={loading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Telemetry
            </Button>
            <Button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              variant="outline-sage"
              size="sm"
              className="lg:hidden"
            >
              {mobileSidebarOpen ? 'Hide List' : 'Show List'}
            </Button>
          </div>
        </div>

        {/* Honest Disclaimers Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-cream/70 border border-border-light flex items-center justify-between gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-forest shrink-0" />
            <span>
              <strong>Real Telemetry Status:</strong> Positions indicate the latest validated GPS
              fix received by our MQTT broker. Offline devices show their last recorded historical
              point.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-online" /> Online Fix (&lt;1h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-stale" /> Stale (&lt;24h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-offline" /> Offline / Inactive
            </span>
          </div>
        </div>
      </div>

      {/* Main Map & Sidebar Workspace */}
      <div className="max-w-[var(--container-wide)] w-full mx-auto px-6 lg:px-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Sidebar (Desktop always visible, mobile toggleable) */}
        <div
          className={`lg:col-span-4 xl:col-span-3 ${
            mobileSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <TrackingSidebar
            animals={trackedAnimals}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setMobileSidebarOpen(false);
            }}
          />
        </div>

        {/* Right Map Canvas */}
        <div className="lg:col-span-8 xl:col-span-9 relative rounded-2xl overflow-hidden border border-border bg-cream/30 min-h-[500px] flex flex-col">
          <TrackingMap
            animals={trackedAnimals}
            selectedAnimalId={selectedId}
            onAnimalSelect={(id) => setSelectedId(id)}
            className="w-full h-full min-h-[550px] flex-1"
          />

          {/* Selected animal pill at bottom of map */}
          {selectedAnimal && selectedAnimal.lastLocation && (
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl z-[400] flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-base text-text-primary">
                    {selectedAnimal.name}
                  </h4>
                  <span className="text-[10px] font-mono text-text-tertiary">
                    {selectedAnimal.deviceId}
                  </span>
                </div>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  {selectedAnimal.locality}
                </p>
              </div>

              <Button
                href={`/animals/${selectedAnimal.id}`}
                size="sm"
                variant="primary"
                className="shrink-0"
              >
                Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

