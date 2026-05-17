import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  MessageSquare,
  ArrowLeft,
  ImageIcon,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { getProduct } from '@/lib/products';
import { buildAll, parseLink, platformLabel } from '@/lib/converter';
import { AGENTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import ProductQCGallery from './ProductQCGallery';
import type { Metadata } from 'next';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Produkt nie znaleziony' };
  return {
    title: product.name,
    description: `${product.name} — ${product.category}, $${product.price.toFixed(2)}. Zweryfikowany produkt na YamoREPS.`,
    openGraph: {
      title: product.name,
      description: `${product.category} · $${product.price.toFixed(2)}`,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const parsed = parseLink(product.sourceUrl);
  const agentLinks = parsed ? buildAll(parsed) : [];

  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do bazy
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-white/[0.06]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute top-5 left-5 flex gap-2">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold tracking-wider',
                  product.tag === 'BEST' &&
                    'bg-gradient-to-r from-primary to-purple-500 text-white',
                  product.tag === 'BUDGET' &&
                    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
                  product.tag === 'RANDOM' &&
                    'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                  product.tag === 'NEW' &&
                    'bg-gradient-to-r from-accent to-cyan-400 text-black'
                )}
              >
                {product.tag}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10">
                {product.category}
              </span>
            </div>
          </div>

          <div>
            {parsed && (
              <span className="inline-block text-xs uppercase tracking-widest text-muted mb-3">
                {platformLabel(parsed.platform)} · ID {parsed.id}
              </span>
            )}
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-5 text-sm text-muted">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {product.rating} / 5
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                {product.reviews.toLocaleString()} recenzji
              </span>
            </div>

            <div className="mt-6 inline-flex items-baseline gap-2">
              <span className="font-display font-bold text-5xl gradient-text">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-muted text-sm">~ cena u sprzedawcy</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/qc?prefill=${encodeURIComponent(product.sourceUrl)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-sm font-medium transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Sprawdź QC
              </Link>
              <Link
                href={`/link-converter?prefill=${encodeURIComponent(product.sourceUrl)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Konwerter
              </Link>
            </div>

            {agentLinks.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display font-semibold text-xl mb-4">
                  Kup u agenta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agentLinks.map((al) => {
                    const agent = AGENTS.find(
                      (a) => a.name.toLowerCase() === al.key
                    );
                    const isMulebuy = al.key === 'mulebuy';
                    return (
                      <a
                        key={al.key}
                        href={al.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'group flex items-center gap-3 p-3 rounded-xl border transition-all hover:-translate-y-0.5',
                          isMulebuy
                            ? 'bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border-violet-500/40'
                            : 'bg-card border-white/[0.06] hover:border-white/[0.15]'
                        )}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent?.color ?? 'from-primary to-accent'} flex items-center justify-center text-lg shrink-0`}
                        >
                          {agent?.logo ?? '🛒'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {al.name}
                            </span>
                            {isMulebuy && (
                              <Sparkles className="w-3 h-3 text-fuchsia-300" />
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary-300 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {product.qcSets && product.qcSets.length > 0 && (
          <ProductQCGallery
            productName={product.name}
            qcSets={product.qcSets}
          />
        )}
      </div>
    </section>
  );
}
