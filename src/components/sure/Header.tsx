'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';

const NAV_ITEMS = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#engineering' },
  { label: 'Projects', href: '#projects' },
  { label: 'Companies', href: '#sure-system' },
  { label: 'Careers / HR', href: '#hr-form' },
  { label: 'Contact', href: '#contact-form' },
];

export default function Header() {
  const theme = useSyncExternalStore(
    callback => { window.addEventListener('sure-theme-change', callback); window.addEventListener('storage', callback); return () => { window.removeEventListener('sure-theme-change', callback); window.removeEventListener('storage', callback); }; },
    () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    () => 'light',
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event('sure-theme-change'));
    try { window.localStorage.setItem('sure-theme', next); } catch { /* Theme remains usable for this visit. */ }
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);
  const themeLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-seam-line bg-mech-navy/95 backdrop-blur-xl" role="banner">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-3">
          <a href="#hero" onClick={closeMenu} className="relative z-10 flex items-center gap-2 sm:gap-3 min-w-0" aria-label="SURE Mechanical home">
            <span className="relative block h-10 w-48 overflow-hidden sm:w-56"><Image src={assetPath('/brand/SURE_MECHANICAL_alpha.png')} alt="SURE Mechanical" width={2048} height={704} priority className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2" /></span>
          </a>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => <a key={item.href} href={item.href} className="px-2.5 py-2 text-[11px] font-mono uppercase tracking-[0.07em] text-galv-silver hover:text-bright-cyan focus-visible:outline-2">{item.label}</a>)}
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className="h-11 w-11 flex items-center justify-center border border-seam-line rounded-md text-blueprint-white hover:text-cool-teal focus-visible:outline-2">
              {theme === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
            </button>
            <a href="#project-form" className="hidden lg:inline-flex items-center justify-center rounded-sm bg-cool-teal px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-mech-navy hover:brightness-110">Start a Project</a>
            <button id="menu-toggle" type="button" onClick={() => setMobileOpen(v => !v)} className="lg:hidden h-11 w-11 flex items-center justify-center text-blueprint-white border border-seam-line rounded-md" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="sure-mobile-menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav id="sure-mobile-menu" aria-label="Mobile navigation" className="lg:hidden absolute top-16 inset-x-0 bg-mech-navy border-b border-seam-line shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto px-5 pt-5 pb-8">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(item => <a key={item.href} href={item.href} onClick={closeMenu} className="block min-h-12 px-3 py-3 text-base font-medium text-blueprint-white hover:text-cool-teal border-b border-seam-line/50">{item.label}</a>)}
            <a href="#project-form" onClick={closeMenu} className="mt-5 min-h-12 flex items-center justify-center rounded-md bg-cool-teal px-4 py-3 text-mech-navy font-semibold uppercase text-sm">Start a Project</a>
          </div>
        </nav>
      )}
    </header>
  );
}
