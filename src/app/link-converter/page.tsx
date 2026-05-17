'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { AGENTS } from '@/lib/data';
import { ArrowRight, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConvertResult {
  platform: string;
  platformLabel: string;
  id: string;
  results: { key: string; name: string; url: string }[];
}

const EXAMPLES = [
  'https://item.taobao.com/item.htm?id=687234812938',
  'https://weidian.com/item.html?itemID=4456789012',
  'https://detail.1688.com/offer/678234.html',
];

export default function LinkConverterPage() {
  const [link, setLink] = useState('');
  const [data, setData] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pre-fill from URL ?prefill=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('prefill');
    if (prefill) {
      setLink(prefill);
      convert(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function convert(input?: string) {
    const url = (input ?? link).trim();
    if (!url) return;
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? 'Błąd konwersji.');
      } else {
        setData(body);
      }
    } catch {
      setError('Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  }

  async function copy(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  return (
    <>
      <PageHeader
        eyebrow="NARZĘDZIE"
        title={
          <>
            Konwerter <span className="gradient-text">linków</span>
          </>
        }
        description="Wklej dowolny link z Taobao, Weidian, 1688 lub Tmall i otrzymaj gotowe linki dla wszystkich agentów. Twój link Mulebuy zawiera kod afiliacyjny."
      />

      <section className="pb-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="rounded-3xl gradient-border p-8 md:p-10">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Link źródłowy
            </label>
            <textarea
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://item.taobao.com/item.htm?id=..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted resize-none font-mono"
            />

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>Spróbuj:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setLink(ex);
                    convert(ex);
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors font-mono"
                >
                  {ex.split('?')[0].split('//')[1].split('/')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={() => convert()}
              disabled={loading}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary disabled:opacity-60"
            >
              {loading ? 'Konwertowanie...' : 'Konwertuj'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {error && (
              <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 animate-fade-up">
                {error}
              </div>
            )}
          </div>

          {data && (
            <div className="mt-10 animate-fade-up">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  ✓ Wykryto: {data.platformLabel}
                </span>
                <span className="text-xs text-muted">
                  ID produktu:{' '}
                  <code className="font-mono text-foreground">{data.id}</code>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.results.map((r) => {
                  const agent = AGENTS.find(
                    (a) => a.name.toLowerCase() === r.key
                  );
                  const isMulebuy = r.key === 'mulebuy';
                  return (
                    <div
                      key={r.key}
                      className={cn(
                        'group relative p-4 rounded-2xl bg-card border transition-all',
                        isMulebuy
                          ? 'border-violet-500/40 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5'
                          : 'border-white/[0.06] hover:border-white/[0.12]'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${agent?.color ?? 'from-primary to-accent'} flex items-center justify-center text-lg shrink-0`}
                        >
                          {agent?.logo ?? '🛒'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{r.name}</span>
                            {isMulebuy && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
                                <Sparkles className="w-2.5 h-2.5" />
                                AFFILIATE
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <code className="block text-xs text-muted break-all bg-black/20 rounded-lg px-3 py-2 mb-3 font-mono">
                        {r.url}
                      </code>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copy(r.key, r.url)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-xs font-medium transition-colors"
                        >
                          {copiedKey === r.key ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Skopiowano
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Kopiuj
                            </>
                          )}
                        </button>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-xs font-medium hover:opacity-90 transition-opacity"
                        >
                          Otwórz
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
