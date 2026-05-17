'use client';

import Link from 'next/link';
import { ArrowRight, Compass, Users } from 'lucide-react';
import { STATS } from '@/lib/data';

export default function Hero() {
  return (
    <section className="relative pt-36 md:pt-44 pb-24 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-aurora pointer-events-none" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid-32 opacity-60 pointer-events-none"
        style={{
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute top-48 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-xs font-medium tracking-wide animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-muted">NAJLEPSZY SPREADSHEET W POLSCE</span>
          </div>

          <h1
            className="mt-8 font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tighter max-w-5xl animate-fade-up"
            style={{ animationDelay: '120ms', opacity: 0 }}
          >
            Wszystko, czego potrzebujesz{' '}
            <span className="gradient-text">w jednym miejscu.</span>
          </h1>

          <p
            className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed animate-fade-up"
            style={{ animationDelay: '220ms', opacity: 0 }}
          >
            Baza zweryfikowanych produktów, konwerter linków, QC i tracking. Wszystko,
            czego potrzebujesz, by kupować mądrze i bezpiecznie.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-up"
            style={{ animationDelay: '320ms', opacity: 0 }}
          >
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base bg-gradient-to-r from-primary via-purple-600 to-accent text-white overflow-hidden glow-primary hover:scale-[1.02] transition-transform"
            >
              <Compass className="w-5 h-5" />
              Przeglądaj Spreadsheet
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="https://discord.gg/yamoreps"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] backdrop-blur-sm transition-colors"
            >
              <Users className="w-5 h-5" />
              Dołącz do Społeczności
            </Link>
          </div>

          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-3xl animate-fade-up"
            style={{ animationDelay: '420ms', opacity: 0 }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-display font-bold text-3xl md:text-4xl gradient-text">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs text-muted uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
