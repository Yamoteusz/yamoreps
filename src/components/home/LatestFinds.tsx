import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getAllProducts } from '@/lib/products';

export default async function LatestFinds() {
  const products = (await getAllProducts()).slice(0, 12);
  return (
    <section className="relative py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary-300 mb-4">
              <Flame className="w-3.5 h-3.5" />
              POPULARNE
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
              Najnowsze <span className="gradient-text">znaleziska</span>
            </h2>
            <p className="mt-3 text-muted max-w-xl">
              Świeżo zweryfikowane produkty, polecane przez naszą społeczność.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-sm font-medium transition-colors"
          >
            Zobacz wszystkie
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium"
          >
            Zobacz wszystkie
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
