'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MapPin,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
  Camera,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SightingBadge, SpeciesBadge } from '@/components/ui/Badge';
import { Sighting, SightingStatus } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function AdminSightingsPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSightings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sightings?limit=50');
      if (res.ok) {
        const json = await res.json();
        setSightings(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load sightings queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: SightingStatus) => {
    // Optimistic UI update
    setSightings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const filtered = sightings.filter((s) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'confirmed'
        ? s.status === 'confirmed'
        : s.status === 'pending' || s.status === 'needs_review';
    const matchesSearch =
      (s.animal?.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      s.locality.toLowerCase().includes(search.toLowerCase()) ||
      (s.notes?.toLowerCase() || '').includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#EEF1EA] pt-28 pb-24 font-body">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#DFDFDF] pb-6">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#5F5A8C] hover:text-[#241F4E] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF8A3D]" />
              <h1 className="font-display text-3xl md:text-4xl text-[#241F4E] font-bold">
                Community Sightings Verification
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#5F5A8C] mt-1 font-body">
              Review and certify photo proof submitted by neighborhood spotters and caregivers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchSightings}
              variant="secondary"
              size="sm"
              isLoading={loading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button href="/sightings" variant="ghost" size="sm">
              Public Feed
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5F5A8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by animal name, spot location, or caregiver notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEF1EA]/50 border-2 border-[#DFDFDF] rounded-xl text-xs sm:text-sm font-body text-[#241F4E] placeholder:text-[#5F5A8C] focus:outline-none focus:border-[#241F4E] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {(['all', 'pending', 'confirmed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filter === tab
                    ? 'bg-[#241F4E] text-white shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border border-[#DFDFDF]'
                }`}
              >
                {tab}
                <span className="ml-1.5 opacity-75 font-mono text-[10px]">
                  (
                  {
                    sightings.filter((s) =>
                      tab === 'all'
                        ? true
                        : tab === 'confirmed'
                        ? s.status === 'confirmed'
                        : s.status === 'pending' || s.status === 'needs_review'
                    ).length
                  }
                  )
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sightings Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#5F5A8C] mx-auto opacity-40" />
            <h3 className="font-display text-xl text-[#241F4E] font-bold">No sightings found</h3>
            <p className="text-xs text-[#5F5A8C] max-w-sm mx-auto font-body">
              There are no community sighting reports matching your current filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((sighting) => {
              const isConfirmed = sighting.status === 'confirmed';
              return (
                <div
                  key={sighting.id}
                  className="bg-white rounded-[28px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Photo Banner */}
                    <div className="relative aspect-video bg-[#EEF1EA] border-b-[3px] border-[#241F4E]">
                      {sighting.photoUrl ? (
                        <Image
                          src={sighting.photoUrl}
                          alt={sighting.animal?.name || 'Spotted animal'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#5F5A8C] gap-1">
                          <Camera className="w-6 h-6 opacity-40" />
                          <span className="text-[11px] font-mono">No photo attached</span>
                        </div>
                      )}

                      {/* Status Pill */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display font-bold border-2 ${
                            isConfirmed
                              ? 'bg-[#4FCB77] text-[#241F4E] border-[#241F4E]'
                              : 'bg-[#FFC93C] text-[#241F4E] border-[#241F4E]'
                          }`}
                        >
                          {isConfirmed ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" /> Confirmed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" /> Pending Review
                            </>
                          )}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <SpeciesBadge species={sighting.species} />
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg text-[#241F4E] font-bold truncate">
                          {sighting.animal?.name || 'Unknown Street Animal'}
                        </h3>
                        {sighting.animalId && (
                          <Link
                            href={`/animals/${sighting.animalId}`}
                            className="text-xs font-mono font-bold text-[#FF8A3D] hover:underline"
                          >
                            View Profile ↗
                          </Link>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#5F5A8C]">
                        <MapPin className="w-3.5 h-3.5 text-[#FF8A3D] shrink-0" />
                        <span className="truncate">{sighting.locality}</span>
                      </div>

                      {sighting.notes && (
                        <p className="text-xs text-[#241F4E] bg-[#FFF7E8] p-3 rounded-xl border border-[#DFDFDF] leading-relaxed">
                          &ldquo;{sighting.notes}&rdquo;
                        </p>
                      )}

                      <div className="pt-2 border-t border-[#DFDFDF] flex items-center justify-between text-[11px] font-mono text-[#5F5A8C]">
                        <span>Reporter: {sighting.reportedBy || 'Anonymous Caregiver'}</span>
                        <span>{formatRelativeTime(sighting.sightedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-[#EEF1EA]/60 border-t-2 border-[#DFDFDF] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          sighting.id,
                          isConfirmed ? 'rejected' : 'confirmed'
                        )
                      }
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-display font-bold border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isConfirmed
                          ? 'bg-white hover:bg-[#FF5470] hover:text-white text-[#5F5A8C] border-[#DFDFDF]'
                          : 'bg-[#4FCB77] hover:bg-[#2E9E5B] text-white border-[#241F4E] shadow-xs'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Revoke Certification
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Certify Sighting
                        </>
                      )}
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${sighting.latitude},${sighting.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border-2 border-[#DFDFDF] text-[#5F5A8C] hover:text-[#241F4E] hover:border-[#241F4E] transition-colors"
                      title="View coordinates on Google Maps"
                    >
                      <MapPin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
