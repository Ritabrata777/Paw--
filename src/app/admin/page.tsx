'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Radio,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Battery,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Activity,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TrackingBadge, SightingBadge, SpeciesBadge } from '@/components/ui/Badge';
import { Animal, Device, Sighting, CommunityStats } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, dRes, aRes, stRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/devices'),
        fetch('/api/animals?limit=10'),
        fetch('/api/sightings?limit=10'),
      ]);

      if (sRes.ok) setStats((await sRes.json()).data);
      if (dRes.ok) setDevices((await dRes.json()).data || []);
      if (aRes.ok) setAnimals((await aRes.json()).data.animals || []);
      if (stRes.ok) setSightings((await stRes.json()).data || []);
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest" />
              <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
                PLATFORM COMMAND & TELEMETRY
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-text-primary mt-1">
              Pawthik (Paw-থিক) Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchAdminData}
              variant="secondary"
              size="sm"
              isLoading={loading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Mesh
            </Button>
            <Button href="/tracking" variant="outline-sage" size="sm">
              Live Map
            </Button>
          </div>
        </div>

        {/* Admin Quick Module Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/animals"
            className="p-4 rounded-2xl bg-white border-2 border-[#DFDFDF] hover:border-[#241F4E] hover:shadow-[0_4px_0_#241F4E] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-[#5F5A8C] group-hover:text-[#241F4E]">
                Animals Registry
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#5F5A8C] group-hover:text-[#FF8A3D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 text-xl font-display font-extrabold text-[#241F4E]">
              {stats?.totalAnimals ?? 8} Profiles
            </div>
          </Link>

          <Link
            href="/admin/devices"
            className="p-4 rounded-2xl bg-white border-2 border-[#DFDFDF] hover:border-[#241F4E] hover:shadow-[0_4px_0_#241F4E] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-[#5F5A8C] group-hover:text-[#241F4E]">
                Collar Fleet
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#5F5A8C] group-hover:text-[#4FCB77] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 text-xl font-display font-extrabold text-[#241F4E]">
              {devices.length} Devices
            </div>
          </Link>

          <Link
            href="/admin/sightings"
            className="p-4 rounded-2xl bg-white border-2 border-[#DFDFDF] hover:border-[#241F4E] hover:shadow-[0_4px_0_#241F4E] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-[#5F5A8C] group-hover:text-[#241F4E]">
                Sightings Queue
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#5F5A8C] group-hover:text-[#FF8A3D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 text-xl font-display font-extrabold text-[#241F4E]">
              {stats?.totalSightings ?? 28} Verified
            </div>
          </Link>

          <Link
            href="/admin/reports"
            className="p-4 rounded-2xl bg-white border-2 border-[#DFDFDF] hover:border-[#241F4E] hover:shadow-[0_4px_0_#241F4E] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-[#5F5A8C] group-hover:text-[#241F4E]">
                Emergency Triage
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#5F5A8C] group-hover:text-[#FF5470] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 text-xl font-display font-extrabold text-[#241F4E]">
              Incidents
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="p-4 rounded-2xl bg-white border-2 border-[#DFDFDF] hover:border-[#241F4E] hover:shadow-[0_4px_0_#241F4E] transition-all flex flex-col justify-between group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-[#5F5A8C] group-hover:text-[#241F4E]">
                Caregivers
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#5F5A8C] group-hover:text-[#8B6BFF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 text-xl font-display font-extrabold text-[#241F4E]">
              {stats?.communityMembers ?? 142} Members
            </div>
          </Link>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Total Animals
            </span>
            <div className="font-display text-3xl text-forest mt-1">
              {stats?.totalAnimals ?? 8}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">Dogs / Cats</span>
            <div className="font-display text-2xl text-text-primary mt-1">
              {stats?.totalDogs ?? 5} / {stats?.totalCats ?? 3}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Online Collars
            </span>
            <div className="font-display text-3xl text-status-online mt-1">
              {devices.filter((d) => d.status === 'online').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Offline Collars
            </span>
            <div className="font-display text-3xl text-status-offline mt-1">
              {devices.filter((d) => d.status === 'offline').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Sightings Logged
            </span>
            <div className="font-display text-3xl text-orange mt-1">
              {stats?.totalSightings ?? 28}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
            <span className="text-[11px] font-mono uppercase text-text-tertiary">
              Active Caregivers
            </span>
            <div className="font-display text-3xl text-text-primary mt-1">
              {stats?.communityMembers ?? 142}
            </div>
          </div>
        </div>

        {/* Device Fleet Status Table */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-border-light shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-text-primary">
                ESP32 GPS Collar Fleet
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Real-time telemetry heartbeat and hardware status
              </p>
            </div>
            <span className="text-xs font-mono text-forest bg-cream px-3 py-1.5 rounded-full border border-border">
              MQTT: broker.pawtrace.local:1883
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-light text-[11px] font-mono uppercase text-text-tertiary">
                <tr>
                  <th className="pb-3">Device Identifier</th>
                  <th className="pb-3">Assigned Animal</th>
                  <th className="pb-3">Telemetry State</th>
                  <th className="pb-3">Battery Voltage</th>
                  <th className="pb-3">Firmware</th>
                  <th className="pb-3">Last Heartbeat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light font-body">
                {devices.map((device) => {
                  const assigned = animals.find((a) => a.deviceId === device.deviceId);
                  return (
                    <tr key={device.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-3.5 font-mono font-semibold text-text-primary">
                        {device.deviceId}
                      </td>
                      <td className="py-3.5">
                        {assigned ? (
                          <Link
                            href={`/animals/${assigned.id}`}
                            className="text-forest font-medium hover:underline flex items-center gap-1"
                          >
                            {assigned.name} ({assigned.pawtraceId})
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-text-tertiary italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            device.status === 'online'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              device.status === 'online' ? 'bg-green-500' : 'bg-zinc-400'
                            }`}
                          />
                          {device.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-text-secondary">
                        {device.batteryLevel ? `${device.batteryLevel}%` : 'N/A'}
                      </td>
                      <td className="py-3.5 font-mono text-text-secondary">
                        v{device.firmwareVersion || '1.0.3'}
                      </td>
                      <td className="py-3.5 text-text-secondary">
                        {device.lastSeenAt ? formatRelativeTime(device.lastSeenAt) : 'Never'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sighting Moderation Queue */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-border-light shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-text-primary">
                Sighting Moderation Queue
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Incoming community spottings awaiting verification
              </p>
            </div>
            <Link href="/sightings" className="text-xs text-forest hover:underline font-semibold">
              View Public Sighting Feed →
            </Link>
          </div>

          <div className="divide-y divide-border-light">
            {sightings.map((s) => (
              <div key={s.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SpeciesBadge species={s.species} />
                    <span className="text-xs font-semibold text-text-primary">{s.locality}</span>
                    <SightingBadge status={s.status} size="sm" />
                  </div>
                  {s.notes && (
                    <p className="text-xs text-text-secondary italic">"{s.notes}"</p>
                  )}
                  <div className="text-[10px] text-text-tertiary">
                    Logged {formatDate(s.sightedAt)} ({formatRelativeTime(s.sightedAt)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-full bg-forest/10 hover:bg-forest text-forest hover:text-cream text-xs font-semibold transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1.5 rounded-full bg-cream hover:bg-red-50 text-text-secondary hover:text-red-700 text-xs transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

