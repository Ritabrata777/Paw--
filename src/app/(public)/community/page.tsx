'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Heart,
  Radio,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { Button } from '@/components/ui/Button';
import { Animal, Sighting } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function CommunityPage() {
  const [recentSightings, setRecentSightings] = useState<Sighting[]>([]);
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);
  const [uncollaredAnimals, setUncollaredAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunityData() {
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setRecentSightings(json.data.recentSightings || []);
            setRecentAnimals(json.data.recentlyRegistered || json.data.recentAnimals || []);
            setUncollaredAnimals(json.data.animalsWithoutCollars || []);
          }
        }
      } catch (err) {
        console.error('Failed to load community feed', err);
      } finally {
        setLoading(false);
      }
    }
    loadCommunityData();
  }, []);

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-20">
        {/* Editorial Community Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
            NEIGHBOURHOOD COLLECTIVE
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-text-primary leading-tight">
            The Community That Notices.
          </h1>
          <p className="text-text-secondary text-base md:text-xl font-body leading-relaxed">
            Behind every healthy street animal is a constellation of everyday people: the shopkeeper
            who saves food scraps, the morning jogger who checks on wounds, and the neighbours who
            remember their names.
          </p>
        </div>

        {/* Section 1: Recent Community Sightings */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-border-light pb-4">
            <div>
              <h2 className="font-display text-3xl text-text-primary">
                Fresh Street Sightings
              </h2>
              <p className="text-xs md:text-sm text-text-secondary mt-1">
                Real observations logged across neighbourhood corners over the past 48 hours
              </p>
            </div>
            <Button href="/sightings" variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              All Sightings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSightings.map((sighting) => (
              <div
                key={sighting.id}
                className="bg-white rounded-2xl p-6 border border-border-light shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-orange uppercase font-bold tracking-wider">
                      {sighting.species === 'dog' ? '🐕 Street Dog' : '🐈 Community Cat'}
                    </span>
                    <span className="text-text-tertiary">{formatRelativeTime(sighting.sightedAt)}</span>
                  </div>
                  <h3 className="font-display text-xl text-text-primary">
                    {sighting.animal?.name || 'Neighbourhood Friend'}
                  </h3>
                  <p className="text-xs text-text-secondary flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
                    {sighting.locality}
                  </p>
                  {sighting.notes && (
                    <p className="text-xs text-text-secondary italic bg-cream/30 p-3 rounded-xl">
                      "{sighting.notes}"
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-text-tertiary pt-3 border-t border-border-light flex items-center justify-between">
                  <span>Reported by Community</span>
                  <span className="text-status-online font-semibold">● Verified Spotting</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Newly Registered Animals */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-border-light pb-4">
            <div>
              <h2 className="font-display text-3xl text-text-primary">
                New Additions to the Registry
              </h2>
              <p className="text-xs md:text-sm text-text-secondary mt-1">
                Animals recently given names and recorded in our shared database
              </p>
            </div>
            <Button href="/explore" variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Directory
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} variant="editorial" />
            ))}
          </div>
        </section>

        {/* Section 3: Animals Without Smart Collars (Need Support) */}
        <section className="bg-cream/70 rounded-3xl p-8 md:p-12 border border-border-light space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-forest font-bold">
              NEIGHBOURHOOD INITIATIVE
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary mt-2">
              Waiting for Smart Collars
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-3 leading-relaxed">
              These dogs and cats are registered with a digital identity, but do not yet have an
              ESP32 GPS smart collar. Local sponsors and caregivers help fund and deploy collars
              for vulnerable street animals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uncollaredAnimals.slice(0, 3).map((animal) => (
              <AnimalCard key={animal.id} animal={animal} variant="editorial" />
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Button href="/register-animal" variant="primary">
              Register a New Street Animal
            </Button>
            <Button href="/about" variant="secondary">
              Learn About Collar Hardware
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
