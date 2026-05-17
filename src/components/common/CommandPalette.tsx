'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Package,
  Repeat2,
  Image as ImageIcon,
  MapPin,
  Users,
  Newspaper,
  Sparkles,
  ArrowRight,
  Hash,
} from 'lucide-react';
import type { Product } from '@/lib/products';

interface Action {
  id: string;
  label: string;
  hint?: string;
  icon: any;
  onSelect: () => void;
  group: 'Strony' | 'Produkty' | 'Akcje';
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState(0);

  // Toggle with cmd/ctrl + K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lazy-load products on first open
  useEffect(() => {
    if (open && products.length === 0) {
      fetch('/api/products')
        .then((r) => r.json())
        .then(setProducts)
        .catch(() => {});
    }
  }, [open, products.length]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQ('');
      setActive(0);
    }
  }, [open]);

  const actions: Action[] = useMemo(() => {
    const pages: Action[] = [
      {
        id: 'p-home',
        label: 'Strona główna',
        icon: Sparkles,
        group: 'Strony',
        onSelect: () => router.push('/'),
      },
      {
        id: 'p-products',
        label: 'Produkty',
        icon: Package,
        group: 'Strony',
        onSelect: () => router.push('/products'),
      },
      {
        id: 'p-agents',
        label: 'Agenci',
        icon: Users,
        group: 'Strony',
        onSelect: () => router.push('/agents'),
      },
      {
        id: 'p-converter',
        label: 'Konwerter linków',
        icon: Repeat2,
        group: 'Strony',
        onSelect: () => router.push('/link-converter'),
      },
      {
        id: 'p-qc',
        label: 'Quality Check',
        icon: ImageIcon,
        group: 'Strony',
        onSelect: () => router.push('/qc'),
      },
      {
        id: 'p-tracking',
        label: 'Tracking',
        icon: MapPin,
        group: 'Strony',
        onSelect: () => router.push('/tracking'),
      },
      {
        id: 'p-sellers',
        label: 'Sprzedawcy',
        icon: Users,
        group: 'Strony',
        onSelect: () => router.push('/sellers'),
      },
      {
        id: 'p-news',
        label: 'News',
        icon: Newspaper,
        group: 'Strony',
        onSelect: () => router.push('/news'),
      },
    ];

    const productActions: Action[] = products.map((p) => ({
      id: `prod-${p.id}`,
      label: p.name,
      hint: `${p.category} · $${p.price.toFixed(2)}`,
      icon: Hash,
      group: 'Produkty',
      onSelect: () => router.push(`/products/${p.id}`),
    }));

    return [...pages, ...productActions];
  }, [products, router]);

  const filtered = useMemo(() => {
    if (!q) return actions;
    const lc = q.toLowerCase();
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(lc) ||
        (a.hint?.toLowerCase().includes(lc) ?? false)
    );
  }, [actions, q]);

  function run(action: Action) {
    action.onSelect();
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[active];
      if (target) run(target);
    }
  }

  if (!open) return null;

  // Group results
  const grouped = filtered.reduce<Record<string, Action[]>>((acc, a) => {
    (acc[a.group] = acc[a.group] || []).push(a);
    return acc;
  }, {});

  let runningIdx = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-up"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-card border border-white/[0.1] overflow-hidden shadow-2xl shadow-primary/20"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Szukaj produktów, stron, akcji..."
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted"
          />
          <kbd className="hidden sm:inline text-[10px] px-2 py-1 rounded bg-white/[0.06] border border-white/[0.06] text-muted">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted text-sm">
              Brak wyników dla &quot;{q}&quot;.
            </div>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-2">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted">
                {group}
              </div>
              {items.map((item) => {
                runningIdx++;
                const isActive = runningIdx === active;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActive(runningIdx)}
                    onClick={() => run(item)}
                    className={
                      isActive
                        ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 text-left'
                        : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] border border-transparent text-left'
                    }
                  >
                    <Icon className="w-4 h-4 text-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.label}</p>
                      {item.hint && (
                        <p className="text-xs text-muted truncate">
                          {item.hint}
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <ArrowRight className="w-4 h-4 text-primary-300" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06]">
              ↑↓
            </kbd>
            nawigacja
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06]">
              ↵
            </kbd>
            wybierz
          </span>
        </div>
      </div>
    </div>
  );
}
