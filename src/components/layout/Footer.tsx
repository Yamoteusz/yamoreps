import Link from 'next/link';
import { Sparkles, MessageCircle, Youtube, Music2 } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Produkt',
    links: [
      { href: '/products', label: 'Produkty' },
      { href: '/agents', label: 'Agenci' },
      { href: '/qc', label: 'Quality Check' },
      { href: '/link-converter', label: 'Konwerter Linków' },
      { href: '/tracking', label: 'Śledzenie Paczek' },
      { href: '/image-search', label: 'Wyszukiwanie Obrazem' },
    ],
  },
  {
    title: 'Społeczność',
    links: [
      { href: '/news', label: 'News' },
      { href: '/tutorials', label: 'Poradniki' },
      { href: '/sellers', label: 'Sprzedawcy' },
      { href: '/promotions', label: 'Promocje' },
      { href: '/tickets', label: 'Pomoc' },
    ],
  },
  {
    title: 'Firma',
    links: [
      { href: '/about', label: 'O nas' },
      { href: '/contact', label: 'Kontakt' },
      { href: '/terms', label: 'Regulamin' },
      { href: '/privacy', label: 'Prywatność' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                Yamo<span className="gradient-text">REPS</span>
              </span>
            </div>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              Najlepszy wyszukiwacz produktów. Dołącz do naszej społeczności i bądź
              na bieżąco.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://discord.gg/yamoreps"
                aria-label="Discord"
                className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-primary/20 hover:border-primary/40 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.tiktok.com/@yamoreps"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-primary/20 hover:border-primary/40 transition-colors flex items-center justify-center"
              >
                <Music2 className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.youtube.com/@yamoreps"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-primary/20 hover:border-primary/40 transition-colors flex items-center justify-center"
              >
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} YamoREPS. Wszystkie prawa zastrzeżone.
          </p>
          <p className="text-xs text-muted/70 max-w-xl text-center md:text-right">
            YamoREPS nie sprzedaje fizycznych produktów. Strona służy wyłącznie
            celom edukacyjnym. Nie wspieramy sprzedaży podróbek.
          </p>
        </div>
      </div>
    </footer>
  );
}
