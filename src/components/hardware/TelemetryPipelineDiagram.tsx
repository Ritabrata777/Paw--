'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Radio,
  Server,
  Database,
  Smartphone,
  ArrowRight,
  ArrowDown,
  Check,
  Copy,
  Shield,
  Eye,
  EyeOff,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PipelineStep {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  borderColor: string;
  details: {
    technology: string;
    throughput: string;
    security: string;
    description: string;
  };
}

export default function TelemetryPipelineDiagram() {
  const [activeStep, setActiveStep] = useState<string>('collar');
  const [copied, setCopied] = useState(false);
  const [privacyMode, setPrivacyMode] = useState<'public' | 'caregiver'>('public');

  const steps: PipelineStep[] = [
    {
      id: 'collar',
      number: '01',
      title: 'ESP32 Smart Collar',
      subtitle: 'u-blox NEO-6M GNSS + ESP32',
      badge: 'Edge Hardware',
      icon: <Cpu className="w-5 h-5" />,
      color: '#FF8A3D',
      bgLight: 'bg-[#FF8A3D]/10',
      borderColor: 'border-[#FF8A3D]',
      details: {
        technology: 'ESP32 Tensilica Dual-Core + NEO-6M GNSS receiver + LiPo 500mAh',
        throughput: '10s (Live Mode) / 5 min (Deep Sleep Standby)',
        security: 'Hardware serial UART2 (pins 16/17), hardware voltage divider on ADC34',
        description:
          'Acquires multi-satellite GNSS fix (<2.5m accuracy), measures battery voltage, packages NMEA sentences into compact binary/JSON, and wakes Wi-Fi/cellular radio.',
      },
    },
    {
      id: 'mqtt',
      number: '02',
      title: 'MQTT Ingestion Broker',
      subtitle: 'pawthik/telemetry/{id}',
      badge: '4G LTE-M / Wi-Fi',
      icon: <Radio className="w-5 h-5" />,
      color: '#8B6BFF',
      bgLight: 'bg-[#8B6BFF]/10',
      borderColor: 'border-[#8B6BFF]',
      details: {
        technology: 'Mosquitto / EMQX Broker over TCP with TLS 1.3 encryption',
        throughput: 'Sub-50ms message latency, QoS Level 1 (guaranteed delivery)',
        security: 'Per-device X.509 client certificate authentication & ACL topics',
        description:
          'Ultra-low overhead publish-subscribe transport. Consumes minimal cellular data (~2KB per day) allowing months of operation on low-cost IoT SIM plans.',
      },
    },
    {
      id: 'engine',
      number: '03',
      title: 'Validation & Fuzzing API',
      subtitle: 'Next.js App Engine',
      badge: 'Backend Microservice',
      icon: <Server className="w-5 h-5" />,
      color: '#2E9E5B',
      bgLight: 'bg-[#2E9E5B]/10',
      borderColor: 'border-[#2E9E5B]',
      details: {
        technology: 'Next.js 16 Route Handlers + TypeScript schema validation',
        throughput: 'Processes >1,000 telemetry payloads/second concurrently',
        security: 'Timestamp freshness validation, anti-spoofing coordinate sanity check',
        description:
          'Validates latitude/longitude bounds, detects geofence boundary breaches, alerts caregivers, and applies differential privacy fuzzing (~200m) for public views.',
      },
    },
    {
      id: 'database',
      number: '04',
      title: 'PostgreSQL & Timescale',
      subtitle: 'Spatial Time-Series',
      badge: 'Relational DB',
      icon: <Database className="w-5 h-5" />,
      color: '#241F4E',
      bgLight: 'bg-[#241F4E]/10',
      borderColor: 'border-[#241F4E]',
      details: {
        technology: 'PostgreSQL with PostGIS extensions & TimescaleDB hypertables',
        throughput: 'Sub-millisecond spatial queries via GiST indexing on coordinates',
        security: 'Row-Level Security (RLS) separating verified caregivers from public observers',
        description:
          'Persists immutable historical breadcrumb trails, collar battery degradation curves, and links device IDs to registered animal profiles and sightings.',
      },
    },
    {
      id: 'client',
      number: '05',
      title: 'Interactive Leaflet Canvas',
      subtitle: 'Caregiver Smartphone Map',
      badge: 'WebSockets / UI',
      icon: <Smartphone className="w-5 h-5" />,
      color: '#FF5470',
      bgLight: 'bg-[#FF5470]/10',
      borderColor: 'border-[#FF5470]',
      details: {
        technology: 'React-Leaflet, OpenStreetMap, HTML5 Canvas, WebSockets / SSE',
        throughput: '60fps GPU-accelerated animated breadcrumb route playback',
        security: 'Role-gated pinpoint reveals, one-tap 85dB collar audio chime trigger',
        description:
          'Renders live collar positions, displays safe-zone radius overlays, updates battery status indicators, and enables sound-finder beacons during night searches.',
      },
    },
  ];

  const samplePayload = `{
  "device_id": "PT-ESP32-001",
  "latitude": 22.572648,
  "longitude": 88.363912,
  "altitude": 12.5,
  "satellites": 8,
  "timestamp": "2026-11-09T10:30:00Z",
  "battery_level": 85,
  "firmware": "v1.0.3"
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedStep = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <div className="bg-white rounded-[36px] p-6 sm:p-10 md:p-12 border-[3px] border-[#241F4E] shadow-[0_8px_0_#241F4E] space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7E8] border-2 border-[#241F4E] text-xs font-display font-bold text-[#241F4E]">
          <Activity className="w-3.5 h-3.5 text-[#4FCB77] animate-pulse" />
          <span>Full Telemetry Lifecycle Architecture</span>
        </div>
        <h3 className="font-display text-3xl sm:text-4xl text-[#241F4E] font-extrabold">
          Telemetry Data Pipeline
        </h3>
        <p className="text-sm sm:text-base text-[#5F5A8C] font-body max-w-2xl leading-relaxed">
          From the collar’s ceramic GPS antenna on a neighbourhood dog to the live interactive
          browser map on your phone—engineered with open hardware and zero proprietary lock-in.
        </p>
      </div>

      {/* ============================================================
          1. INTERACTIVE PIPELINE FLOW DIAGRAM (Desktop & Mobile)
          ============================================================ */}
      <div className="space-y-4">
        <div className="text-xs font-display font-bold uppercase tracking-wider text-[#5F5A8C] flex items-center justify-between">
          <span>Click any node to inspect technical specifications</span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#2E9E5B]">
            ● End-to-End Latency: &lt;1.8s
          </span>
        </div>

        {/* Desktop Pipeline Row */}
        <div className="hidden xl:grid grid-cols-5 gap-3 relative">
          {steps.map((step, idx) => {
            const isSelected = activeStep === step.id;
            return (
              <div key={step.id} className="relative flex flex-col items-center">
                {/* Node Box */}
                <button
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-4 rounded-[24px] border-[3px] transition-all cursor-pointer relative z-10 flex flex-col justify-between h-[175px] ${
                    isSelected
                      ? `bg-[#FFF7E8] border-[#241F4E] shadow-[0_6px_0_#241F4E] -translate-y-1`
                      : 'bg-[#EEF1EA]/50 border-[#DFDFDF] hover:border-[#241F4E] hover:bg-white shadow-[0_2px_0_#DFDFDF]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white border-2 border-[#241F4E]"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.icon}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-[#5F5A8C]">
                        {step.number}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-[#241F4E] leading-tight mt-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] font-mono text-[#5F5A8C] mt-0.5 truncate">
                      {step.subtitle}
                    </p>
                  </div>

                  <span
                    className={`inline-block text-[10px] font-display font-bold px-2 py-0.5 rounded-full border self-start ${
                      isSelected
                        ? 'bg-[#241F4E] text-white border-[#241F4E]'
                        : 'bg-white text-[#5F5A8C] border-[#DFDFDF]'
                    }`}
                  >
                    {step.badge}
                  </span>
                </button>

                {/* Arrow connector between desktop nodes */}
                {idx < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white border-2 border-[#241F4E] flex items-center justify-center shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5 text-[#241F4E]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Pipeline Stacking */}
        <div className="xl:hidden flex flex-col gap-3">
          {steps.map((step, idx) => {
            const isSelected = activeStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-4 rounded-[20px] border-[3px] transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#FFF7E8] border-[#241F4E] shadow-[0_5px_0_#241F4E]'
                      : 'bg-white border-[#DFDFDF] hover:border-[#241F4E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white border-2 border-[#241F4E] shrink-0"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#5F5A8C]">
                          {step.number}
                        </span>
                        <h4 className="font-display text-base font-bold text-[#241F4E]">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs font-mono text-[#5F5A8C]">{step.subtitle}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-display font-bold px-2.5 py-1 rounded-full bg-[#FFF7E8] border border-[#241F4E] text-[#241F4E] shrink-0">
                    {step.badge}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div className="flex justify-center -my-1">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-[#241F4E] flex items-center justify-center">
                      <ArrowDown className="w-3.5 h-3.5 text-[#241F4E]" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          2. DETAILED NODE SPECIFICATION CARD (Interactive Drilldown)
          ============================================================ */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-[#FFF7E8] border-[3px] border-[#241F4E] shadow-[0_4px_0_#241F4E] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#241F4E]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-lg text-white flex items-center justify-center border-2 border-[#241F4E] text-xs font-bold"
              style={{ backgroundColor: selectedStep.color }}
            >
              {selectedStep.icon}
            </span>
            <h4 className="font-display text-lg sm:text-xl font-bold text-[#241F4E]">
              Stage {selectedStep.number}: {selectedStep.title} — Architecture Drilldown
            </h4>
          </div>
          <span className="font-mono text-xs font-bold text-[#FF8A3D] bg-white px-3 py-1 rounded-full border border-[#DFDFDF] self-start sm:self-auto">
            {selectedStep.badge}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#5F5A8C] font-body leading-relaxed">
          {selectedStep.details.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#DFDFDF]">
            <span className="text-[10px] font-display font-bold uppercase text-[#5F5A8C] block">
              Core Stack
            </span>
            <span className="text-xs font-bold text-[#241F4E] mt-0.5 block font-body">
              {selectedStep.details.technology}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#DFDFDF]">
            <span className="text-[10px] font-display font-bold uppercase text-[#5F5A8C] block">
              Cadence & Latency
            </span>
            <span className="text-xs font-bold text-[#2E9E5B] mt-0.5 block font-body">
              {selectedStep.details.throughput}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#DFDFDF]">
            <span className="text-[10px] font-display font-bold uppercase text-[#5F5A8C] block">
              Hardware Security
            </span>
            <span className="text-xs font-bold text-[#241F4E] mt-0.5 block font-body">
              {selectedStep.details.security}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          3. HIGH-CONTRAST JSON TERMINAL + LOCATION PRIVACY CONTROLLER
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Beautiful Dark Terminal for JSON Payload */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#241F4E] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF8A3D]" /> Live MQTT Telemetry Payload
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-full bg-[#FFF7E8] hover:bg-[#FF8A3D] hover:text-white border-2 border-[#241F4E] text-xs font-display font-bold text-[#241F4E] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E9E5B]" /> Copied JSON
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Payload
                </>
              )}
            </button>
          </div>

          {/* Terminal Box */}
          <div className="rounded-[24px] bg-[#171435] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] overflow-hidden">
            {/* Terminal Window Header */}
            <div className="px-4 py-3 bg-[#241F4E] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5470]" />
                <span className="w-3 h-3 rounded-full bg-[#FFC93C]" />
                <span className="w-3 h-3 rounded-full bg-[#4FCB77]" />
                <span className="text-[11px] font-mono text-[#B7B2DC] ml-2">
                  pawthik/telemetry/PT-ESP32-001
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#4FCB77] bg-[#4FCB77]/20 px-2 py-0.5 rounded-full border border-[#4FCB77]/30">
                ● 238 bytes
              </span>
            </div>

            {/* Code Body with High-Contrast Syntax Colors */}
            <pre className="p-5 font-mono text-xs text-[#FFF7E8] leading-relaxed overflow-x-auto">
              <code>
                <span className="text-[#B7B2DC]">{'{'}</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"device_id"</span>
                <span className="text-white">: </span>
                <span className="text-[#4FCB77]">"PT-ESP32-001"</span>
                <span className="text-white">,</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"latitude"</span>
                <span className="text-white">: </span>
                <span className="text-[#FFC93C]">22.572648</span>
                <span className="text-white">,</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"longitude"</span>
                <span className="text-white">: </span>
                <span className="text-[#FFC93C]">88.363912</span>
                <span className="text-white">,</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"altitude"</span>
                <span className="text-white">: </span>
                <span className="text-[#FFC93C]">12.5</span>
                <span className="text-white">,</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"satellites"</span>
                <span className="text-white">: </span>
                <span className="text-[#8B6BFF]">8</span>
                <span className="text-white">,</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"timestamp"</span>
                <span className="text-white">: </span>
                <span className="text-[#4FCB77]">"2026-11-09T10:30:00Z"</span>
                <span className="text-white">,</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"battery_level"</span>
                <span className="text-white">: </span>
                <span className="text-[#8B6BFF]">85</span>
                <span className="text-white">,</span>
                {'\n'}  <span className="text-[#FF8A3D] font-semibold">"firmware"</span>
                <span className="text-white">: </span>
                <span className="text-[#4FCB77]">"v1.0.3"</span>
                {'\n'}
                <span className="text-[#B7B2DC]">{'}'}</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Right: Animal Safety & Privacy Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#241F4E] flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#2E9E5B]" /> Animal Safety & Location Privacy
          </span>

          <div className="p-6 rounded-[28px] bg-[#EEF1EA] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-5">
            <div className="space-y-2">
              <h4 className="font-display text-lg font-bold text-[#241F4E]">
                Differential Coordinate Fuzzing
              </h4>
              <p className="text-xs text-[#5F5A8C] font-body leading-relaxed">
                To protect street animals from illicit capture, poaching, or abuse, public map
                views never expose exact GPS coordinates. The API automatically applies spatial
                fuzzing to ~200-meter accuracy.
              </p>
            </div>

            {/* Interactive Toggle Button */}
            <div className="flex p-1 rounded-full bg-white border-2 border-[#241F4E]">
              <button
                type="button"
                onClick={() => setPrivacyMode('public')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all ${
                  privacyMode === 'public'
                    ? 'bg-[#241F4E] text-white'
                    : 'text-[#5F5A8C] hover:text-[#241F4E]'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5 text-[#FFC93C]" /> Public View (~200m Fuzzed)
              </button>
              <button
                type="button"
                onClick={() => setPrivacyMode('caregiver')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all ${
                  privacyMode === 'caregiver'
                    ? 'bg-[#241F4E] text-white'
                    : 'text-[#5F5A8C] hover:text-[#241F4E]'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#4FCB77]" /> Verified Caregiver (Exact)
              </button>
            </div>

            {/* Interactive Coordinate Preview Badge */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#DFDFDF] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-bold text-[#5F5A8C]">
                  {privacyMode === 'public' ? 'Public Observers' : 'Registered Responders'}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    privacyMode === 'public'
                      ? 'bg-[#FFC93C]/30 text-[#241F4E]'
                      : 'bg-[#4FCB77]/25 text-[#2E9E5B]'
                  }`}
                >
                  {privacyMode === 'public' ? '3 Decimal Fuzz' : '6 Decimal Pinpoint'}
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-[#241F4E]">
                {privacyMode === 'public'
                  ? '22.573° N, 88.364° E (Approx. ~200m)'
                  : '22.572648° N, 88.363912° E (Exact)'}
              </div>
              <p className="text-[11px] text-[#5F5A8C] font-body">
                {privacyMode === 'public'
                  ? 'Safe for general community viewing without disclosing the animal’s exact resting hedge.'
                  : 'Requires verified caregiver login or emergency responder credentials.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

