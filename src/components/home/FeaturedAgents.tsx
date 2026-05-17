import Link from 'next/link';
import { ArrowUpRight, Crown, Sparkles } from 'lucide-react';
import { FEATURED_AGENTS } from '@/lib/data';

export default function FeaturedAgents() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-aurora opacity-20 pointer-events-none" />
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300 mb-4">
              <Crown className="w-3.5 h-3.5" />
              POLECANI AGENCI
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
              Główni <span className="gradient-text">agenci zakupowi</span>
            </h2>
            <p className="mt-3 text-muted max-w-xl">
              Sprawdzeni partnerzy, których polecamy społeczności. Bezpieczne
              zakupy i najlepsze ceny wysyłki.
            </p>
          </div>
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-sm font-medium transition-colors w-fit"
          >
            Zobacz wszystkich
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_AGENTS.map((agent, idx) => {
            const isHero = idx === 0;
            return (
              <Link
                key={agent.name}
                href={agent.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  isHero ? 'lg:col-span-1 lg:row-span-1' : ''
                }`}
              >
                {/* Animated gradient border for the hero card */}
                {isHero && (
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                )}

                <div
                  className={`relative h-full p-7 rounded-3xl ${
                    isHero
                      ? 'bg-card'
                      : 'bg-card border border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  {/* Background glow */}
                  <div
                    className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity bg-gradient-to-br ${agent.color}`}
                  />

                  {isHero && (
                    <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
                      <Sparkles className="w-3 h-3" />
                      POLECANY
                    </span>
                  )}

                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl mb-5 shadow-lg`}
                    >
                      {agent.logo}
                    </div>

                    <h3 className="font-display font-bold text-2xl mb-2">
                      {agent.name}
                    </h3>

                    {agent.description && (
                      <p className="text-sm text-muted leading-relaxed mb-6">
                        {agent.description}
                      </p>
                    )}

                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 group-hover:gap-2.5 transition-all">
                      Przejdź do agenta
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
