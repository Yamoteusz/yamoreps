import Link from 'next/link';
import { Repeat2, Image as ImageIcon, MapPin, ArrowUpRight } from 'lucide-react';

const TOOLS = [
  {
    icon: Repeat2,
    title: 'Link Converter',
    description:
      'Konwertuj linki między Oopbuy, Pandabuy, Sugargoo, CSSBuy i innymi agentami jednym kliknięciem.',
    href: '/link-converter',
    accent: 'from-pink-500/20 to-rose-500/10',
  },
  {
    icon: ImageIcon,
    title: 'Quality Checker',
    description:
      'Pobieraj zdjęcia QC od różnych agentów. Sprawdź jakość przed zakupem.',
    href: '/qc',
    accent: 'from-primary/20 to-purple-500/10',
  },
  {
    icon: MapPin,
    title: 'Parcel Tracking',
    description:
      'Śledź swoje przesyłki od dowolnego przewoźnika w jednym miejscu.',
    href: '/tracking',
    accent: 'from-accent/20 to-cyan-500/10',
  },
];

export default function Tools() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-medium text-pink-300 mb-4">
            NARZĘDZIA
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
            Narzędzia <span className="gradient-text">produktowe</span>
          </h2>
          <p className="mt-4 text-muted">
            Wszystko, czego potrzebujesz, całkowicie za darmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className={`group relative p-8 rounded-3xl gradient-border overflow-hidden hover:-translate-y-1 transition-transform duration-300`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-primary-300 transition-colors" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
