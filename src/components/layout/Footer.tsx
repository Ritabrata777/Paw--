import Link from 'next/link';

const platformLinks = [
  { label: 'Explore Animals', href: '/explore' },
  { label: 'Live GPS Tracking', href: '/tracking' },
  { label: 'Community Sightings', href: '/sightings' },
  { label: 'Register Animal', href: '/register-animal' },
  { label: 'Emergency Animal Report', href: '/report-emergency' },
];

const aboutLinks = [
  { label: 'Our Mission', href: '/about' },
  { label: 'Collar Hardware (ESP32)', href: '/about#hardware' },
  { label: 'Safe Zones & Geofencing', href: '/#geofence' },
  { label: 'Full Spec Sheet', href: '/#specs' },
];

const legalLinks = [
  { label: 'Privacy & Location Policy', href: '/about' },
  { label: 'Terms of Use', href: '/about' },
  { label: 'Open Hardware Specs', href: 'https://github.com/pawtrace' },
];

export default function Footer() {
  return (
    <footer className="site-footer bg-[#241F4E] text-[#FFF7E8]">
      {/* Main footer */}
      <div className="mx-auto max-w-[var(--container-wide)] px-6 lg:px-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block" aria-label="Pawtrace home">
              <span className="font-display text-3xl font-extrabold tracking-tight text-[#FFF7E8]">
                paw<span className="text-[#FF8A3D]">trace</span>
              </span>
              <span className="block text-xs font-mono text-[#B7B2DC] mt-0.5">Pawtrace Platform</span>
            </Link>

            <p className="font-display text-xl text-[#FFC93C] leading-snug">
              Know exactly where your pet is. Down to the tree.
            </p>

            <p className="text-[14px] text-[#B7B2DC] leading-relaxed max-w-sm font-body">
              Independent 4G GPS tracking collars and community animal welfare platform.
              Giving neighbourhood dogs and cats an identity, live location tracking, and
              zero monthly subscription fees.
            </p>

            {/* Quick status pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-[#FFF7E8] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#4FCB77] animate-pulse" />
              <span>Connected care for every paw</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm uppercase tracking-widest text-[#B7B2DC] mb-5 font-bold">
              Platform
            </h4>
            <ul className="space-y-3 font-body text-sm">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#FFF7E8]/80 hover:text-[#FFC93C] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Technology */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm uppercase tracking-widest text-[#B7B2DC] mb-5 font-bold">
              Technology
            </h4>
            <ul className="space-y-3 font-body text-sm">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#FFF7E8]/80 hover:text-[#FFC93C] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Open Source */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm uppercase tracking-widest text-[#B7B2DC] mb-5 font-bold">
              Open Source
            </h4>
            <ul className="space-y-3 font-body text-sm mb-6">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#FFF7E8]/80 hover:text-[#FFC93C] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#B7B2DC] leading-relaxed font-body">
              Collar designs are open-source. Never locked into proprietary networks.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[var(--container-wide)] px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-[#B7B2DC]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Pawtrace — Some call them strays. We call them neighbours.
          </p>

          <div className="flex items-center gap-3">
            <span>4G Cellular</span>
            <span>•</span>
            <span>u-blox GNSS</span>
            <span>•</span>
            <span>No Subscription Fees</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
