'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, X, Filter, Grid, List, MapPin, Radio, Loader2, Sparkles } from 'lucide-react';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { Button } from '@/components/ui/Button';
import { Animal } from '@/types';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'dog' | 'cat' | 'gps' | 'no_collar';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchAnimals() {
      setLoading(true);
      try {
        let url = `/api/animals?`;
        const params = new URLSearchParams();

        if (debouncedSearch.trim()) {
          params.append('search', debouncedSearch.trim());
        }

        if (activeFilter === 'dog' || activeFilter === 'cat') {
          params.append('species', activeFilter);
        } else if (activeFilter === 'gps') {
          params.append('hasDevice', 'true');
        } else if (activeFilter === 'no_collar') {
          params.append('hasDevice', 'false');
        }

        const res = await fetch(`/api/animals?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setAnimals(json.data.animals || []);
          setTotalCount(json.data.total || 0);
        }
      } catch (err) {
        console.error('Failed to load animals', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimals();
  }, [debouncedSearch, activeFilter]);

  return (
    <div className="min-h-screen bg-[#EEF1EA] pt-28 pb-24 font-body">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7E8] border-2 border-[#241F4E] text-xs font-display font-bold text-[#FF8A3D] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
            <span>NEIGHBOURHOOD DIRECTORY</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-[#241F4E] font-extrabold tracking-tight">
            Explore Registered Animals
          </h1>
          <p className="text-[#5F5A8C] text-base md:text-lg mt-3 leading-relaxed">
            Search for local dogs and cats by their name, unique Pawthik ID, or street locality.
            Every registered friend has an ongoing story.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-6 mb-12">
          {/* Main Search Input */}
          <div className="relative max-w-3xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#5F5A8C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a local friend by name (e.g. Bholu), Pawthik ID, or locality..."
              className="w-full pl-12 pr-12 py-4 bg-white rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] text-sm font-body text-[#241F4E] placeholder:text-[#5F5A8C] focus:outline-none focus:shadow-[0_7px_0_#241F4E] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-[#5F5A8C] hover:text-[#241F4E] bg-[#EEF1EA] rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills & View Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#DFDFDF]">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer',
                  activeFilter === 'all'
                    ? 'bg-[#241F4E] text-white border-2 border-[#241F4E] shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border-2 border-[#DFDFDF]'
                )}
              >
                All Animals
              </button>
              <button
                onClick={() => setActiveFilter('dog')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer',
                  activeFilter === 'dog'
                    ? 'bg-[#241F4E] text-white border-2 border-[#241F4E] shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border-2 border-[#DFDFDF]'
                )}
              >
                🐕 Dogs Only
              </button>
              <button
                onClick={() => setActiveFilter('cat')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer',
                  activeFilter === 'cat'
                    ? 'bg-[#241F4E] text-white border-2 border-[#241F4E] shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border-2 border-[#DFDFDF]'
                )}
              >
                🐈 Cats Only
              </button>
              <button
                onClick={() => setActiveFilter('gps')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                  activeFilter === 'gps'
                    ? 'bg-[#241F4E] text-white border-2 border-[#241F4E] shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border-2 border-[#DFDFDF]'
                )}
              >
                <Radio className="w-3.5 h-3.5 text-[#4FCB77]" /> GPS Connected
              </button>
              <button
                onClick={() => setActiveFilter('no_collar')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer',
                  activeFilter === 'no_collar'
                    ? 'bg-[#241F4E] text-white border-2 border-[#241F4E] shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border-2 border-[#DFDFDF]'
                )}
              >
                No Collar
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border-2 border-[#241F4E] shadow-xs self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer',
                  viewMode === 'grid' ? 'bg-[#241F4E] text-white' : 'text-[#5F5A8C] hover:text-[#241F4E]'
                )}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer',
                  viewMode === 'list' ? 'bg-[#241F4E] text-white' : 'text-[#5F5A8C] hover:text-[#241F4E]'
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#5F5A8C] mb-8 font-mono">
          <span>
            Showing <strong className="text-[#241F4E]">{animals.length}</strong> of{' '}
            <strong className="text-[#241F4E]">{totalCount}</strong> registered animals
          </span>
          {debouncedSearch && (
            <span>
              Searching for: "<em className="text-[#FF8A3D]">{debouncedSearch}</em>"
            </span>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-forest" />
            <p className="text-sm text-text-secondary">Searching animal registry...</p>
          </div>
        ) : animals.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-white rounded-3xl p-8 border border-border-light">
            <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto text-forest">
              <Search className="w-6 h-6 text-sage" />
            </div>
            <h3 className="font-display text-2xl text-text-primary">No Animals Found</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We couldn't find any dogs or cats matching your current filter or query. Try searching
              for another name or clear your filters.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setActiveFilter('all');
                }}
              >
                Reset Filters
              </Button>
              <Button href="/register-animal" size="sm" variant="primary">
                Register a New Animal
              </Button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} variant="editorial" />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl space-y-3">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

