'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, PawPrint } from 'lucide-react';
const links = [{ label: 'Explore', href: '/explore' }, { label: 'Live tracking', href: '/tracking' }, { label: 'Community', href: '/sightings' }, { label: 'Our story', href: '/about' }];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', keydown); };
  }, [open]);
  const close = () => setOpen(false);
  return <header className="site-header"><nav className="site-nav" aria-label="Main navigation"><Link href="/" onClick={close} className="site-brand" aria-label="Pawtrace home"><span><PawPrint size={22} fill="currentColor" /></span>pawtrace<span className="brand-period">®</span></Link><div className="desktop-nav">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}</div><div className="nav-actions"><Link href="/login">Log in</Link><Link className="nav-cta" href="/register-animal">Join the pack <ArrowUpRight size={16} /></Link></div><button ref={toggle} type="button" className="nav-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav>{open && <div id="mobile-navigation" className="mobile-nav" ref={panel}>{links.map(link => <Link key={link.href} href={link.href} onClick={close}>{link.label}<ArrowUpRight size={18} /></Link>)}<Link href="/login" onClick={close}>Log in</Link><Link href="/register-animal" onClick={close}>Join the pack <PawPrint size={18} /></Link></div>}</header>;
}
