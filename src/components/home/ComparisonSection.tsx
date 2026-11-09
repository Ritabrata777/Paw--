'use client';

import React from 'react';
import { Check, X, Shield, Radio, AlertCircle, Compass, Zap } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-[#EEF1EA] border-t-2 border-[#DFDFDF]">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D] font-bold">
            THE HARDWARE REALITY
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#241F4E]">
            The SIM card is the advantage, not the catch.
          </h2>
          <p className="text-[#5F5A8C] text-base md:text-lg leading-relaxed font-body">
            Pawthik (Paw-থিক) fixes its position from navigation satellites and transmits that position
            over the cellular network using its own SIM. It is therefore independent of your phone—and
            that independence is the whole reason the product works at distance.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border-[3px] border-[#241F4E] bg-white shadow-[0_8px_0_#241F4E]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-[3px] border-[#241F4E] bg-[#FFF7E8]">
                  <th className="p-5 font-display text-lg text-[#241F4E] w-1/3">
                    Feature / Scenario
                  </th>
                  <th className="p-5 font-display text-lg text-[#5F5A8C] w-1/3 border-x-2 border-[#DFDFDF]">
                    Bluetooth Trackers (AirTags / Tiles)
                  </th>
                  <th className="p-5 font-display text-lg text-[#241F4E] w-1/3 bg-[#4FCB77]/15">
                    Pawthik (Paw-থিক) 4G GPS Collar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#DFDFDF] font-body text-xs md:text-sm">
                <tr>
                  <td className="p-5 font-display font-bold text-[#241F4E]">Working Range</td>
                  <td className="p-5 text-[#5F5A8C] border-x-2 border-[#DFDFDF]">
                    <span className="inline-flex items-center gap-1.5 text-[#FF5470] font-bold">
                      <X className="w-4 h-4 shrink-0 text-[#FF5470]" /> Limited to ~10 meters
                    </span>
                    <p className="text-[12px] text-[#5F5A8C] mt-1">
                      Completely blind if no passing smartphone is nearby
                    </p>
                  </td>
                  <td className="p-5 bg-[#4FCB77]/10">
                    <span className="inline-flex items-center gap-1.5 text-[#241F4E] font-display font-bold">
                      <Check className="w-4 h-4 shrink-0 text-[#2E9E5B]" /> No range limit
                    </span>
                    <p className="text-[12px] text-[#5F5A8C] mt-1">
                      Tracks across the park, county, or three towns over
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="p-5 font-display font-bold text-[#241F4E]">Positioning Technology</td>
                  <td className="p-5 text-[#5F5A8C] border-x-2 border-[#DFDFDF]">
                    <span className="inline-flex items-center gap-1.5 text-[#FF8A3D] font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#FF8A3D]" /> Bluetooth signal relay
                    </span>
                    <p className="text-[12px] text-[#5F5A8C] mt-1">
                      Fails where pets actually get lost (ditches, woods, ravines)
                    </p>
                  </td>
                  <td className="p-5 bg-[#4FCB77]/10">
                    <span className="inline-flex items-center gap-1.5 text-[#241F4E] font-display font-bold">
                      <Check className="w-4 h-4 shrink-0 text-[#2E9E5B]" /> Satellite positioning + 4G delivery
                    </span>
                    <p className="text-[12px] text-[#5F5A8C] mt-1">
                      Direct GNSS fix down to 2.5m, delivered to your phone
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="p-5 font-display font-bold text-[#241F4E]">Live Route History</td>
                  <td className="p-5 text-[#5F5A8C] border-x-2 border-[#DFDFDF]">
                    <span className="inline-flex items-center gap-1.5 text-[#FF5470] font-bold">
                      <X className="w-4 h-4 shrink-0 text-[#FF5470]" /> No trail or breadcrumbs
                    </span>
                  </td>
                  <td className="p-5 bg-[#4FCB77]/10">
                    <span className="inline-flex items-center gap-1.5 text-[#241F4E] font-display font-bold">
                      <Check className="w-4 h-4 shrink-0 text-[#2E9E5B]" /> Hour-by-hour playback trail
                    </span>
                    <p className="text-[12px] text-[#5F5A8C] mt-1">
                      Tells you which way they went to find them fast
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="p-5 font-display font-bold text-[#241F4E]">Safe Zones & Geofencing</td>
                  <td className="p-5 text-[#5F5A8C] border-x-2 border-[#DFDFDF]">
                    <span className="inline-flex items-center gap-1.5 text-[#FF5470] font-bold">
                      <X className="w-4 h-4 shrink-0 text-[#FF5470]" /> Not supported
                    </span>
                  </td>
                  <td className="p-5 bg-[#4FCB77]/10">
                    <span className="inline-flex items-center gap-1.5 text-[#241F4E] font-display font-bold">
                      <Check className="w-4 h-4 shrink-0 text-[#2E9E5B]" /> 100m to 3km perimeter alerts
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-5 font-display font-bold text-[#241F4E]">Monthly Subscription Fee</td>
                  <td className="p-5 text-[#5F5A8C] border-x-2 border-[#DFDFDF]">
                    $0, but useless outside your garden
                  </td>
                  <td className="p-5 bg-[#4FCB77]/10">
                    <span className="inline-flex items-center gap-1.5 text-[#2E9E5B] font-display font-extrabold">
                      <Check className="w-4 h-4 shrink-0 text-[#2E9E5B]" /> No recurring fee to Pawthik
                    </span>
                    <p className="text-[12px] text-[#5F5A8C] mt-1">
                      You choose the carrier. Zero software subscription lock-in.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
