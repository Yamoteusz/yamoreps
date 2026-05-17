'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { type Product } from '@/lib/products';
import { cn } from '@/lib/utils';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating';

const PAGE_SIZE = 48;

export default function ProductsBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('Wszystkie');
  const [activeTag, setActiveTag] = useState<string>('Wszystkie');
  const [sort, setSort] = useState<SortKey>('newest');
  const [visible, setVisible] = useState<number>(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (activeCat !== 'Wszystkie' && p.category !== activeCat) return false;
      if (activeTag !== 'Wszystkie' && p.tag !== activeTag) return false;
      if (
        query &&
        !p.name.toLowerCase().includes(query.toLowerCase()) &&
        !p.category.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating || b.reviews - a.reviews;
        case 'newest':
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
    return list;
  }, [products, query, activeCat, activeTag, sort]);

  // Reset pagination when filters change
  const visibleProducts = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function applyFilter(fn: () => void) {
    fn();
    setVisible(PAGE_SIZE);
  }

  const cats = ['Wszystkie', ...categories];
  const tags = ['Wszystkie', 'BEST', 'BUDGET', 'NEW', 'RANDOM'];

  return (
    <>
      <section className="pt-4">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                value={query}
                onChange={(e) => applyFilter(() => setQuery(e.target.value))}
                type="text"
                placeholder="Szukaj produktu..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted"
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => applyFilter(() => setSort(e.target.value as SortKey))}
                className="appearance-none pl-11 pr-10 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 focus:outline-none text-sm"
              >
                <option value="newest" className="bg-card">Najnowsze</option>
                <option value="price-asc" className="bg-card">Cena: rosnąco</option>
                <option value="price-desc" className="bg-card">Cena: malejąco</option>
                <option value="rating" className="bg-card">Popularność</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => applyFilter(() => setActiveCat(cat))}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  activeCat === cat
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-muted hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => applyFilter(() => setActiveTag(tag))}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors',
                  activeTag === tag
                    ? 'bg-white text-black'
                    : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-muted'
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted mb-6 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            {filtered.length} {filtered.length === 1 ? 'produkt' : 'produktów'}
            {hasMore && (
              <span className="text-xs">
                · pokazano {visibleProducts.length}
              </span>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/[0.06] border-dashed text-center text-muted">
              Brak produktów spełniających kryteria.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-sm font-medium transition-colors"
                  >
                    Pokaż więcej
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
