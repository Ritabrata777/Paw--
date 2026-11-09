'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { Animal } from '@/types';

export default function SavedAnimalsPage() {
  const [savedAnimals, setSavedAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        const res = await fetch('/api/saved?userId=user-001');
        if (res.ok) {
          const json = await res.json();
          // Fallback to sample animals if empty
          if (json.data && json.data.length > 0) {
            setSavedAnimals(json.data.map((item: any) => item.animal).filter(Boolean));
          } else {
            // Load 2 sample animals to display
            const aRes = await fetch('/api/animals?limit=3');
            if (aRes.ok) {
              const aJson = await aRes.json();
              setSavedAnimals(aJson.data.animals?.slice(0, 2) || []);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load saved animals', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleRemove = (animalId: string) => {
    setSavedAnimals((prev) => prev.filter((a) => a.id !== animalId));
  };

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
            CAREGIVER BOOKMARKS
          </span>
          <h1 className="font-display text-4xl text-text-primary mt-2">Saved Animal Carelist</h1>
          <p className="text-xs md:text-sm text-text-secondary max-w-xl mt-2">
            Keep quick watch over specific neighbourhood friends. Receive notifications whenever a
            community sighting is logged.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-text-secondary">Loading carelist...</div>
        ) : savedAnimals.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl p-8 border border-border max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto text-orange">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-text-primary">Your Carelist is Empty</h3>
            <p className="text-xs text-text-secondary">
              Browse the animal directory and tap the heart icon on any animal to keep tabs on them.
            </p>
            <Button href="/explore" variant="primary" size="sm">
              Explore Directory
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedAnimals.map((animal) => (
              <div key={animal.id} className="relative group">
                <AnimalCard animal={animal} variant="editorial" isSaved={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

