'use client';

import React from 'react';
import { ShieldCheck, Battery, Cpu, Radio, Droplets, Scale, Compass, Check } from 'lucide-react';

export default function SpecSheet() {
  const specs = [
    {
      category: 'Physical & Durability',
      color: 'bg-[#FFF7E8]',
      items: [
        { label: 'Weight', value: '38 grams (Cat) / 54 grams (Dog)' },
        { label: 'Enclosure Material', value: 'Shock-resistant UV-stabilized PETG' },
        { label: 'Weatherproofing', value: 'IP67 certified: Rain, mud and puddles: fine' },
        { label: 'Safety Buckle', value: 'Elastic breakaway (>3kg tension release)' },
      ],
    },
    {
      category: 'Positioning & GNSS',
      color: 'bg-[#4FCB77]/10',
      items: [
        { label: 'Satellite Engine', value: 'u-blox NEO-6M GNSS (GPS, GLONASS, Galileo)' },
        { label: 'Position Accuracy', value: '2.5m horizontal CEP (down to the tree)' },
        { label: 'Assisted GPS (A-GPS)', value: 'Supported for <2 second warm fixes' },
        { label: 'Update Interval', value: '10s (Live Mode) to 15 min (Standby)' },
      ],
    },
    {
      category: 'Connectivity & Battery',
      color: 'bg-[#8B6BFF]/10',
      items: [
        { label: 'Cellular & Wireless', value: '4G LTE-M / NB-IoT / 2.4GHz Wi-Fi' },
        { label: 'SIM Card Slot', value: 'Standard Nano-SIM (carrier agnostic)' },
        { label: 'Battery Capacity', value: '500 mAh rechargeable LiPo cell' },
        { label: 'Battery Life', value: 'Up to 14 days standby, magnetic dock charging' },
      ],
    },
  ];

  return (
    <section id="specs" className="py-24 bg-[#EEF1EA] border-t-2 border-[#DFDFDF]">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D] font-bold">
            HARDWARE SPECIFICATIONS
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#241F4E] mt-2">
            The full spec sheet.
          </h2>
          <p className="text-[#5F5A8C] text-base md:text-lg mt-3 font-body">
            Engineered down to the gram. One collar, kitten to shepherd. Zero proprietary subscription locks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specs.map((group) => (
            <div
              key={group.category}
              className={`rounded-[32px] p-8 border-[3px] border-[#241F4E] shadow-[0_6px_0_#241F4E] space-y-6 ${group.color}`}
            >
              <h3 className="font-display text-2xl text-[#241F4E] pb-3 border-b-2 border-[#241F4E]/20">
                {group.category}
              </h3>
              <dl className="space-y-4 font-body">
                {group.items.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <dt className="text-xs font-display font-bold uppercase text-[#5F5A8C] tracking-wider">
                      {item.label}
                    </dt>
                    <dd className="text-sm font-bold text-[#241F4E]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
