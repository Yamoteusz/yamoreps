'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/products', label: 'Produkty' },
  { href: '/agents', label: 'Agenci' },
  { href: '/qc', label: 'Quality Check' },
  { href: '/link-converter', label: 'Konwerter' },
  { href: '/tracking', label: 'Tracking' },
  { href: '/sellers', label: 'Sprzedawcy' },
  { href: '/news', label: 'News' },
];

function openPalette() {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', metaKey: true })
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'py-3 bg-background/70 backdrop-blur-xl border-b border-white/[0.06]'
          : 'py-5 bg-transparent border-b border-transparent'
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-purple-600 to-accent flex items-center justify-center overflow-hidden glow-primary">
            <Sparkles className="w-5 h-5 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-conic from-primary via-accent to-primary animate-spin-slow opacity-50" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-lg tracking-tight">
              Yamo<span className="gradient-text">REPS</span>
            </span>
            <span className="text-[10px] text-muted uppercase tracking-widest">
              Spreadsheet
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-muted hover:text-foreground rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Szukaj"
            onClick={openPalette}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors text-sm text-muted"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline">Szukaj produktu...</span>
            <kbd className="hidden xl:inline text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06]">
              ⌘K
            </kbd>
          </button>

          <Link
            href="https://discord.gg/yamoreps"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary"
          >
            Dołącz
          </Link>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden mt-3 mx-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/[0.08] p-3 animate-fade-up">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-muted hover:text-foreground rounded-lg hover:bg-white/[0.04]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
