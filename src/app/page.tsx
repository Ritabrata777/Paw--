'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion, MotionConfig, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Battery, Heart, MapPin, PawPrint, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { AnimalCard } from '@/components/animals/AnimalCard';
import type { Animal } from '@/types';
import GeofenceSimulator from '@/components/home/GeofenceSimulator';
import SpecSheet from '@/components/home/SpecSheet';
import './home.css';

const CollarScene = dynamic(() => import('@/components/home/CollarScene'), { ssr: false, loading: () => <div className="collar-fallback"><PawPrint size={58} /><span>PAWTRACE</span></div> });
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
const features = [
  { icon: Radio, number: '01', title: 'A little freedom. A lot of peace of mind.', text: 'Follow their location on the tracking map. A world of adventures, with a way back to you.', label: 'LIVE LOCATION', className: 'feature-orange', href: '/tracking' },
  { icon: ShieldCheck, number: '02', title: 'Their world. Your safe zone.', text: 'Explore how a virtual boundary helps you know when a curious paw wanders a little too far.', label: 'VIRTUAL GEOFENCING', className: 'feature-sage', href: '#geofence' },
  { icon: Heart, number: '03', title: 'Every neighbourhood needs a little love.', text: 'Meet local animals, share sightings, and connect the people who care for them.', label: 'COMMUNITY CARE', className: 'feature-lilac', href: '/community' },
];
export default function HomePage() {
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const { scrollYProgress: heroProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroRotate = useTransform(heroProgress, [0, 1], [-7, 5]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/animals?limit=3', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Unable to load animals');
      const result = await response.json(); setAnimals(result.data?.animals ?? []); setState('ready');
    }).catch(error => { if (error.name !== 'AbortError') setState('error'); });
    return () => controller.abort();
  }, []);
  return <MotionConfig reducedMotion="user"><div className="modern-home">
    <motion.div className="reading-progress" style={{ scaleX: progress }} />
    <section className="pt-hero" ref={hero}><div className="hero-grid pt-container">
      <div className="hero-copy"><div className="eyebrow"><span className="status-dot" /> SMALL COLLAR. BIG WORLD.</div>
        <h1>Let them<br />roam.<br /><span>Stay close.</span><span className="headline-spark" aria-hidden="true">✳</span></h1>
        <p>For the curious noses. The unexpected detours.<br className="desktop-break" /> And every little adventure you share.<br className="desktop-break" /> A closer connection, wherever they wander.</p>
        <div className="hero-actions"><Link className="pt-button" href="/tracking">Find your peace of mind <ArrowUpRight size={19} /></Link><a className="text-link" href="#discover">Meet Pawtrace <ArrowDown size={16} /></a></div>
        <div className="hero-footnote"><span className="mini-paw"><PawPrint size={18} /></span><span>Made for your best friend.<br /><strong>And the ones still looking for one.</strong></span></div>
      </div>
      <motion.div className="hero-art" style={reduced ? undefined : { y: heroY }}>
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><span className="art-caption">A LITTLE TECH. A WHOLE LOT OF LOVE.</span>
        <motion.div className="pet-portrait" style={reduced ? undefined : { rotate: heroRotate }}><Image src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85" alt="Golden retriever enjoying an outdoor adventure" fill priority sizes="(max-width: 700px) 85vw, 480px" className="object-cover" /><div className="portrait-caption"><span>Professional explorer.</span><PawPrint size={24} /></div></motion.div>
        <div className="floating-location"><span className="location-icon"><MapPin size={21} /></span><div><small>LESS WORRY. MORE WANDERING.</small><strong>A connection that follows.</strong></div><span className="status-dot" /></div>
        <div className="collar-window"><CollarScene progress={heroProgress} /><span className="collar-caption"><span className="status-dot" /> EXPLORE IN 3D</span></div>
        <span className="art-star" aria-hidden="true">✳</span><span className="art-coordinate">DESIGNED FOR LIFE OUT THERE ↗</span>
      </motion.div>
    </div><div className="hero-bottom pt-container"><a href="#discover"><ArrowDown size={15} /> SCROLL TO WANDER</a><span>CONNECTED BY TECHNOLOGY. BROUGHT TOGETHER BY CARE.</span><span>01 / 05</span></div></section>
    <div className="word-ribbon" aria-label="Follow their adventures. Find your calm. Every paw matters."><div>{[0, 1, 2, 3].map(i => <span key={i} aria-hidden={i > 0}>FOLLOW THEIR ADVENTURES <PawPrint /> FIND YOUR CALM <span className="ribbon-outline">EVERY PAW MATTERS</span> <Sparkles /></span>)}</div></div>
    <section id="discover" className="pt-section pt-container"><Reveal className="section-heading"><div><span className="eyebrow">THE WORLD IS THEIR PLAYGROUND</span><h2>More adventures.<br /><span>Fewer what-ifs.</span></h2></div><p>Thoughtful technology that lets animals be animals. And lets you enjoy every moment of it.</p></Reveal>
      <div className="feature-grid">{features.map(({ icon: Icon, ...feature }) => <Reveal key={feature.number}><Link className={`feature-card ${feature.className}`} href={feature.href}><div className="feature-top"><Icon size={26} /><span>{feature.number} /</span></div><div className="feature-symbol" aria-hidden="true"><Icon strokeWidth={1} /></div><span className="eyebrow">{feature.label}</span><h3>{feature.title}</h3><p>{feature.text}</p><span className="feature-arrow"><ArrowUpRight size={22} /></span></Link></Reveal>)}</div>
    </section>
    <section className="story-section"><div className="pt-container story-grid"><div className="story-sticky"><span className="eyebrow">BUILT FOR THE WAY THEY WANDER</span><h2>Small on them.<br /><span>Big on possibility.</span></h2><p>A collar connects the dots between their next adventure and your next sigh of relief.</p><Link className="pt-button light-button" href="/about#hardware">Get to know the collar <ArrowUpRight size={19} /></Link><div className="story-orbits" aria-hidden="true"><div /><div /><PawPrint /></div></div><div className="story-steps">{[{ icon: MapPin, title: 'Follow the little detours.', body: 'Satellite positioning meets cellular connectivity. Open the map to see the latest location reported by a connected collar.', tag: '01 — LOCATION' }, { icon: ShieldCheck, title: 'Give freedom a boundary.', body: 'A garden, a familiar street, a favourite park. Try the safe-zone simulator below and see what happens at the edge.', tag: '02 — PROTECTION' }, { icon: Battery, title: 'Made to keep going.', body: 'Explore the hardware, battery, and connectivity behind the collar. Practical technology for everyday adventures.', tag: '03 — CONNECTION' }].map(({ icon: Icon, ...step }) => <Reveal className="story-step" key={step.tag}><Icon size={34} /><span className="eyebrow">{step.tag}</span><h3>{step.title}</h3><p>{step.body}</p></Reveal>)}</div></div></section>
    <div className="modern-demo"><GeofenceSimulator /></div>
    <section className="pt-section pt-container"><Reveal className="section-heading"><div><span className="eyebrow">GOOD NEIGHBOURS. GREAT STORIES.</span><h2>Every paw<br />has a <span>place.</span></h2></div><div><p>Meet the familiar faces that make your neighbourhood feel like home.</p><Link href="/explore" className="text-link">Meet the neighbourhood <ArrowUpRight size={18} /></Link></div></Reveal>
      <div className="community-grid">{state === 'loading' ? [0, 1, 2].map(i => <div key={i} className="animal-placeholder" aria-label="Loading animal" />) : animals.slice(0, 3).map(animal => <Reveal key={animal.id}><AnimalCard animal={animal} variant="editorial" /></Reveal>)}</div>
      {state !== 'loading' && animals.length === 0 && <div className="community-empty"><PawPrint size={35} /><p>{state === 'error' ? 'The neighbourhood directory is taking a moment. You can try again on the explore page.' : 'Every community starts with a familiar face. Add the first animal in yours.'}</p><Link className="text-link" href={state === 'error' ? '/explore' : '/register-animal'}>{state === 'error' ? 'Open directory' : 'Register an animal'} <ArrowRight size={18} /></Link></div>}
    </section>
    <div className="modern-specs"><SpecSheet /></div>
    <section className="closing-section"><Reveal><span className="eyebrow">HERE’S TO THE NEXT ADVENTURE</span><h2>A little closer.<br /><span>A lot more free.</span></h2><Link href="/register-animal" className="pt-button">Start your Pawtrace story <ArrowUpRight size={20} /></Link><p>Some call them strays. We call them neighbours.</p></Reveal><PawPrint className="closing-paw" aria-hidden="true" /></section>
  </div></MotionConfig>;
}
