'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  Edit,
  Radio,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpeciesBadge, TrackingBadge } from '@/components/ui/Badge';
import { Animal } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminAnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnimals() {
      try {
        const res = await fetch('/api/animals?limit=100');
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
    fetchAnimals();
  }, []);

  const filtered = animals.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.pawtraceId.toLowerCase().includes(search.toLowerCase()) ||
      a.locality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EEF1EA] pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-8">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#DFDFDF] pb-6">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#5F5A8C] hover:text-[#241F4E] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
            </Link>
            <h1 className="font-display text-3xl md:text-4xl text-[#241F4E]">
              Animal Identity Management
            </h1>
            <p className="text-xs text-[#5F5A8C] font-body mt-1">
              Registered animals, hardware bindings, and digital IDs across all colonies.
            </p>
          </div>

          <Button href="/register-animal" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register New Animal
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[24px] border-2 border-[#241F4E] shadow-[0_4px_0_#241F4E] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#5F5A8C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search animals by name, Pawthik ID, or locality..."
            className="w-full bg-transparent text-sm font-body text-[#202820] focus:outline-none placeholder:text-[#5F5A8C]"
          />
        </div>

        {/* Animals Table Card */}
        <div className="bg-white rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_8px_0_#241F4E] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-body">
              <thead className="border-b-2 border-[#241F4E] bg-[#FFF7E8] text-xs font-display uppercase tracking-wider text-[#5F5A8C]">
                <tr>
                  <th className="p-4">Animal</th>
                  <th className="p-4">Pawthik ID</th>
                  <th className="p-4">Species</th>
                  <th className="p-4">Locality</th>
                  <th className="p-4">Smart Collar</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDFDF]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-[#5F5A8C]">
                      Loading animal records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-[#5F5A8C]">
                      No animals found matching search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((animal) => (
                    <tr key={animal.id} className="hover:bg-[#FFF7E8]/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-[12px] overflow-hidden bg-[#FFF7E8] border border-[#DFDFDF] shrink-0">
                            <Image
                              src={animal.primaryPhoto || '/images/animals/dog-1.jpg'}
                              alt={animal.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-display font-bold text-[#241F4E]">
                            {animal.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs font-bold text-[#5F5A8C]">
                        {animal.pawtraceId}
                      </td>
                      <td className="p-4">
                        <SpeciesBadge species={animal.species} />
                      </td>
                      <td className="p-4 text-xs text-[#5F5A8C]">{animal.locality}</td>
                      <td className="p-4 font-mono text-xs">
                        {animal.deviceId ? (
                          <span className="text-[#241F4E] font-bold flex items-center gap-1">
                            <Radio className="w-3 h-3 text-[#2E9E5B]" /> {animal.deviceId}
                          </span>
                        ) : (
                          <span className="text-[#B7B2DC] italic">None</span>
                        )}
                      </td>
                      <td className="p-4">
                        <TrackingBadge status={animal.trackingStatus} size="sm" />
                      </td>
                      <td className="p-4 text-xs text-[#5F5A8C]">
                        {formatDate(animal.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/animals/${animal.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF7E8] border border-[#241F4E] text-xs font-display font-bold text-[#241F4E] hover:bg-[#FF8A3D] hover:text-white transition-colors"
                        >
                          Profile <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

