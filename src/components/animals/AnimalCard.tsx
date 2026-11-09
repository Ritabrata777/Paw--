'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Radio, Heart, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Animal } from '@/types';
import { Badge, TrackingBadge, SpeciesBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface AnimalCardProps {
  animal: Animal;
  variant?: 'default' | 'featured' | 'compact' | 'editorial';
  priority?: boolean;
  className?: string;
  isSaved?: boolean;
  onToggleSave?: (animalId: string) => void;
}

// Curated authentic photography for street dogs and community cats
const FALLBACK_PHOTOS: Record<string, string> = {
  'PT-00001': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
  'PT-00002': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
  'PT-00003': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
  'PT-00004': 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=800',
  'PT-00005': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800',
  'PT-00006': 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=800',
  'PT-00007': 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800',
  'PT-00008': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
  dog: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
  cat: 'https://images.unsplash.com/photo-1513360309081-36f20ca48f2b?auto=format&fit=crop&q=80&w=800',
};

export const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  variant = 'default',
  priority = false,
  className,
  isSaved = false,
  onToggleSave,
}) => {
  const [imgError, setImgError] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const imgSrc =
    imgError || !animal.primaryPhoto || animal.primaryPhoto.startsWith('/images/')
      ? FALLBACK_PHOTOS[animal.pawtraceId] ||
        (animal.species === 'cat' ? FALLBACK_PHOTOS.cat : FALLBACK_PHOTOS.dog)
      : animal.primaryPhoto;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    if (onToggleSave) onToggleSave(animal.id);
  };

  // Compact variant (Sidebar / lists)
  if (variant === 'compact') {
    return (
      <Link
        href={`/animals/${animal.id}`}
        className={cn(
          'group flex items-center gap-3.5 p-3 rounded-[20px] bg-white hover:bg-[#FFF7E8] border-2 border-[#DFDFDF] hover:border-[#241F4E] transition-all duration-150 shadow-[0_3px_0_#DFDFDF] hover:shadow-[0_4px_0_#241F4E]',
          className
        )}
      >
        <div className="relative w-14 h-14 rounded-[14px] overflow-hidden shrink-0 bg-[#FFF7E8] border border-[#DFDFDF]">
          <Image
            src={imgSrc}
            alt={animal.name}
            fill
            sizes="56px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-base font-bold text-[#241F4E] group-hover:text-[#FF8A3D] transition-colors truncate">
              {animal.name}
            </h4>
            <span className="text-[11px] font-mono text-[#5F5A8C]">
              {animal.pawtraceId}
            </span>
          </div>
          <p className="text-xs text-[#5F5A8C] truncate flex items-center gap-1 mt-0.5 font-body">
            <MapPin className="w-3 h-3 shrink-0 text-[#FF8A3D]" />
            {animal.locality}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <TrackingBadge status={animal.trackingStatus} size="sm" />
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-[#5F5A8C] group-hover:text-[#241F4E]" />
      </Link>
    );
  }

  // Editorial variant (Used in asymmetric grids on homepage & explore)
  if (variant === 'editorial') {
    return (
      <div
        className={cn(
          'group relative flex flex-col bg-white rounded-[32px] overflow-hidden border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] hover:-translate-y-1 hover:shadow-[0_10px_0_#241F4E] transition-all duration-150',
          className
        )}
      >
        <Link href={`/animals/${animal.id}`} className="flex flex-col h-full">
          {/* Photo container */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF7E8] border-b-2 border-[#241F4E]">
            <Image
              src={imgSrc}
              alt={animal.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <SpeciesBadge species={animal.species} />
              <button
                type="button"
                onClick={handleHeartClick}
                className="w-9 h-9 rounded-full bg-white border-2 border-[#241F4E] flex items-center justify-center text-[#241F4E] shadow-[0_2px_0_#241F4E] hover:scale-105 transition-all"
                aria-label="Save animal"
              >
                <Heart
                  className={cn(
                    'w-4 h-4 transition-colors',
                    saved ? 'fill-[#FF5470] text-[#FF5470]' : 'text-[#241F4E]'
                  )}
                />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 z-10">
              <TrackingBadge status={animal.trackingStatus} size="sm" />
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col flex-1 justify-between bg-white">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h3 className="font-display text-2xl font-bold text-[#241F4E] group-hover:text-[#FF8A3D] transition-colors">
                  {animal.name}
                </h3>
                <span className="text-[12px] font-mono font-bold tracking-wider text-[#5F5A8C] px-2 py-0.5 rounded-full bg-[#FFF7E8] border border-[#DFDFDF]">
                  {animal.pawtraceId}
                </span>
              </div>
              <p className="text-xs text-[#5F5A8C] flex items-center gap-1.5 mb-2.5 font-body">
                <MapPin className="w-3.5 h-3.5 text-[#FF8A3D] shrink-0" />
                <span className="truncate">{animal.locality}</span>
              </p>
              {animal.description && (
                <p className="text-xs text-[#5F5A8C] line-clamp-2 leading-relaxed font-body">
                  {animal.description}
                </p>
              )}
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#DFDFDF] flex items-center justify-between text-xs font-display font-bold text-[#241F4E] group-hover:text-[#FF8A3D]">
              <span>View Live Map & Movement</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'group relative bg-white rounded-[24px] overflow-hidden border-2 border-[#DFDFDF] hover:border-[#241F4E] shadow-[0_4px_0_#DFDFDF] hover:shadow-[0_6px_0_#241F4E] transition-all duration-150',
        className
      )}
    >
      <Link href={`/animals/${animal.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF7E8]">
          <Image
            src={imgSrc}
            alt={animal.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <SpeciesBadge species={animal.species} />
          </div>
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              type="button"
              onClick={handleHeartClick}
              className="w-8 h-8 rounded-full bg-white border-2 border-[#241F4E] flex items-center justify-center text-[#241F4E] transition-all shadow-xs"
              aria-label="Save animal"
            >
              <Heart
                className={cn(
                  'w-3.5 h-3.5',
                  saved ? 'fill-[#FF5470] text-[#FF5470]' : 'text-[#241F4E]'
                )}
              />
            </button>
          </div>
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <TrackingBadge status={animal.trackingStatus} size="sm" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-display text-xl font-bold text-[#241F4E] group-hover:text-[#FF8A3D] transition-colors truncate">
              {animal.name}
            </h4>
            <span className="text-[11px] font-mono text-[#5F5A8C] shrink-0 font-bold">
              {animal.pawtraceId}
            </span>
          </div>
          <p className="text-xs text-[#5F5A8C] flex items-center gap-1 mt-1 truncate font-body">
            <MapPin className="w-3.5 h-3.5 text-[#FF8A3D] shrink-0" />
            {animal.locality}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default AnimalCard;
