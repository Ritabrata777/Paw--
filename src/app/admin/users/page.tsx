'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  Search,
  Filter,
  Mail,
  Calendar,
  CheckCircle,
  MoreVertical,
  Plus,
  Heart,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'caregiver' | 'field_volunteer' | 'shelter_staff' | 'admin';
  locality: string;
  animalsCared: number;
  sightingsCount: number;
  joinedDate: string;
  avatarUrl: string;
  verified: boolean;
}

const MOCK_USERS: AdminUserRecord[] = [
  {
    id: 'u-1',
    name: 'Ananya Sharma',
    email: 'ananya.s@pawtrace.org',
    role: 'admin',
    locality: 'Indiranagar, Bangalore',
    animalsCared: 14,
    sightingsCount: 48,
    joinedDate: '2025-08-12T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    verified: true,
  },
  {
    id: 'u-2',
    name: 'Dr. Rohan Verma',
    email: 'vet.rohan@pawtrace.org',
    role: 'shelter_staff',
    locality: 'Koramangala, Bangalore',
    animalsCared: 29,
    sightingsCount: 82,
    joinedDate: '2025-09-04T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    verified: true,
  },
  {
    id: 'u-3',
    name: 'Pooja Iyer',
    email: 'pooja.i@community.net',
    role: 'caregiver',
    locality: 'Jayanagar, Bangalore',
    animalsCared: 6,
    sightingsCount: 23,
    joinedDate: '2025-11-20T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    verified: true,
  },
  {
    id: 'u-4',
    name: 'Vikram Menon',
    email: 'vikram.rescue@gmail.com',
    role: 'field_volunteer',
    locality: 'Whitefield, Bangalore',
    animalsCared: 11,
    sightingsCount: 65,
    joinedDate: '2026-01-15T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    verified: true,
  },
  {
    id: 'u-5',
    name: 'Sunita Rao',
    email: 'sunita.rao99@yahoo.co.in',
    role: 'caregiver',
    locality: 'Malleshwaram, Bangalore',
    animalsCared: 3,
    sightingsCount: 12,
    joinedDate: '2026-02-10T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    verified: false,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>(MOCK_USERS);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const toggleVerify = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, verified: !u.verified } : u))
    );
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.locality.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#EEF1EA] pt-28 pb-24 font-body">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#DFDFDF] pb-6">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#5F5A8C] hover:text-[#241F4E] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B6BFF]" />
              <h1 className="font-display text-3xl md:text-4xl text-[#241F4E] font-bold">
                Caregivers & Community Network
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#5F5A8C] mt-1 font-body">
              Verified street caretakers, licensed veterinarians, and field rescue responders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button href="/community" variant="secondary" size="sm">
              Community Hub
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5F5A8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or neighbourhood..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEF1EA]/50 border-2 border-[#DFDFDF] rounded-xl text-xs sm:text-sm font-body text-[#241F4E] placeholder:text-[#5F5A8C] focus:outline-none focus:border-[#241F4E] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['all', 'caregiver', 'field_volunteer', 'shelter_staff', 'admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === role
                    ? 'bg-[#241F4E] text-white shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border border-[#DFDFDF]'
                }`}
              >
                {role.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table / Grid */}
        <div className="bg-white rounded-[28px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF7E8] border-b-2 border-[#241F4E] text-[#241F4E] font-display text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">User / Caregiver</th>
                  <th className="py-4 px-6">Role & Permissions</th>
                  <th className="py-4 px-6">Locality</th>
                  <th className="py-4 px-6">Registered Animals</th>
                  <th className="py-4 px-6">Sightings Logged</th>
                  <th className="py-4 px-6 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#EEF1EA] text-sm">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[#EEF1EA]/40 transition-colors">
                    {/* User Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#241F4E] shrink-0">
                          <Image src={u.avatarUrl} alt={u.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-[#241F4E] flex items-center gap-1.5">
                            {u.name}
                            {u.verified && (
                              <ShieldCheck className="w-4 h-4 text-[#4FCB77]" />
                            )}
                          </div>
                          <div className="text-xs text-[#5F5A8C] font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-display font-bold border ${
                          u.role === 'admin'
                            ? 'bg-[#241F4E] text-white border-[#241F4E]'
                            : u.role === 'shelter_staff'
                            ? 'bg-[#8B6BFF] text-white border-[#241F4E]'
                            : u.role === 'field_volunteer'
                            ? 'bg-[#FF8A3D] text-white border-[#241F4E]'
                            : 'bg-[#FFF7E8] text-[#241F4E] border-[#DFDFDF]'
                        }`}
                      >
                        {u.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    {/* Locality */}
                    <td className="py-4 px-6 text-xs text-[#5F5A8C] font-medium">
                      {u.locality}
                    </td>

                    {/* Animals Cared */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-xs bg-[#EEF1EA] px-2.5 py-1 rounded-lg border border-[#DFDFDF]">
                        {u.animalsCared} animals
                      </span>
                    </td>

                    {/* Sightings */}
                    <td className="py-4 px-6 font-mono text-xs text-[#5F5A8C]">
                      {u.sightingsCount} sightings
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => toggleVerify(u.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold border-2 transition-all cursor-pointer ${
                          u.verified
                            ? 'bg-[#4FCB77]/10 text-[#2E9E5B] border-[#4FCB77] hover:bg-[#FF5470] hover:text-white hover:border-[#241F4E]'
                            : 'bg-[#FFC93C] text-[#241F4E] border-[#241F4E] hover:bg-[#4FCB77] hover:text-white'
                        }`}
                      >
                        {u.verified ? 'Verified Caregiver' : 'Approve Verification'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

