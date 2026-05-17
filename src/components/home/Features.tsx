import Link from 'next/link';
import {
  Database,
  CheckCircle2,
  Repeat2,
  PackageSearch,
  ShieldCheck,
  Users,
  ArrowRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Database,
    title: '3000+ Produktów',
    description:
      'Największa baza linków. Znajdź buty, ubrania, akcesoria i wszystko, czego potrzebujesz.',
    href: '/products',
    color: 'from-primary to-purple-500',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Checker',
    description:
      'Przeglądaj zdjęcia QC przed zakupem, by mieć pewność najwyższej jakości produktów.',
    href: '/qc',
    color: 'from-accent to-cyan-400',
  },
  {
    icon: Repeat2,
    title: 'Konwerter Linków',
    description:
      'Konwertuj linki między agentami. Szybko i łatwo znajdź produkt u swojego agenta.',
    href: '/link-converter',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: PackageSearch,
    title: 'Śledzenie Paczek',
    description:
      'Śledź wszystkie zamówienia w jednym miejscu. Wszystkie trackery w zasięgu ręki.',
    href: '/tracking',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: ShieldCheck,
    title: 'Zweryfikowane Linki',
    description:
      'Wszystkie produkty są weryfikowane przez społeczność. Bezpieczne zakupy.',
    href: '/products',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'Społeczność',
    description:
      'Dołącz do 100 000+ osób na Discordzie. Dziel się wiedzą i znajdź pomoc.',
    href: 'https://discord.gg/yamoreps',
    color: 'from-indigo-500 to-purple-500',
  },
];

export default function Features() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent-400 mb-4">
            FUNKCJE
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
            Wszystko, czego <span className="gradient-text">potrzebujesz</span>
          </h2>
          <p className="mt-4 text-muted">
            Kompleksowe narzędzia do wyszukiwania produktów w jednym miejscu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative p-6 rounded-2xl bg-card border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`}
                />
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 group-hover:gap-2.5 transition-all">
                  Sprawdź
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
