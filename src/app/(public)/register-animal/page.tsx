'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UploadCloud,
  CheckCircle2,
  X,
  Camera,
  ArrowRight,
  ShieldAlert,
  Radio,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Animal, AnimalSpecies, AnimalGender } from '@/types';

export default function RegisterAnimalPage() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<AnimalSpecies>('dog');
  const [locality, setLocality] = useState('');
  const [description, setDescription] = useState('');
  const [approximateAge, setApproximateAge] = useState('');
  const [gender, setGender] = useState<AnimalGender>('unknown');
  const [deviceId, setDeviceId] = useState('');

  // Image upload state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredAnimal, setRegisteredAnimal] = useState<Animal | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be less than 5MB in size');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a name for the animal');
      return;
    }
    if (!locality.trim()) {
      setError('Please specify the neighbourhood or street locality');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create animal in backend
      const res = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          species,
          locality: locality.trim(),
          description: description.trim(),
          approximateAge: approximateAge.trim() || undefined,
          gender,
          deviceId: deviceId.trim() || undefined,
          primaryPhoto: previewUrl || (species === 'cat' ? '/images/animals/cat-1.jpg' : '/images/animals/dog-1.jpg'),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to register animal');
      }

      setRegisteredAnimal(json.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSpecies('dog');
    setLocality('');
    setDescription('');
    setApproximateAge('');
    setGender('unknown');
    setDeviceId('');
    setPreviewUrl(null);
    setRegisteredAnimal(null);
  };

  // Success Screen
  if (registeredAnimal) {
    return (
      <div className="min-h-screen bg-offwhite pt-32 pb-24">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-border text-center shadow-lg space-y-6">
            <div className="w-20 h-20 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-forest" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
                REGISTRATION CONFIRMED
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-text-primary">
                {registeredAnimal.name} is on Pawthik (Paw-থিক)!
              </h1>
              <p className="text-xs md:text-sm text-text-secondary max-w-sm mx-auto">
                A permanent digital identity has been issued. They are now visible to local
                caregivers and community members.
              </p>
            </div>

            {/* Generated PAWTRACE ID Card */}
            <div className="p-6 rounded-2xl bg-cream/70 border border-border-light text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-text-tertiary">Official ID</span>
                <span className="text-sm font-mono font-bold text-forest">
                  {registeredAnimal.pawtraceId}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Locality</span>
                <span className="font-medium text-text-primary">{registeredAnimal.locality}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Species</span>
                <span className="font-medium text-text-primary capitalize">
                  {registeredAnimal.species}
                </span>
              </div>
              {registeredAnimal.deviceId && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-border-light">
                  <span className="text-text-secondary flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-forest" /> Smart Collar
                  </span>
                  <span className="font-mono text-forest font-semibold">
                    {registeredAnimal.deviceId}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button href={`/animals/${registeredAnimal.id}`} variant="primary" fullWidth>
                View Public Profile <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button onClick={resetForm} variant="secondary" fullWidth>
                Register Another Animal
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
            COMMUNITY ANIMAL REGISTRATION
          </span>
          <h1 className="font-display text-4xl text-text-primary">Register a Street Animal</h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Give a neighbourhood dog or cat their official digital identity. A collar is not
            required—every animal deserves to be recognized, named, and cared for.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-sm space-y-8"
        >
          {/* Photograph Upload Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              Photograph of the Animal
            </label>
            <p className="text-xs text-text-tertiary">
              Clear, authentic photo of their face or markings in their usual area.
            </p>

            {previewUrl ? (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border group bg-cream">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl border-2 border-dashed border-border-light hover:border-forest/40 bg-cream/30 hover:bg-cream/50 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-forest shadow-sm mb-3">
                  <UploadCloud className="w-6 h-6 text-forest" />
                </div>
                <div className="text-xs font-semibold text-text-primary">
                  Click to upload or drag photograph here
                </div>
                <p className="text-[11px] text-text-tertiary mt-1">
                  PNG, JPG, or WEBP up to 5MB
                </p>
              </div>
            )}
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Animal Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Animal's Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bholu, Meera, Sheru..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            {/* Species */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Species *
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as AnimalSpecies)}
                className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest cursor-pointer"
              >
                <option value="dog">🐕 Street Dog</option>
                <option value="cat">🐈 Community Cat</option>
              </select>
            </div>
          </div>

          {/* Locality */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              Street / Locality *
            </label>
            <input
              type="text"
              required
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Park Street near Tea Stall, College Street Book Market..."
              className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              Description & Friendly Habits
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell their story: How long have they lived here? Who feeds them? Are they vaccinated or friendly around children?"
              className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>

          {/* Optional Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Approximate Age (Optional)
              </label>
              <input
                type="text"
                value={approximateAge}
                onChange={(e) => setApproximateAge(e.target.value)}
                placeholder="e.g. 3 years, 6 months..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Gender (Optional)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as AnimalGender)}
                className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest cursor-pointer"
              >
                <option value="unknown">Not known / Unspecified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Hardware Smart Collar Section */}
          <div className="p-6 rounded-2xl bg-cream/50 border border-border-light space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-forest" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-forest">
                GPS Smart Collar (Optional)
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              If you have already fitted an ESP32-based Pawthik (Paw-থিক) collar onto this animal, enter its
              Device ID below (e.g., <code>PT-ESP32-005</code>). If not, simply leave this empty.
            </p>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="e.g. PT-ESP32-005"
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-forest"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Complete Registration & Issue ID
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

