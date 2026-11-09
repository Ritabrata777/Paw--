'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  Info,
  X,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportCategory } from '@/types';

export default function ReportEmergencyPage() {
  const [category, setCategory] = useState<ReportCategory>('injured');
  const [description, setDescription] = useState('');
  const [locality, setLocality] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: { id: ReportCategory; label: string; desc: string; icon: string }[] = [
    {
      id: 'injured',
      label: 'Injured Animal',
      desc: 'Bleeding, limping, hit by vehicle, or visible trauma',
      icon: '🩹',
    },
    {
      id: 'missing',
      label: 'Missing Animal',
      desc: 'Has not been seen in colony for >48h or collar signal lost',
      icon: '🔍',
    },
    {
      id: 'needs_assistance',
      label: 'Urgent Feeding / Shelter',
      desc: 'Severely malnourished, nursing litter, or displaced',
      icon: '🥣',
    },
    {
      id: 'damaged_collar',
      label: 'Damaged / Snagged Collar',
      desc: 'Collar is caught on object or battery enclosure cracked',
      icon: '⚠️',
    },
    {
      id: 'missing_collar',
      label: 'Collar Fallen Off',
      desc: 'Animal spotted without previously assigned smart collar',
      icon: '📿',
    },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !locality.trim()) {
      setError('Please provide locality and description of the situation.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description: description.trim() + (contactInfo ? ` (Reporter Contact: ${contactInfo})` : ''),
          locality: locality.trim(),
          photoUrl: photoPreview || undefined,
          latitude: 22.5726 + (Math.random() - 0.5) * 0.04,
          longitude: 88.3639 + (Math.random() - 0.5) * 0.04,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit welfare report');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-offwhite pt-32 pb-24">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-border text-center shadow-lg space-y-6">
            <div className="w-20 h-20 rounded-full bg-orange/15 text-orange flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-orange" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
                INCIDENT DISPATCHED
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-text-primary">
                Welfare Report Logged
              </h1>
              <p className="text-xs md:text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                Your report has been dispatched to local community caregivers and volunteer
                first-responders in {locality}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream/70 border border-border-light text-xs text-text-secondary text-left space-y-2">
              <div className="flex items-center gap-2 font-semibold text-forest">
                <Info className="w-4 h-4 text-forest" /> Veterinary Disclaimer Reminder
              </div>
              <p>
                Pawthik (Paw-থিক) is a community mutual-aid coordination platform, not an emergency
                veterinary hospital. If an animal is in critical condition, please contact your
                local animal hospital immediately.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/tracking" variant="primary">
                View Live Telemetry Map
              </Button>
              <Button onClick={() => setSubmitted(false)} variant="secondary">
                Submit Another Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        {/* Urgent Warning Header */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Important Welfare Notice:</strong>
            <p>
              Pawthik (Paw-থিক) helps coordinate community volunteer caregivers. If an animal requires
              immediate, life-threatening surgical intervention, contact your nearest city
              veterinary dispensary or animal ambulance service.
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
            COMMUNITY ANIMAL CARE
          </span>
          <h1 className="font-display text-4xl text-text-primary">
            Animal Welfare & Emergency Report
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Report an injured animal, alert neighbours to a missing colony friend, or report a
            damaged or snagged smart collar.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-sm space-y-8"
        >
          {/* Category Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              1. Incident Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    category === c.id
                      ? 'bg-cream/60 border-forest shadow-xs'
                      : 'border-border-light hover:border-forest/30 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span>
                    <span className="text-xs font-bold text-text-primary">{c.label}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Locality */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              2. Street Corner / Exact Locality *
            </label>
            <input
              type="text"
              required
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Park Street behind Flurys, under the banyan tree..."
              className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:border-forest"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              3. Detailed Description of the Situation *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, markings, collar details (if any), behavior, and whether someone is currently staying with the animal..."
              className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:border-forest"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              4. Photograph (Optional but recommended)
            </label>
            {photoPreview ? (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border group bg-cream">
                <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-border-light rounded-2xl p-6 text-center bg-cream/30 hover:bg-cream/50 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Camera className="w-6 h-6 text-forest mx-auto mb-2" />
                <span className="text-xs font-semibold text-text-primary block">
                  Click to attach photo of the animal or injury
                </span>
                <span className="text-[10px] text-text-tertiary">PNG or JPG up to 5MB</span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
              5. Your Contact Phone / Telegram (Optional)
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g. +91 98300 00000 (allows local volunteers to coordinate with you)"
              className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:border-forest"
            />
          </div>

          <Button type="submit" variant="orange" size="lg" fullWidth isLoading={isSubmitting}>
            Dispatch Welfare Report to Community
          </Button>
        </form>
      </div>
    </div>
  );
}

