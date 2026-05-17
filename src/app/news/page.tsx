import PageHeader from '@/components/layout/PageHeader';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';

const NEWS = [
  {
    title: 'Nowy agent zakupowy USFans dostępny w bazie',
    excerpt:
      'Dodaliśmy USFans do listy wspieranych agentów. Zobacz jak konwertować linki.',
    date: '15 maja 2026',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    category: 'Aktualizacja',
  },
  {
    title: 'Top 10 znalezisk maja',
    excerpt:
      'Społeczność wybrała najlepsze produkty miesiąca. Sprawdź pełną listę.',
    date: '10 maja 2026',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: 'Ranking',
  },
  {
    title: 'Jak przejść przez cło bez problemów',
    excerpt:
      'Kompletny przewodnik po opłatach celnych dla zamówień z Chin do Polski.',
    date: '5 maja 2026',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    category: 'Poradnik',
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="NEWS"
        title={
          <>
            Aktualności <span className="gradient-text">i nowości</span>
          </>
        }
        description="Bądź na bieżąco z nowościami, poradnikami i aktualizacjami z community."
      />

      <section className="pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEWS.map((article) => (
              <Link
                key={article.title}
                href="#"
                className="group rounded-2xl overflow-hidden bg-card border border-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    {article.date}
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2 group-hover:text-primary-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 group-hover:gap-2.5 transition-all">
                    Czytaj więcej
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
