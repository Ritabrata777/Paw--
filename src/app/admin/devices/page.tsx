'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Radio,
  Battery,
  Clock,
  Compass,
  Cpu,
  RefreshCw,
  Plus,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Device, Animal } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dRes, aRes] = await Promise.all([
        fetch('/api/devices'),
        fetch('/api/animals?limit=100'),
      ]);
      if (dRes.ok) setDevices((await dRes.json()).data || []);
      if (aRes.ok) setAnimals((await aRes.json()).data.animals || []);
    } catch (err) {
      console.error('Failed to load device telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF1EA] pt-28 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#DFDFDF] pb-6">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#5F5A8C] hover:text-[#241F4E] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
            </Link>
            <h1 className="font-display text-3xl md:text-4xl text-[#241F4E]">
              Collar Hardware Fleet
            </h1>
            <p className="text-xs text-[#5F5A8C] font-body mt-1">
              Real-time telemetry heartbeat, battery voltage, and firmware status across active collars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchData}
              variant="secondary"
              size="sm"
              isLoading={loading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Mesh
            </Button>
            <Button href="/tracking" variant="primary" size="sm">
              Live Map
            </Button>
          </div>
        </div>

        {/* Fleet Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_4px_0_#241F4E]">
            <span className="text-[11px] font-display uppercase tracking-wider text-[#5F5A8C] font-bold">
              Total Collars
            </span>
            <div className="font-display text-3xl font-extrabold text-[#241F4E] mt-1">
              {devices.length}
            </div>
            <p className="text-[11px] text-[#5F5A8C] mt-1 font-body">Registered in fleet database</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_4px_0_#241F4E]">
            <span className="text-[11px] font-display uppercase tracking-wider text-[#5F5A8C] font-bold">
              Live Online
            </span>
            <div className="font-display text-3xl font-extrabold text-[#2E9E5B] mt-1">
              {devices.filter((d) => d.status === 'online').length}
            </div>
            <p className="text-[11px] text-[#5F5A8C] mt-1 font-body">Active GPS telemetry link</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_4px_0_#241F4E]">
            <span className="text-[11px] font-display uppercase tracking-wider text-[#5F5A8C] font-bold">
              Standby / Offline
            </span>
            <div className="font-display text-3xl font-extrabold text-[#5F5A8C] mt-1">
              {devices.filter((d) => d.status === 'offline').length}
            </div>
            <p className="text-[11px] text-[#5F5A8C] mt-1 font-body">Sleeping or awaiting recharge</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_4px_0_#241F4E]">
            <span className="text-[11px] font-display uppercase tracking-wider text-[#5F5A8C] font-bold">
              Avg Battery
            </span>
            <div className="font-display text-3xl font-extrabold text-[#FF8A3D] mt-1">
              78%
            </div>
            <p className="text-[11px] text-[#5F5A8C] mt-1 font-body">LiPo 500mAh cells</p>
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_8px_0_#241F4E] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-body">
              <thead className="border-b-2 border-[#241F4E] bg-[#FFF7E8] text-xs font-display uppercase tracking-wider text-[#5F5A8C]">
                <tr>
                  <th className="p-4">Device ID</th>
                  <th className="p-4">Assigned Animal</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Battery Level</th>
                  <th className="p-4">Firmware</th>
                  <th className="p-4">Last Telemetry Fix</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDFDF]">
                {devices.map((device) => {
                  const assigned = animals.find((a) => a.deviceId === device.deviceId);
                  return (
                    <tr key={device.id} className="hover:bg-[#FFF7E8]/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#241F4E]">
                        {device.deviceId}
                      </td>
                      <td className="p-4">
                        {assigned ? (
                          <Link
                            href={`/animals/${assigned.id}`}
                            className="font-display font-bold text-[#241F4E] hover:text-[#FF8A3D] flex items-center gap-1"
                          >
                            {assigned.name} ({assigned.pawtraceId})
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="text-[#B7B2DC] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold border ${
                            device.status === 'online'
                              ? 'bg-[#4FCB77]/20 text-[#241F4E] border-[#4FCB77]'
                              : 'bg-[#DFDFDF]/50 text-[#5F5A8C] border-[#DFDFDF]'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              device.status === 'online' ? 'bg-[#4FCB77] animate-pulse' : 'bg-[#5F5A8C]'
                            }`}
                          />
                          {device.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {device.batteryLevel ? (
                          <span className="flex items-center gap-1.5 font-bold">
                            <Battery
                              className={`w-4 h-4 ${
                                device.batteryLevel > 30 ? 'text-[#2E9E5B]' : 'text-[#FF5470]'
                              }`}
                            />
                            {device.batteryLevel}%
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs text-[#5F5A8C]">
                        v{device.firmwareVersion || '1.0.3'}
                      </td>
                      <td className="p-4 text-xs text-[#5F5A8C]">
                        {device.lastSeenAt ? formatRelativeTime(device.lastSeenAt) : 'Never'}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href="/tracking"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF7E8] border border-[#241F4E] text-xs font-display font-bold text-[#241F4E] hover:bg-[#FF8A3D] hover:text-white transition-colors"
                        >
                          Track on Map
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

