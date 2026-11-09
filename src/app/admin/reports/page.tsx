'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Ambulance,
  Activity,
  Search,
  Filter,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimalReport } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load emergency reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: AnimalReport['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filtered = reports.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.locality?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.reportedBy?.toLowerCase() || '').includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'injured':
        return { label: 'Medical Emergency', bg: 'bg-[#FF5470]', text: 'text-white' };
      case 'missing':
        return { label: 'Missing Animal', bg: 'bg-[#FF8A3D]', text: 'text-white' };
      case 'damaged_collar':
        return { label: 'Damaged Collar', bg: 'bg-[#8B6BFF]', text: 'text-white' };
      case 'missing_collar':
        return { label: 'Collar Detached', bg: 'bg-[#FFC93C]', text: 'text-[#241F4E]' };
      default:
        return { label: 'Assistance Needed', bg: 'bg-[#FFF7E8]', text: 'text-[#241F4E]' };
    }
  };

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
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5470] animate-ping" />
              <h1 className="font-display text-3xl md:text-4xl text-[#241F4E] font-bold">
                Emergency & Incident Triage
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#5F5A8C] mt-1 font-body">
              Active distress alerts, roadside emergencies, and collar maintenance tickets
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchReports}
              variant="secondary"
              size="sm"
              isLoading={loading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Incidents
            </Button>
            <Button href="/report-emergency" variant="primary" size="sm">
              + File Report
            </Button>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5F5A8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by description, location, or caregiver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEF1EA]/50 border-2 border-[#DFDFDF] rounded-xl text-xs sm:text-sm font-body text-[#241F4E] placeholder:text-[#5F5A8C] focus:outline-none focus:border-[#241F4E] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['all', 'open', 'under_review', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-[#241F4E] text-white shadow-xs'
                    : 'bg-[#FFF7E8] text-[#5F5A8C] hover:text-[#241F4E] border border-[#DFDFDF]'
                }`}
              >
                {status.replace('_', ' ')}
                <span className="ml-1.5 opacity-75 font-mono text-[10px]">
                  (
                  {
                    reports.filter((r) =>
                      status === 'all' ? true : r.status === status
                    ).length
                  }
                  )
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#4FCB77] mx-auto" />
            <h3 className="font-display text-xl text-[#241F4E] font-bold">All clear!</h3>
            <p className="text-xs text-[#5F5A8C] max-w-sm mx-auto font-body">
              There are currently no active emergency or welfare incidents in this view.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((report) => {
              const badge = getCategoryBadge(report.category);
              return (
                <div
                  key={report.id}
                  className="bg-white rounded-[24px] border-[3px] border-[#241F4E] shadow-[0_5px_0_#241F4E] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-[0_8px_0_#241F4E]"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`text-[11px] font-display font-bold px-3 py-1 rounded-full border border-[#241F4E] shadow-xs ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>

                      <span
                        className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          report.status === 'open'
                            ? 'bg-[#FF5470]/10 text-[#FF5470] border-[#FF5470]'
                            : report.status === 'under_review'
                            ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] border-[#FF8A3D]'
                            : 'bg-[#4FCB77]/10 text-[#2E9E5B] border-[#4FCB77]'
                        }`}
                      >
                        Status: {report.status.replace('_', ' ').toUpperCase()}
                      </span>

                      <span className="text-xs font-mono text-[#5F5A8C]">
                        {formatRelativeTime(report.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm font-body text-[#241F4E] font-medium leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F5A8C]">
                      {report.locality && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF8A3D]" />
                          <span>{report.locality}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <span>Reported by: <strong>{report.reportedBy || 'Anonymous'}</strong></span>
                      </div>

                      {report.animalId && (
                        <Link
                          href={`/animals/${report.animalId}`}
                          className="text-[#FF8A3D] font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          Target Animal ↗
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions / Dispatch Workflow */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 self-stretch md:self-auto justify-end">
                    {report.status !== 'under_review' && report.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(report.id, 'under_review')}
                        className="px-4 py-2 rounded-xl text-xs font-display font-bold bg-[#FF8A3D] text-white border-2 border-[#241F4E] shadow-xs hover:bg-[#FF8A3D]/90 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Ambulance className="w-3.5 h-3.5" /> Dispatch Rescue
                      </button>
                    )}

                    {report.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                        className="px-4 py-2 rounded-xl text-xs font-display font-bold bg-[#4FCB77] text-white border-2 border-[#241F4E] shadow-xs hover:bg-[#2E9E5B] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    )}

                    {report.latitude && report.longitude && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-display font-bold bg-white text-[#241F4E] border-2 border-[#DFDFDF] hover:border-[#241F4E] transition-all flex items-center justify-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#FF8A3D]" /> Map Location
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
