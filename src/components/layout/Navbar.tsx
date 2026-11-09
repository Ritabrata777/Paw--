'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Radio, Compass, ShieldAlert } from 'lucide-react';
import { useScrollDirection } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Explore Animals', href: '/explore' },
  { label: 'Live GPS Tracking', href: '/tracking' },
  { label: 'Community Sightings', href: '/sightings' },
  { label: 'How It Works', href: '/about' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isHidden = scrollDirection === 'down' && scrolled && !mobileOpen;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isHidden ? '-translate-y-full' : 'translate-y-0',
          scrolled
            ? 'bg-[#EEF1EA]/95 backdrop-blur-md border-b-2 border-[#DFDFDF] shadow-xs'
            : 'bg-[#EEF1EA]'
        )}
      >
        {/* Top mini announcement banner like pawtraces.com */}
        <div className="bg-[#241F4E] text-[#FFF7E8] text-center py-1.5 px-4 text-xs font-display font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4FCB77] animate-pulse" />
          <span>Independent 4G GPS Tracking Mesh • Zero Monthly Software Fees</span>
          <Link href="/about" className="underline font-bold text-[#FFC93C] hover:text-white ml-2">
            Learn More →
          </Link>
        </div>

        <nav className="mx-auto flex h-[72px] max-w-[var(--container-wide)] items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Pawthik Home">
            <span className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#241F4E] select-none">
              Paw<span className="text-[#FF8A3D]">-থিক</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-display font-bold px-2 py-0.5 rounded-full bg-[#FFF7E8] text-[#241F4E] border border-[#241F4E]/30">
              Pawthik
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-[15px] font-display font-bold tracking-tight transition-colors duration-150 rounded-full',
                    isActive
                      ? 'bg-[#241F4E] text-[#FFF7E8]'
                      : 'text-[#241F4E] hover:bg-[#FFF7E8] hover:text-[#FF8A3D]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-[14px] font-display font-bold text-[#5F5A8C] hover:text-[#241F4E] px-3 py-2"
            >
              Sign In
            </Link>

            <Button
              href="/register-animal"
              size="sm"
              variant="primary"
            >
              Register Animal
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-[#241F4E] hover:bg-white border-2 border-[#241F4E]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[108px] z-40 bg-[#EEF1EA] border-b-4 border-[#241F4E] p-6 shadow-xl lg:hidden flex flex-col gap-4 font-display"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-bold text-[#241F4E] hover:text-[#FF8A3D] py-2 border-b border-[#DFDFDF]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <Button href="/register-animal" variant="primary" fullWidth onClick={() => setMobileOpen(false)}>
                Register an Animal
              </Button>
              <Button href="/tracking" variant="secondary" fullWidth onClick={() => setMobileOpen(false)}>
                Live Tracking Map
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
