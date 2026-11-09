'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Radio,
  Heart,
  Share2,
  AlertTriangle,
  Battery,
  Clock,
  Compass,
  CheckCircle,
  Shield,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Animal, GPSLocation, Sighting } from '@/types';
import { TrackingBadge, SpeciesBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimalGallery } from '@/components/animals/AnimalGallery';
import { TrackingMap } from '@/components/maps/TrackingMap';
import { formatDate, formatRelativeTime, approximateLocation } from '@/lib/utils';

export default function AnimalProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [lastLocation, setLastLocation] = useState<GPSLocation | null>(null);
  const [locationHistory, setLocationHistory] = useState<GPSLocation[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAnimal() {
      if (!id) return;
      try {
        const res = await fetch(`/api/animals/${id}`);
        if (res.ok) {
          const json = await res.json();
          const animalData = json.data?.animal || json.data;
          if (animalData && animalData.id) {
            setAnimal(animalData);
            if (animalData.lastLocation) setLastLocation(animalData.lastLocation);
            if (animalData.locationHistory) setLocationHistory(animalData.locationHistory);
          }
        }

        // Fetch sightings for this animal
        const sRes = await fetch(`/api/sightings?animalId=${id}`);
        if (sRes.ok) {
          const sJson = await sRes.json();
          if (sJson.data?.sightings) setSightings(sJson.data.sightings);
        }
      } catch (err) {
        console.error('Failed to load animal profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnimal();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-text-secondary">Loading animal profile...</p>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-offwhite pt-32 pb-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto space-y-4 p-8 bg-white rounded-3xl border border-border">
          <h2 className="font-display text-3xl text-text-primary">Animal Not Found</h2>
          <p className="text-sm text-text-secondary">
            We couldn't locate a profile with identifier "{id}". It may have been removed or the ID
            was mistyped.
          </p>
          <Button href="/explore" variant="primary">
            Back to Animal Explorer
          </Button>
        </div>
      </div>
    );
  }

  // Location privacy & coordinates
  const approx = lastLocation
    ? approximateLocation(lastLocation.latitude, lastLocation.longitude, 3)
    : null;

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-24">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 py-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-forest transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        {/* Profile Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-7 space-y-10">
            {/* Gallery */}
            <AnimalGallery
              primaryPhoto={
                animal.primaryPhoto && !animal.primaryPhoto.startsWith('/images/')
                  ? animal.primaryPhoto
                  : animal.species === 'cat'
                  ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800'
                  : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800'
              }
              photos={animal.photos}
              animalName={animal.name}
            />

            {/* Description & Narrative */}
            <div className="bg-white rounded-3xl p-8 border border-border-light shadow-sm space-y-6">
              <h2 className="font-display text-2xl text-text-primary">About {animal.name}</h2>
              <p className="text-text-secondary text-base leading-relaxed font-body">
                {animal.description ||
                  `${animal.name} is a known neighbourhood friend who frequents ${animal.locality}. Looked after by local community members and registered on PAWTRACE.`}
              </p>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border-light">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                    Locality
                  </div>
                  <div className="text-sm font-semibold text-text-primary mt-0.5">
                    {animal.locality}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                    Estimated Age
                  </div>
                  <div className="text-sm font-semibold text-text-primary mt-0.5">
                    {animal.approximateAge || 'Unknown'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                    Gender
                  </div>
                  <div className="text-sm font-semibold text-text-primary capitalize mt-0.5">
                    {animal.gender || 'Unknown'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                    Registered On
                  </div>
                  <div className="text-sm font-semibold text-text-primary mt-0.5">
                    {formatDate(animal.createdAt)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                    Smart Collar
                  </div>
                  <div className="text-sm font-semibold text-text-primary mt-0.5">
                    {animal.deviceId || 'None Assigned'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                    Status
                  </div>
                  <div className="text-sm font-semibold text-text-primary mt-0.5">
                    <TrackingBadge status={animal.trackingStatus} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Community Sightings Timeline */}
            <div className="bg-white rounded-3xl p-8 border border-border-light shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl text-text-primary">
                    Community Sightings
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Recorded reports submitted by local residents and caregivers
                  </p>
                </div>
                <Button
                  href={`/sightings?animalId=${animal.id}`}
                  variant="outline-sage"
                  size="sm"
                >
                  Report Sighting
                </Button>
              </div>

              {sightings.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-secondary bg-cream/40 rounded-2xl p-4">
                  No community sightings recorded yet for {animal.name}. Have you seen them recently?
                </div>
              ) : (
                <div className="divide-y divide-border-light space-y-4">
                  {sightings.map((s) => (
                    <div key={s.id} className="pt-4 first:pt-0 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center shrink-0 text-xs">
                        📍
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-text-primary">
                            {s.locality}
                          </span>
                          <span className="text-[10px] text-text-tertiary font-mono">
                            {formatRelativeTime(s.sightedAt)}
                          </span>
                        </div>
                        {s.notes && (
                          <p className="text-xs text-text-secondary mt-1">"{s.notes}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Hero Information, Telemetry & Location */}
          <div className="lg:col-span-5 space-y-8">
            {/* Title & Action Box */}
            <div className="bg-white rounded-3xl p-8 border border-border-light shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <SpeciesBadge species={animal.species} />
                  <span className="px-3 py-1 text-xs font-mono tracking-wider rounded-full bg-cream text-text-primary border border-border">
                    {animal.pawtraceId}
                  </span>
                </div>
                <h1 className="font-display text-4xl text-text-primary">{animal.name}</h1>
                <p className="text-sm text-text-secondary flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-orange shrink-0" />
                  {animal.locality}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => setIsSaved(!isSaved)}
                  variant={isSaved ? 'orange' : 'secondary'}
                  className="flex-1"
                  leftIcon={
                    <Heart
                      className={`w-4 h-4 ${isSaved ? 'fill-white text-white' : 'text-text-primary'}`}
                    />
                  }
                >
                  {isSaved ? 'Saved in Carelist' : 'Save Animal'}
                </Button>

                <Button
                  onClick={handleShare}
                  variant="secondary"
                  aria-label="Share animal profile"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? 'Copied Link' : 'Share'}
                </Button>
              </div>
            </div>

            {/* GPS Telemetry & Map Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-border-light shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-text-primary">
                    Location & Telemetry
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {animal.deviceId ? 'ESP32 Smart Collar Position' : 'No Hardware Connected'}
                  </p>
                </div>
                <TrackingBadge status={animal.trackingStatus} />
              </div>

              {/* Map View */}
              {animal.deviceId && lastLocation ? (
                <div className="space-y-4">
                  <div className="h-64 rounded-2xl overflow-hidden border border-border">
                    <TrackingMap
                      animals={[{ ...animal, lastLocation }]}
                      selectedAnimalId={animal.id}
                      zoom={14}
                      interactive={true}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Telemetry metadata */}
                  <div className="bg-cream/60 rounded-2xl p-4 text-xs space-y-2 border border-border-light">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sage" /> Last Reported
                      </span>
                      <span className="font-medium text-text-primary">
                        {formatRelativeTime(lastLocation.timestamp)} ({formatDate(lastLocation.timestamp)})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-sage" /> Public Coordinate
                      </span>
                      <span className="font-mono text-text-primary font-medium">
                        {approx?.lat}° N, {approx?.lng}° E (Fuzzed)
                      </span>
                    </div>

                    {lastLocation.batteryLevel !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-1">
                          <Battery className="w-3.5 h-3.5 text-sage" /> Collar Battery
                        </span>
                        <span className="font-medium text-text-primary">
                          {lastLocation.batteryLevel}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-cream/40 rounded-xl text-[11px] text-text-tertiary">
                    <Info className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                    <span>
                      For animal safety, precise coordinates are approximated for public browsing.
                      Verified caregivers receive real-time pinpoints.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 text-center bg-cream/30 rounded-2xl border border-dashed border-border-light space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mx-auto text-forest">
                    <Radio className="w-5 h-5 text-sage" />
                  </div>
                  <h4 className="font-display text-lg text-text-primary">
                    No GPS Collar Assigned
                  </h4>
                  <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                    {animal.name} does not currently have a smart collar fitted. You can still track
                    and record their movements through community sightings.
                  </p>
                  <Button
                    href={`/sightings?animalId=${animal.id}`}
                    size="sm"
                    variant="outline-sage"
                  >
                    Report Sighting for {animal.name}
                  </Button>
                </div>
              )}
            </div>

            {/* Emergency & Welfare Notice */}
            <div className="bg-cream/50 rounded-2xl p-6 border border-border-light space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-forest">
                <Shield className="w-4 h-4 text-orange" />
                <span>Notice an Issue or Injury?</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                If {animal.name} appears injured, sick, or their collar is caught or damaged, submit
                a report to local volunteer responders immediately.
              </p>
              <Button
                href="/sightings"
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-orange hover:text-orange-dark p-0"
              >
                Submit Emergency Animal Report →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
