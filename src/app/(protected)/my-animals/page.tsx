'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { Animal } from '@/types';

export default function MyAnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyAnimals() {
      try {
        const res = await fetch('/api/animals?limit=10');
        if (res.ok) {
          const json = await res.json();
          setAnimals(json.data.animals || []);
        }
      } catch (err) {
        console.error('Failed to load animals', err);
      } finally {
        setLoading(false);
      }
    }
    loadMyAnimals();
  }, []);

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
              CAREGIVER REGISTRY
            </span>
            <h1 className="font-display text-4xl text-text-primary mt-1">My Registered Animals</h1>
            <p className="text-xs md:text-sm text-text-secondary mt-1">
              Animals you have registered and monitor across your daily rounds.
            </p>
          </div>

          <Button href="/register-animal" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register Another Animal
          </Button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-text-secondary">Loading animals...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} variant="editorial" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

