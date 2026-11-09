'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { AnimalPhoto } from '@/types';
import { cn } from '@/lib/utils';

interface AnimalGalleryProps {
  primaryPhoto: string;
  photos?: AnimalPhoto[];
  animalName: string;
}

export const AnimalGallery: React.FC<AnimalGalleryProps> = ({
  primaryPhoto,
  photos = [],
  animalName,
}) => {
  // Collect all photos into a unified array
  const allImages = [
    { url: primaryPhoto, caption: `${animalName} — Primary Photo` },
    ...photos.map((p, idx) => ({
      url: p.url,
      caption: p.caption || `${animalName} — Photo ${idx + 2}`,
    })),
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Primary Focus Photo */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[16/10] md:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-cream border border-border cursor-pointer shadow-sm"
      >
        <Image
          src={allImages[activeIdx]?.url || primaryPhoto}
          alt={animalName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

        <button
          type="button"
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-text-primary hover:bg-white shadow-md transition-all group-hover:scale-105"
          aria-label="Expand image"
        >
          <Expand className="w-4 h-4" />
        </button>

        {allImages.length > 1 && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-mono">
            {activeIdx + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all',
                activeIdx === idx
                  ? 'border-forest ring-2 ring-forest/20 scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={img.url}
                alt={`${animalName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] w-full h-[70vh] rounded-xl overflow-hidden"
            >
              <Image
                src={allImages[activeIdx]?.url || primaryPhoto}
                alt={allImages[activeIdx]?.caption || animalName}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white/80 text-xs md:text-sm font-sans">
              {allImages[activeIdx]?.caption} ({activeIdx + 1} of {allImages.length})
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimalGallery;
