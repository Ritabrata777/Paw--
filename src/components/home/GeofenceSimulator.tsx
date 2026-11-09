'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, CheckCircle, AlertTriangle, MapPin, Sliders } from 'lucide-react';

export default function GeofenceSimulator() {
  const [radius, setRadius] = useState(300); // meters
  const [animalDist, setAnimalDist] = useState(240); // meters from center
  const isBreached = animalDist > radius;

  return (
    <section id="geofence" className="py-24 bg-[#FFF7E8] border-t-2 border-[#DFDFDF]">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D] font-bold">
              VIRTUAL GEOFENCING
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-[#241F4E] leading-tight">
              Draw a line. The collar watches it.
            </h2>
            <p className="text-[#5F5A8C] text-base md:text-lg leading-relaxed font-body">
              Drop a circle on the map and size it to the garden, the neighbourhood colony, or the
              whole village. Cross the line and your phone gets an immediate push notification, with
              an SMS backup.
            </p>

            {/* Interactive Radius Slider Control */}
            <div className="p-6 md:p-8 bg-white rounded-[32px] border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-display font-bold uppercase tracking-wider text-[#241F4E] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#FF8A3D]" /> Safe Zone Radius
                </span>
                <span className="font-mono text-sm font-bold text-[#241F4E] bg-[#FFC93C]/30 px-3.5 py-1 rounded-full border border-[#DFDFDF]">
                  {radius} meters
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="800"
                step="50"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-[#FF8A3D] cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs text-[#5F5A8C] font-display font-bold pt-1">
                <span>100 m (Courtyard)</span>
                <span>400 m (Colony)</span>
                <span>800 m (Neighbourhood)</span>
              </div>

              {/* Slider for Animal Position */}
              <div className="pt-3 border-t-2 border-[#DFDFDF] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5F5A8C] font-body font-semibold">Simulate Pet / Animal Position:</span>
                  <span className="font-mono text-xs font-bold text-[#241F4E]">
                    {animalDist} m from Home
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="900"
                  step="25"
                  value={animalDist}
                  onChange={(e) => setAnimalDist(Number(e.target.value))}
                  className="w-full accent-[#2E9E5B] cursor-pointer"
                />
              </div>

              {/* Live Alert Status Notification */}
              <div
                className={`p-4 rounded-[20px] text-xs font-body flex items-center gap-3 transition-colors border-2 ${
                  isBreached
                    ? 'bg-[#FF5470]/15 text-[#241F4E] border-[#FF5470]'
                    : 'bg-[#4FCB77]/20 text-[#241F4E] border-[#4FCB77]'
                }`}
              >
                {isBreached ? (
                  <>
                    <AlertTriangle className="w-5 h-5 shrink-0 text-[#FF5470] animate-bounce" />
                    <div>
                      <strong className="block font-display text-sm font-bold text-[#FF5470]">
                        Safe Zone Breached! (2 MIN AGO)
                      </strong>
                      <span className="text-xs">
                        Bholu is {animalDist}m away (crossed {radius}m safe boundary). Immediate
                        push notification dispatched to your phone.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 shrink-0 text-[#2E9E5B]" />
                    <div>
                      <strong className="block font-display text-sm font-bold text-[#2E9E5B]">
                        Inside Safe Zone
                      </strong>
                      <span className="text-xs">
                        Bholu is comfortably within the {radius}m safe zone. Collar operating in
                        power-saving standby.
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Visual Simulation Canvas */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-white rounded-[36px] border-[3px] border-[#241F4E] shadow-[0_8px_0_#241F4E] overflow-hidden flex items-center justify-center p-6">
              {/* Grid backdrop */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#241F4E 1.5px, transparent 1.5px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Home colony pin in center */}
              <div className="absolute z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-[#241F4E] text-[#FFF7E8] border-2 border-white flex items-center justify-center text-xs shadow-md">
                  📍
                </div>
                <span className="text-[10px] font-display font-bold text-[#241F4E] mt-1 bg-[#FFF7E8] px-2 py-0.5 rounded-full border border-[#DFDFDF] shadow-xs">
                  Colony Home
                </span>
              </div>

              {/* Dynamic Boundary Radius Circle */}
              <motion.div
                animate={{ width: `${(radius / 800) * 85}%`, height: `${(radius / 800) * 85}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`rounded-full border-[3px] border-dashed flex items-center justify-center transition-colors pointer-events-none ${
                  isBreached
                    ? 'border-[#FF5470] bg-[#FF5470]/10'
                    : 'border-[#2E9E5B] bg-[#4FCB77]/10'
                }`}
              />

              {/* Dynamic Animal Marker */}
              <motion.div
                animate={{
                  x: `${((animalDist - 250) / 600) * 140}px`,
                  y: `${-((animalDist - 250) / 600) * 110}px`,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className="absolute z-20 flex flex-col items-center pointer-events-none"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base shadow-lg border-2 border-[#241F4E] ${
                    isBreached ? 'bg-[#FF5470] text-white' : 'bg-[#FFC93C] text-[#241F4E]'
                  }`}
                >
                  🐕
                </div>
                <span
                  className={`text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full mt-1 shadow-sm whitespace-nowrap border ${
                    isBreached
                      ? 'bg-[#FF5470] text-white border-[#241F4E]'
                      : 'bg-[#241F4E] text-white border-white'
                  }`}
                >
                  {isBreached ? 'OUTSIDE SAFE ZONE' : 'SAFE INSIDE'}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
