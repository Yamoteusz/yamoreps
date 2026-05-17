'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import Lightbox from '@/components/common/Lightbox';
import {
  Search,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Info,
  ArrowRight,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AGENTS } from '@/lib/data';

interface QCSet {
  id: string;
  agent: string;
  label?: string;
  images: string[];
  createdAt: string;
}

interface QCResult {
  platform: string;
  platformLabel: string;
  id: string;
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
  } | null;
  qcSets: QCSet[];
  agentLinks: { key: string; name: string; url: string }[];
  fallbackSources: { name: string; url: string; featured?: boolean }[];
}

export default function QCPage() {
  const [link, setLink] = useState('');
  const [data, setData] = useState<QCResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    title: string;
    subtitle: string;
    startIndex: number;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('prefill');
    if (prefill) {
      setLink(prefill);
      run(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(input: string) {
    if (!input.trim()) return;
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch('/api/qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input.trim() }),
      });
      const body = await res.json();
      if (!res.ok) setError(body.error ?? 'Nie udało się pobrać QC.');
      else setData(body);
    } catch {
      setError('Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="QUALITY CHECK"
        title={
          <>
            Sprawdź jakość <span className="gradient-text">przed zakupem</span>
          </>
        }
        description="Wklej link do produktu, by zobaczyć zdjęcia QC zebrane przez naszą społeczność. Każdy zestaw to realne fotki z magazynu agenta."
      />

      <section className="pb-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          {/* Input */}
          <div className="rounded-3xl gradient-border p-6 md:p-8">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Link do produktu
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && run(link)}
                  placeholder="https://item.taobao.com/item.htm?id=..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted font-mono"
                />
              </div>
              <button
                onClick={() => run(link)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Szukanie...' : 'Sprawdź QC'}
              </button>
            </div>

            {error && (
              <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 animate-fade-up">
                {error}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Results */}
          {data && !loading && (
            <div className="mt-10 animate-fade-up">
              {/* Detected info */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  ✓ Wykryto: {data.platformLabel}
                </span>
                <span className="text-xs text-muted">
                  ID: <code className="font-mono text-foreground">{data.id}</code>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-muted">
                  {data.qcSets.length}{' '}
                  {data.qcSets.length === 1 ? 'set QC' : 'setów QC'}
                </span>
              </div>

              {/* Matched product card */}
              {data.product && (
                <Link
                  href={`/products/${data.product.id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-white/[0.06] hover:border-white/[0.15] transition-all mb-8"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={data.product.image}
                      alt={data.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted mb-1">
                      Produkt z bazy
                    </div>
                    <p className="font-display font-semibold text-lg truncate">
                      {data.product.name}
                    </p>
                    <p className="text-sm text-muted">
                      {data.product.category} · ${data.product.price.toFixed(2)}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary-300 transition-colors shrink-0" />
                </Link>
              )}

              {/* QC Sets — main feature */}
              {data.qcSets.length > 0 && (
                <div className="mb-12">
                  <h3 className="font-display font-semibold text-2xl mb-5 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary-300" />
                    Galerie QC
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.qcSets.map((set, setIndex) => (
                      <QCSetCard
                        key={set.id}
                        set={set}
                        productName={data.product?.name ?? ''}
                        setNumber={setIndex + 1}
                        onOpen={(startIndex) =>
                          setLightbox({
                            images: set.images,
                            title: set.label ?? `${set.agent} QC`,
                            subtitle: data.product?.name ?? '',
                            startIndex,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No QC photos: helpful info */}
              {data.qcSets.length === 0 && (
                <div className="mb-12 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4">
                  <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-300" />
                  <div className="text-sm text-blue-200/80">
                    <p className="font-semibold text-blue-100 mb-1">
                      Brak galerii QC w naszej bazie dla tego produktu.
                    </p>
                    <p>
                      Skorzystaj z linków poniżej, by sprawdzić QC bezpośrednio
                      u agenta. Galerie wymagają zalogowania.
                    </p>
                  </div>
                </div>
              )}

              {/* Always show: deep links to agents */}
              <h3 className="font-display font-semibold text-xl mb-4">
                Sprawdź QC u agenta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.fallbackSources.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'group flex items-center gap-3 p-4 rounded-2xl border transition-all hover:-translate-y-0.5',
                      source.featured
                        ? 'bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border-violet-500/40'
                        : 'bg-card border-white/[0.06] hover:border-white/[0.15]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        source.featured
                          ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
                          : 'bg-white/[0.04] border border-white/[0.06]'
                      )}
                    >
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{source.name}</span>
                        {source.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
                            <Sparkles className="w-2.5 h-2.5" />
                            POLECANY
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary-300 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!data && !loading && !error && (
            <div className="mt-10 p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] border-dashed text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] mx-auto flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-muted" />
              </div>
              <p className="text-muted">
                Wklej link do produktu, by zobaczyć galerie QC.
              </p>
              <button
                onClick={() => {
                  const ex = 'https://item.taobao.com/item.htm?id=687234812938';
                  setLink(ex);
                  run(ex);
                }}
                className="mt-5 px-4 py-2 rounded-lg text-sm bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
              >
                Spróbuj z przykładowym linkiem
              </button>
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          title={lightbox.title}
          subtitle={lightbox.subtitle}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function QCSetCard({
  set,
  productName,
  setNumber,
  onOpen,
}: {
  set: QCSet;
  productName: string;
  setNumber: number;
  onOpen: (startIndex: number) => void;
}) {
  const agent = AGENTS.find(
    (a) => a.name.toLowerCase() === set.agent.toLowerCase()
  );
  const visible = set.images.slice(0, 4);
  const remaining = set.images.length - visible.length;

  return (
    <div className="group rounded-2xl bg-card border border-white/[0.06] overflow-hidden hover:border-white/[0.15] transition-colors">
      <div className="grid grid-cols-2 gap-1 p-1">
        {visible.map((img, i) => (
          <button
            key={i}
            onClick={() => onOpen(i)}
            className={cn(
              'relative aspect-square rounded-xl overflow-hidden',
              visible.length === 1 && 'col-span-2 aspect-[4/3]',
              visible.length === 3 && i === 0 && 'col-span-2'
            )}
          >
            <Image
              src={img}
              alt={`${set.label ?? set.agent} - ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform group-hover:scale-[1.02] duration-500"
            />
            {i === visible.length - 1 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="font-display font-bold text-2xl text-white">
                  +{remaining}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 border-t border-white/[0.04]">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent?.color ?? 'from-primary to-accent'} flex items-center justify-center text-lg shrink-0`}
        >
          {agent?.logo ?? '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {set.label ?? `${set.agent} QC Set #${setNumber}`}
          </p>
          <p className="text-xs text-muted">
            {set.images.length} {set.images.length === 1 ? 'zdjęcie' : 'zdjęć'}
            {productName ? ` · ${productName}` : ''}
          </p>
        </div>
        <button
          onClick={() => onOpen(0)}
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-xs font-medium transition-colors"
        >
          Otwórz
        </button>
      </div>
    </div>
  );
}
