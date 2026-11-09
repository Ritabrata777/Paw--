'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Radio,
  Search,
  Sparkles,
  MapPin,
  Heart,
  Compass,
  Shield,
  Layers,
  ArrowUpRight,
  Activity,
  Users,
  Navigation,
  CheckCircle2,
  Volume2,
  Battery,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { Animal, CommunityStats } from '@/types';
import { useAnimatedNumber } from '@/hooks';

import PhoneAppPreview from '@/components/home/PhoneAppPreview';
import ComparisonSection from '@/components/home/ComparisonSection';
import GeofenceSimulator from '@/components/home/GeofenceSimulator';
import SpecSheet from '@/components/home/SpecSheet';

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [stats, setStats] = useState<CommunityStats>({
    totalAnimals: 8,
    totalDogs: 5,
    totalCats: 3,
    activeCollars: 3,
    communityMembers: 142,
    totalSightings: 28,
  });
  const [loading, setLoading] = useState(true);

  // Animated counters
  const animatedAnimals = useAnimatedNumber(stats.totalAnimals, 1800);
  const animatedDogs = useAnimatedNumber(stats.totalDogs, 1800);
  const animatedCats = useAnimatedNumber(stats.totalCats, 1800);
  const animatedCollars = useAnimatedNumber(stats.activeCollars, 1800);
  const animatedMembers = useAnimatedNumber(stats.communityMembers, 2000);

  useEffect(() => {
    async function fetchData() {
      try {
        const [animalsRes, statsRes] = await Promise.all([
          fetch('/api/animals?limit=6'),
          fetch('/api/stats'),
        ]);

        if (animalsRes.ok) {
          const aData = await animalsRes.json();
          if (aData.data?.animals) setAnimals(aData.data.animals);
        }
        if (statsRes.ok) {
          const sData = await statsRes.json();
          if (sData.data) setStats(sData.data);
        }
      } catch (e) {
        console.error('Error loading initial data', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#EEF1EA]">
      {/* ============================================================
          1. HERO SECTION — Bold, Direct, High-Trust
          Headline: "Know exactly where your pet is. Down to the tree."
          ============================================================ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 overflow-hidden bg-[#EEF1EA]">
        <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Bold Headline & Benefit Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 xl:col-span-7 space-y-6 lg:pr-6"
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7E8] border-2 border-[#241F4E] text-xs font-display font-bold text-[#241F4E] shadow-[0_3px_0_#241F4E]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4FCB77] animate-pulse" />
                <span>Live 4G GPS Collar • Zero Monthly Subscription Fees</span>
              </div>

              {/* Main Headline from pawtraces.com */}
              <h1 className="font-display text-[#241F4E] leading-[1.08] tracking-tight text-4xl sm:text-5xl lg:text-[62px] font-extrabold">
                Know exactly where your pet is.{' '}
                <span className="text-[#FF8A3D] block sm:inline">Down to the tree.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-[#5F5A8C] text-lg md:text-xl font-body leading-relaxed max-w-xl font-medium">
                Pawthik (Paw-থিক) is an independent 4G tracking collar that puts your animal’s live
                satellite location on your phone—across the park, across the county, or three streets
                over at someone else’s barbecue.
              </p>

              {/* Clear Path to Action: One Primary CTA per view */}
              <div className="pt-2">
                <Button
                  href="/tracking"
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Launch Live 4G Tracking Map
                </Button>
              </div>

              {/* Trust Signals First */}
              <div className="pt-6 border-t-2 border-[#DFDFDF] flex flex-wrap items-center gap-6 text-xs font-display font-bold text-[#241F4E]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#4FCB77] flex items-center justify-center text-white text-[10px]">
                    ✓
                  </span>
                  <span>No Range Limit (4G LTE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#4FCB77] flex items-center justify-center text-white text-[10px]">
                    ✓
                  </span>
                  <span>Rain, Mud & Puddles: Fine (IP67)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#4FCB77] flex items-center justify-center text-white text-[10px]">
                    ✓
                  </span>
                  <span>Zero Subscription Lock-in</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 xl:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Image Card with signature Paw Traces pop shadow */}
                <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden border-[4px] border-[#241F4E] shadow-[0_10px_0_#241F4E] bg-[#FFF7E8]">
                  <Image
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=900"
                    alt="Dog wearing GPS smart collar"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  {/* Overlaid Live Collar Telemetry Card */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                    <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-[#FF8A3D] text-white border border-[#241F4E] inline-block shadow-xs">
                      Live Signal · Safe Zone Maple
                    </span>
                    <h3 className="font-display text-2xl text-[#FFF7E8] font-bold">Bholu · 420m away</h3>
                    <p className="text-xs text-[#FFF7E8]/90 font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4FCB77] animate-pulse" />
                      11 km/h moving • Left safe zone 2 min ago
                    </p>
                  </div>
                </div>

                {/* Overlapping Cat Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -bottom-8 -left-8 md:-left-12 w-48 sm:w-56 aspect-[4/3] rounded-[24px] overflow-hidden border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] bg-white hidden sm:block"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=500"
                    alt="Tabby cat"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-display font-bold drop-shadow-md">
                    Meera · College St. (Inside Safe Zone)
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. THIS IS THE SCREEN YOU'LL OPEN AT 11PM (PhoneAppPreview)
          ============================================================ */}
      <section className="py-24 bg-[#241F4E] text-[#FFF7E8] relative overflow-hidden">
        <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFC93C] font-bold">
                REAL-TIME PHONE INTERFACE
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-[#FFF7E8] leading-tight font-extrabold">
                This is the screen you’ll open at 11pm.
              </h2>
              <div className="space-y-4 text-[#B7B2DC] text-base md:text-lg leading-relaxed font-body">
                <p>
                  The collar reports its own position over the mobile network, so the map is current
                  whether your pet is in next door’s garden or six miles down a bridleway.
                </p>
                <p>
                  Tap into <strong className="text-white">Live Mode</strong> and it refreshes
                  every few seconds while you close the distance.
                </p>
                <p>
                  The trail behind them is <strong className="text-white">route history</strong>. It
                  tells you which way they went, which is usually the difference between searching and
                  finding.
                </p>
              </div>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 font-display">
                <div className="space-y-1">
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-[#FF8A3D]" /> Live 3-Second Pings
                  </div>
                  <p className="text-xs text-[#B7B2DC] font-body">
                    Instant updates while tracking on foot
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#FF8A3D]" /> One-Tap Finder Chime
                  </div>
                  <p className="text-xs text-[#B7B2DC] font-body">
                    Collar sounds until you find them
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Phone Preview */}
            <div className="lg:col-span-6">
              <PhoneAppPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. BUILT FOR THE PET WHO RUNS FIRST (6 Core Features)
          ============================================================ */}
      <section className="py-24 md:py-32 bg-[#EEF1EA]">
        <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D] font-bold">
              WHAT THE TRACKER ACTUALLY DOES
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-[#241F4E] mt-2 font-extrabold">
              Built for the pet who runs first and thinks later.
            </h2>
            <p className="text-[#5F5A8C] text-base md:text-lg mt-3 font-body">
              Cat, dog, colony guardian—if it wears a collar and has opinions about staying home,
              this is for it. Here’s what the tracker actually does.
            </p>
          </div>

          {/* 6 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Live 4G */}
            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4FCB77]/20 border-2 border-[#241F4E] text-[#241F4E] flex items-center justify-center font-bold">
                <Radio className="w-6 h-6 text-[#2E9E5B]" />
              </div>
              <h3 className="font-display text-2xl text-[#241F4E]">Live 4G Tracking</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                GPS for the open sky, A-GPS for a faster fix, and cell positioning when the view is
                blocked. Over 4G it reports wherever there’s mobile coverage—no range limit.
              </p>
            </div>

            {/* 2. Safe Zones */}
            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D]/20 border-2 border-[#241F4E] text-[#FF8A3D] flex items-center justify-center font-bold">
                <Shield className="w-6 h-6 text-[#FF8A3D]" />
              </div>
              <h3 className="font-display text-2xl text-[#241F4E]">Safe Zones: 100m to 3km</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                Drop a circle on the map and size it to the garden, the colony, or the whole
                village. Cross the line and your phone gets an immediate push, with an SMS backup.
              </p>
            </div>

            {/* 3. Route History */}
            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B6BFF]/20 border-2 border-[#241F4E] text-[#8B6BFF] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6 text-[#8B6BFF]" />
              </div>
              <h3 className="font-display text-2xl text-[#241F4E]">Route History</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                Play back where they’ve been, hour by hour. Useful for finding the hole in the fence,
                and for finally settling what the cat does all afternoon.
              </p>
            </div>

            {/* 4. One-Tap Finder */}
            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC93C]/30 border-2 border-[#241F4E] text-[#241F4E] flex items-center justify-center font-bold">
                <Volume2 className="w-6 h-6 text-[#241F4E]" />
              </div>
              <h3 className="font-display text-2xl text-[#241F4E]">One-Tap Pet Finder</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                Close but can’t see them? Hit Find and the collar sounds until you cancel it. Ends the
                night search faster than shouting does.
              </p>
            </div>

            {/* 5. Power-saving Standby */}
            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4FCB77]/20 border-2 border-[#241F4E] text-[#241F4E] flex items-center justify-center font-bold">
                <Battery className="w-6 h-6 text-[#2E9E5B]" />
              </div>
              <h3 className="font-display text-2xl text-[#241F4E]">Power-Saving Standby</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                A 500 mAh rechargeable cell with a reporting interval you set yourself. Magnetic
                dock clips on without fiddling with small plugs.
              </p>
            </div>

            {/* 6. Your SIM, No Fee */}
            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5470]/20 border-2 border-[#241F4E] text-[#FF5470] flex items-center justify-center font-bold">
                <Zap className="w-6 h-6 text-[#FF5470]" />
              </div>
              <h3 className="font-display text-2xl text-[#241F4E]">Your SIM, No Fee to Us</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                The housing opens for a standard nano-SIM, so you pick the carrier and the data plan.
                Pawthik never charges you a monthly software subscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. INTERACTIVE GEOFENCE SIMULATOR
          "Draw a line. The collar watches it."
          ============================================================ */}
      <GeofenceSimulator />

      {/* ============================================================
          5. THE SIM CARD IS THE ADVANTAGE (Comparison Section)
          ============================================================ */}
      <ComparisonSection />

      {/* ============================================================
          6. STATS / TRUST BAR
          ============================================================ */}
      <section className="py-12 bg-[#241F4E] text-[#FFF7E8] border-y-4 border-[#241F4E]">
        <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
            <div className="pt-4 md:pt-0">
              <div className="font-display text-4xl lg:text-5xl text-[#FFF7E8] font-extrabold">
                {animatedAnimals}
              </div>
              <div className="text-xs text-[#B7B2DC] font-display font-bold mt-1">
                Registered Animals
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="font-display text-4xl lg:text-5xl text-[#FFF7E8] font-extrabold">
                {animatedDogs}
              </div>
              <div className="text-xs text-[#B7B2DC] font-display font-bold mt-1">
                Dogs Monitored
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="font-display text-4xl lg:text-5xl text-[#FFF7E8] font-extrabold">
                {animatedCats}
              </div>
              <div className="text-xs text-[#B7B2DC] font-display font-bold mt-1">
                Cats Monitored
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="font-display text-4xl lg:text-5xl text-[#FF8A3D] font-extrabold flex items-center justify-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4FCB77] shrink-0" />
                {animatedCollars}
              </div>
              <div className="text-xs text-[#B7B2DC] font-display font-bold mt-1">
                Active Smart Collars
              </div>
            </div>

            <div className="pt-4 md:pt-0 col-span-2 md:col-span-1">
              <div className="font-display text-4xl lg:text-5xl text-[#FFF7E8] font-extrabold">
                {animatedMembers}+
              </div>
              <div className="text-xs text-[#B7B2DC] font-display font-bold mt-1">
                Active Caregivers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. MEET THE LOCALS (Community Directory)
          ============================================================ */}
      <section className="py-24 md:py-32 bg-[#EEF1EA]">
        <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D] font-bold">
                COMMUNITY NETWORK
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-[#241F4E] mt-2 font-extrabold">
                Meet the Locals.
              </h2>
              <p className="text-[#5F5A8C] text-base md:text-lg max-w-xl mt-3 font-body">
                Street dogs and neighbourhood cats with verified digital identities and live
                smart collar telemetry.
              </p>
            </div>
            <Button
              href="/explore"
              variant="secondary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore All Animals
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {animals.slice(0, 6).map((animal, idx) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                variant="editorial"
                className={idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. THREE STEPS, ABOUT FIVE MINUTES (from pawtraces.com)
          ============================================================ */}
      <section className="py-24 bg-[#FFF7E8] border-y-2 border-[#DFDFDF]">
        <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D] font-bold">
              SETUP PROCESS
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-[#241F4E] mt-2 font-extrabold">
              Three steps, about five minutes.
            </h2>
            <p className="text-[#5F5A8C] text-base md:text-lg mt-3 font-body">
              No subscription contracts, no technical hurdle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <span className="font-display text-5xl font-extrabold text-[#FF8A3D] block">01</span>
              <h3 className="font-display text-2xl text-[#241F4E]">Slide in a nano-SIM</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                Pop open the weatherproof silicone seal and insert any standard nano-SIM card.
                Power the collar on—the satellite LED signals an active lock in under 45 seconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <span className="font-display text-5xl font-extrabold text-[#2E9E5B] block">02</span>
              <h3 className="font-display text-2xl text-[#241F4E]">Pair it in the app</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                Open Pawthik on your phone, scan the QR code on the back of the collar, and name
                your pet or registered street animal.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-4">
              <span className="font-display text-5xl font-extrabold text-[#8B6BFF] block">03</span>
              <h3 className="font-display text-2xl text-[#241F4E]">Draw your Safe Zones</h3>
              <p className="text-sm text-[#5F5A8C] leading-relaxed font-body">
                Set a perimeter circle around home, garden, or colony. You’re done. The collar
                watches the boundary 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. THE FULL SPEC SHEET (SpecSheet component)
          ============================================================ */}
      <SpecSheet />

      {/* ============================================================
          10. FINAL CTA — Trust & Action
          ============================================================ */}
      <section className="relative py-28 md:py-36 bg-[#241F4E] text-[#FFF7E8] overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono tracking-wider text-[#FFC93C] font-bold">
            EVERY PAW HAS A PLACE
          </span>

          <h2 className="font-display text-4xl md:text-6xl text-[#FFF7E8] font-extrabold leading-[1.12]">
            Know their names.{' '}
            <span className="text-[#FF8A3D]">Follow their journeys.</span>
          </h2>

          <p className="text-[#B7B2DC] text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed">
            Whether you feed one dog on your morning walk or track twenty across your ward,
            Pawthik (Paw-থিক) makes care visible, organized, and independent.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              href="/tracking"
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Launch Live GPS Map
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
