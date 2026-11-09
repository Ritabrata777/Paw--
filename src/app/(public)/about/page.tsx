'use client';

import React from 'react';
import Image from 'next/image';
import {
  Cpu,
  Radio,
  Shield,
  Heart,
  Compass,
  Database,
  ArrowRight,
  Sparkles,
  Layers,
  Code,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TelemetryPipelineDiagram from '@/components/hardware/TelemetryPipelineDiagram';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-offwhite pt-32 pb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 space-y-24">
        {/* Editorial Hero */}
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-orange font-bold">
            OUR MISSION & PHILOSOPHY
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-text-primary leading-[1.12]">
            Some call them strays.{' '}
            <span className="italic font-normal text-forest">We call them neighbours.</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl font-body leading-relaxed">
            Pawthik (Paw-থিক) was conceived from an everyday observation in Indian cities: street dogs and
            cats share our streets, greet us in the mornings, and guard our shops. Yet they live
            without legal identities, medical records, or safety nets.
          </p>
        </div>

        {/* Narrative & Documentary Photography Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-cream">
              <Image
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=900"
                alt="Street dog resting by a neighbourhood shop"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-forest text-cream text-xs font-mono max-w-xs shadow-lg hidden sm:block">
              "Every animal deserves to be recognized by name, territory, and care."
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-text-secondary text-base md:text-lg leading-relaxed font-body">
            <h2 className="font-display text-3xl md:text-4xl text-text-primary">
              The Dignity of Recognition
            </h2>
            <p>
              When a neighbourhood dog is injured or lost, caregivers have no organized means to
              track their whereabouts or share updates. Animal birth control (ABC) programs and rabies
              vaccination drives frequently struggle to trace individual animals over time.
            </p>
            <p>
              Pawthik (Paw-থিক) changes this reality by granting every street dog and cat a digital identity.
              Through community registration, photo verification, and lightweight open-source smart
              collars, communities can pool their observations into a single, cohesive welfare map.
            </p>
            <p>
              Importantly, our platform does not rely exclusively on expensive electronics. An animal
              without a collar still benefits from a permanent Pawthik ID, community sighting
              logs, and caregiver coordination.
            </p>
          </div>
        </div>

        {/* ============================================================
            HARDWARE & IOT ARCHITECTURE SECTION
            ============================================================ */}
        <section className="bg-cream/60 rounded-3xl p-8 md:p-14 border border-border-light space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-forest font-bold">
              OPEN HARDWARE DESIGN
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary mt-2">
              The ESP32 & NEO-6M GPS Collar
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-3 leading-relaxed">
              Engineered with off-the-shelf micro-controllers for low cost, high repairability, and
              uncompromising animal safety.
            </p>
          </div>

          {/* Component Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border-light space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                <Cpu className="w-5 h-5 text-forest" />
              </div>
              <h3 className="font-display text-lg text-text-primary">ESP32 MCU</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Dual-core Tensilica processor with integrated Wi-Fi & BLE. Deep sleep power
                management enables weeks of intermittent tracking on small LiPo cells.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-light space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                <Compass className="w-5 h-5 text-forest" />
              </div>
              <h3 className="font-display text-lg text-text-primary">u-blox NEO-6M</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                High-sensitivity GNSS receiver with ceramic patch antenna. Captures accurate
                satellite fixes across 50 channels with rapid time-to-first-fix.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-light space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                <Radio className="w-5 h-5 text-forest" />
              </div>
              <h3 className="font-display text-lg text-text-primary">MQTT Telemetry</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ultra-lightweight publish/subscribe messaging over TCP/TLS. Transmits compact JSON
                packets with GPS coordinates, battery voltage, and satellite counts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-light space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange" />
              </div>
              <h3 className="font-display text-lg text-text-primary">Safety Collar</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Weatherproof IP67 enclosure mounted on an elastic breakaway strap. Releases safely
                if snagged on fences or underbrush to eliminate strangulation risks.
              </p>
            </div>
          </div>

          {/* Interactive Hardware Telemetry Data Pipeline Diagram */}
          <TelemetryPipelineDiagram />
        </section>

        {/* Open Source & Community Call */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-3xl md:text-4xl text-text-primary">
            Built Open. Built with Care.
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Pawthik (Paw-থিক) collar schematics, Arduino/ESP-IDF firmware, and software interfaces are
            open-source. Anyone can assemble collars for their local street pack or contribute to the
            codebase.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button href="/explore" variant="primary">
              Explore Our Animal Directory
            </Button>
            <Button href="/register-animal" variant="secondary">
              Register an Animal Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

