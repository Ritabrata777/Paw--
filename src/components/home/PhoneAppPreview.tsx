'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Radio,
  Battery,
  Clock,
  Volume2,
  Shield,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Wifi,
  Navigation,
} from 'lucide-react';

export default function PhoneAppPreview() {
  const [isPlayingRoute, setIsPlayingRoute] = useState(false);
  const [chimeActive, setChimeActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'geofence'>('live');

  const toggleChime = () => {
    setChimeActive(true);
    setTimeout(() => setChimeActive(false), 2500);
  };

  return (
    <div className="relative mx-auto max-w-[340px] sm:max-w-[380px] bg-[#17372C] p-4 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(23,55,44,0.4)] border-4 border-[#244C3A]">
      {/* Phone Notch & Speaker */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#17372C] rounded-full z-30 flex items-center justify-center">
        <div className="w-10 h-1.5 bg-[#244C3A] rounded-full" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#202820] ml-3" />
      </div>

      {/* Screen Frame */}
      <div className="relative bg-[#FEFDF9] rounded-[36px] overflow-hidden border border-[#E2E0D8] text-[#202820] flex flex-col h-[640px] shadow-inner">
        {/* Status bar */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-mono text-[#777C72] bg-[#F6F3EA]/80 backdrop-blur-md z-20">
          <span>11:42 PM</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#244C3A]">4G LTE</span>
            <Battery className="w-3.5 h-3.5 text-[#4CAF50]" />
          </div>
        </div>

        {/* Screen Header */}
        <div className="px-5 pt-3 pb-3 bg-[#F6F3EA]/90 border-b border-[#E2E0D8] flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#244C3A]/30">
              <Image
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200"
                alt="Bholu profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-sm font-bold text-[#202820]">Bholu</h4>
                <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
              </div>
              <p className="text-[10px] text-[#777C72] font-mono">PT-ESP32-001 • Park Street</p>
            </div>
          </div>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#244C3A]/10 text-[#244C3A]">
            Collar Online
          </span>
        </div>

        {/* Interactive Simulated Map Canvas */}
        <div className="relative flex-1 bg-[#EBE7DC] overflow-hidden">
          {/* Street Grid pattern SVG background */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#A9B9A3" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            {/* Street Lines */}
            <path d="M -20 180 Q 150 140 400 220" fill="none" stroke="#D98A55" strokeWidth="6" opacity="0.3" />
            <path d="M 120 -10 L 140 450" fill="none" stroke="#244C3A" strokeWidth="8" opacity="0.25" />
            <path d="M 0 320 Q 200 280 400 360" fill="none" stroke="#A9B9A3" strokeWidth="12" opacity="0.5" />
          </svg>

          {/* Safe Zone Geofence Circle overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-dashed border-[#244C3A] bg-[#244C3A]/5 pointer-events-none flex items-center justify-center">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#244C3A]/70 px-2 py-0.5 rounded bg-[#FEFDF9]/80 shadow-xs mb-36">
              Safe Zone: 300m Territory
            </span>
          </div>

          {/* Breadcrumb Route Trail */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.path
              d="M 110 310 Q 140 260 170 230 T 210 180"
              fill="none"
              stroke="#D98A55"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          {/* Real-time Animal Pin Marker */}
          <motion.div
            animate={{
              x: [0, 4, -2, 0],
              y: [0, -3, 2, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[175px] left-[200px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
          >
            {/* Ping radar rings */}
            <span className="absolute w-12 h-12 rounded-full bg-[#244C3A]/25 animate-ping" />
            <div className="relative w-10 h-10 rounded-full bg-[#244C3A] border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold">
              🐕
            </div>
            {/* Floating marker label */}
            <div className="mt-1 px-2 py-0.5 rounded-full bg-[#202820] text-white text-[9px] font-mono whitespace-nowrap shadow-md">
              Bholu • Near Tea Stall
            </div>
          </motion.div>

          {/* Collar Chime sound feedback indicator */}
          <AnimatePresence>
            {chimeActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#D98A55] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 z-30"
              >
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                Collar Chime Beeping (85dB)...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick HUD Metrics Overlay */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#E2E0D8] shadow-md space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-[#E2E0D8]">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#777C72] block font-mono">
                  Distance
                </span>
                <span className="font-display text-sm font-bold text-[#244C3A]">280 m</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#777C72] block font-mono">
                  Speed
                </span>
                <span className="font-display text-sm font-bold text-[#202820]">4 km/h</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#777C72] block font-mono">
                  Battery
                </span>
                <span className="font-display text-sm font-bold text-[#4CAF50]">85%</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-[#E2E0D8] flex items-center justify-between gap-2">
              <button
                onClick={toggleChime}
                className="flex-1 py-1.5 px-2 rounded-xl bg-[#F6F3EA] hover:bg-[#D98A55] hover:text-white text-[10px] font-semibold text-[#202820] flex items-center justify-center gap-1 transition-colors"
              >
                <Volume2 className="w-3 h-3" /> Sound Collar
              </button>
              <button
                onClick={() => setIsPlayingRoute(!isPlayingRoute)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-[#244C3A] text-white text-[10px] font-semibold flex items-center justify-center gap-1 hover:bg-[#17372C] transition-colors"
              >
                <Navigation className="w-3 h-3" /> Live Tracking
              </button>
            </div>
          </div>
        </div>

        {/* Bottom App Navigation Bar */}
        <div className="px-6 py-2.5 bg-[#F6F3EA] border-t border-[#E2E0D8] flex items-center justify-around text-[#777C72]">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex flex-col items-center gap-0.5 ${
              activeTab === 'live' ? 'text-[#244C3A] font-bold' : ''
            }`}
          >
            <Radio className="w-4 h-4" />
            <span className="text-[9px]">Live</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-0.5 ${
              activeTab === 'history' ? 'text-[#244C3A] font-bold' : ''
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-[9px]">History</span>
          </button>
          <button
            onClick={() => setActiveTab('geofence')}
            className={`flex flex-col items-center gap-0.5 ${
              activeTab === 'geofence' ? 'text-[#244C3A] font-bold' : ''
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="text-[9px]">Safe Zone</span>
          </button>
        </div>
      </div>
    </div>
  );
}

