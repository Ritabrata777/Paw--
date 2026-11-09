'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Plus,
  Radio,
  MapPin,
  Clock,
  Shield,
  Eye,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { Animal, Sighting } from '@/types';

export default function UserDashboard() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [aRes, sRes] = await Promise.all([
          fetch('/api/animals?limit=4'),
          fetch('/api/sightings?limit=3'),
        ]);

        if (aRes.ok) {
          const aJson = await aRes.json();
          setAnimals(aJson.data.animals || []);
        }
        if (sRes.ok) {
          const sJson = await sRes.json();
          setSightings(sJson.data || []);
        }
      } catch (err) {
        console.error('Dashboard load failed', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-12">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
              COMMUNITY CAREGIVER DASHBOARD
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-text-primary">
              Welcome back, Arjun
            </h1>
            <p className="text-xs md:text-sm text-text-secondary max-w-xl">
              Monitor animals in your registered care territory, view incoming community sightings,
              and check smart collar telemetry.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              href="/register-animal"
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Register Animal
            </Button>
            <Button href="/tracking" variant="secondary" size="md">
              Live Map
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Animals in Your Care
            </span>
            <div className="font-display text-3xl text-forest mt-1">4</div>
            <p className="text-[11px] text-text-secondary mt-1">Registered under your account</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              GPS Collars Active
            </span>
            <div className="font-display text-3xl text-orange mt-1">2</div>
            <p className="text-[11px] text-text-secondary mt-1">Transmitting position</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Saved in Carelist
            </span>
            <div className="font-display text-3xl text-text-primary mt-1">3</div>
            <p className="text-[11px] text-text-secondary mt-1">Bookmarked profiles</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Community Status
            </span>
            <div className="font-display text-2xl text-forest mt-1">Verified Member</div>
            <p className="text-[11px] text-text-secondary mt-1">Caregiver since June 2026</p>
          </div>
        </div>

        {/* Animals In Care */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-light pb-3">
            <h2 className="font-display text-2xl text-text-primary">Your Monitored Animals</h2>
            <Link
              href="/explore"
              className="text-xs text-forest hover:underline font-semibold flex items-center gap-1"
            >
              Browse Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} variant="editorial" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

