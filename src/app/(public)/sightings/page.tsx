'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Camera,
  MapPin,
  Clock,
  Plus,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  X,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SightingBadge, SpeciesBadge } from '@/components/ui/Badge';
import { Sighting, Animal, AnimalSpecies } from '@/types';
import { formatRelativeTime, formatDate } from '@/lib/utils';

export default function SightingsPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

  // Report Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');
  const [species, setSpecies] = useState<AnimalSpecies>('dog');
  const [locality, setLocality] = useState('');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const fetchSightings = async () => {
    try {
      const [sRes, aRes] = await Promise.all([
        fetch('/api/sightings'),
        fetch('/api/animals?limit=50'),
      ]);
      if (sRes.ok) {
        const json = await sRes.json();
        setSightings(json.data || []);
      }
      if (aRes.ok) {
        const aJson = await aRes.json();
        setAnimals(aJson.data.animals || []);
      }
    } catch (err) {
      console.error('Failed to load sightings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locality.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        animalId: selectedAnimalId || undefined,
        species,
        locality: locality.trim(),
        notes: notes.trim(),
        latitude: 22.5726 + (Math.random() - 0.5) * 0.05, // Approximate Kolkata coordinates
        longitude: 88.3639 + (Math.random() - 0.5) * 0.05,
        sightedAt: new Date().toISOString(),
        photoUrl: photoPreview || undefined,
      };

      const res = await fetch('/api/sightings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 4000);
        setModalOpen(false);
        // Reset form
        setSelectedAnimalId('');
        setLocality('');
        setNotes('');
        setPhotoPreview(null);
        fetchSightings();
      }
    } catch (err) {
      console.error('Failed to report sighting', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSightings = sightings.filter((s) => {
    if (filter === 'confirmed') return s.status === 'confirmed';
    if (filter === 'pending') return s.status === 'pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
              EYES ON THE STREET
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary mt-2">
              Community Sightings
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-xl mt-3">
              Every neighbourhood observation helps locate, protect, and identify animals.
              Verified by local volunteers and fellow animal caregivers.
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Report an Animal Sighting
          </Button>
        </div>

        {/* Success toast */}
        {successNotice && (
          <div className="mb-8 p-4 rounded-2xl bg-forest text-cream text-xs flex items-center justify-between shadow-lg">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange" />
              Thank you! Your sighting has been submitted for community verification.
            </span>
            <button onClick={() => setSuccessNotice(false)}>
              <X className="w-4 h-4 text-cream/70 hover:text-white" />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 border-b border-border-light pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-forest text-cream shadow-sm'
                : 'bg-white text-text-secondary hover:bg-cream border border-border-light'
            }`}
          >
            All Reports ({sightings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filter === 'confirmed'
                ? 'bg-forest text-cream shadow-sm'
                : 'bg-white text-text-secondary hover:bg-cream border border-border-light'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filter === 'pending'
                ? 'bg-forest text-cream shadow-sm'
                : 'bg-white text-text-secondary hover:bg-cream border border-border-light'
            }`}
          >
            Pending Review
          </button>
        </div>

        {/* Sightings Feed */}
        {loading ? (
          <div className="py-20 text-center text-xs text-text-secondary">
            Loading community sightings...
          </div>
        ) : filteredSightings.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl p-8 border border-border">
            <h3 className="font-display text-xl text-text-primary">No Sightings Logged</h3>
            <p className="text-xs text-text-secondary mt-1">
              Be the first to record a sighting in your neighbourhood.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSightings.map((s) => {
              const matchedAnimal = animals.find((a) => a.id === s.animalId);
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl overflow-hidden border border-border-light shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Photo if available */}
                    {s.photoUrl && (
                      <div className="relative aspect-[16/10] w-full bg-cream">
                        <Image src={s.photoUrl} alt="Sighting photo" fill className="object-cover" />
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <SpeciesBadge species={s.species} />
                        <SightingBadge status={s.status} size="sm" />
                      </div>

                      <h3 className="font-display text-xl text-text-primary">
                        {matchedAnimal ? matchedAnimal.name : 'Unidentified Street Animal'}
                      </h3>

                      <p className="text-xs text-text-secondary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
                        {s.locality}
                      </p>

                      {s.notes && (
                        <p className="text-xs text-text-secondary italic bg-cream/40 p-3 rounded-xl border border-border-light">
                          "{s.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-border-light/60 flex items-center justify-between text-[11px] text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sage" />
                      {formatRelativeTime(s.sightedAt)}
                    </span>
                    {matchedAnimal && (
                      <span className="font-mono text-forest">{matchedAnimal.pawtraceId}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Report Sighting Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border-light pb-4">
              <h2 className="font-display text-2xl text-text-primary">
                Report an Animal Sighting
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-text-tertiary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              {/* Optional Link to Existing Animal */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Associated Animal (Optional)
                </label>
                <select
                  value={selectedAnimalId}
                  onChange={(e) => setSelectedAnimalId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-border text-xs focus:outline-none focus:border-forest"
                >
                  <option value="">Unidentified / Not yet registered</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.pawtraceId}) — {a.locality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Species */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Species
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="species"
                      checked={species === 'dog'}
                      onChange={() => setSpecies('dog')}
                      className="accent-forest"
                    />
                    🐕 Street Dog
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="species"
                      checked={species === 'cat'}
                      onChange={() => setSpecies('cat')}
                      className="accent-forest"
                    />
                    🐈 Community Cat
                  </label>
                </div>
              </div>

              {/* Locality */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Where did you spot them? *
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g., Near Gariahat Crossing fish market..."
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-border text-xs focus:outline-none focus:border-forest"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Observation Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Did they seem healthy? Were they eating? Any collar visible?"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-border text-xs focus:outline-none focus:border-forest"
                />
              </div>

              {/* Optional Photo */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-cream file:text-forest"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-light">
                <Button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  Submit Sighting
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

