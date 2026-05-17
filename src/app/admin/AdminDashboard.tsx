'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  LogOut,
  Package,
  TrendingUp,
  Star,
  X,
  Sparkles,
  Camera,
  Image as ImageIcon,
  GitBranch,
  AlertTriangle,
} from 'lucide-react';
import { type Product, type ProductTag, type QCSet } from '@/lib/products';
import { AGENTS } from '@/lib/data';

interface Props {
  initialProducts: Product[];
}

const TAGS: ProductTag[] = ['BEST', 'BUDGET', 'RANDOM', 'NEW'];
const CATEGORIES = [
  'Shoes',
  'Hoodies',
  'T-Shirts',
  'Pants',
  'Shorts',
  'Underwear',
  'Socks',
  'Accessories',
  'Bags',
  'Watches',
  'Lego',
  'Other',
];

export default function AdminDashboard({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [qcModal, setQcModal] = useState<Product | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    githubSyncEnabled: boolean;
    repo: string | null;
    branch: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/admin/status')
      .then((r) => (r.ok ? r.json() : null))
      .then(setSyncStatus)
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm('Usunąć produkt?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((p) => p.filter((x) => x.id !== id));
  }

  function onCreated(p: Product) {
    setProducts((prev) => [p, ...prev]);
    setOpen(false);
  }

  function onQCUpdated(p: Product) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    setQcModal(p);
  }

  const stats = {
    total: products.length,
    best: products.filter((p) => p.tag === 'BEST').length,
    avgPrice:
      products.length > 0
        ? (
            products.reduce((s, p) => s + p.price, 0) / products.length
          ).toFixed(2)
        : '0.00',
  };

  return (
    <>
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                ADMIN PANEL
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
                Zarządzaj <span className="gradient-text">produktami</span>
              </h1>
              <p className="mt-2 text-muted">
                Dodawaj nowe znaleziska i edytuj istniejące.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary"
              >
                <Plus className="w-4 h-4" />
                Dodaj produkt
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Wyloguj
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={Package}
              label="Wszystkie produkty"
              value={stats.total.toString()}
              color="from-primary to-purple-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Oznaczone jako BEST"
              value={stats.best.toString()}
              color="from-accent to-cyan-400"
            />
            <StatCard
              icon={Star}
              label="Średnia cena"
              value={`$${stats.avgPrice}`}
              color="from-amber-500 to-orange-500"
            />
          </div>

          {syncStatus && (
            <div
              className={
                syncStatus.githubSyncEnabled
                  ? 'mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3 text-sm'
                  : 'mt-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-3 text-sm'
              }
            >
              {syncStatus.githubSyncEnabled ? (
                <>
                  <GitBranch className="w-5 h-5 text-emerald-300 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-emerald-200">
                      GitHub sync aktywny
                    </p>
                    <p className="text-xs text-emerald-200/70">
                      Każda zmiana commituje się do{' '}
                      <code className="font-mono">
                        {syncStatus.repo}@{syncStatus.branch}
                      </code>
                      . Cloudflare automatycznie buduje deploy ~60s po pushu.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-200">
                      GitHub sync wyłączony — zmiany w pamięci
                    </p>
                    <p className="text-xs text-amber-200/70">
                      Ustaw <code className="font-mono">GITHUB_TOKEN</code>,{' '}
                      <code className="font-mono">GITHUB_REPO</code> i opcjonalnie{' '}
                      <code className="font-mono">GITHUB_BRANCH</code>, by
                      zmiany trafiały automatycznie do repo.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-2xl bg-card border border-white/[0.06] overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="font-display font-semibold text-xl">
                Lista produktów
              </h2>
              <span className="text-sm text-muted">
                {products.length} pozycji
              </span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {products.length === 0 && (
                <div className="p-12 text-center text-muted">
                  Brak produktów. Dodaj pierwszy.
                </div>
              )}
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/[0.04] shrink-0">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{p.name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/[0.06] border border-white/[0.08]">
                        {p.tag}
                      </span>
                      {(p.qcSets?.length ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          <Camera className="w-3 h-3" />
                          {p.qcSets!.length} QC
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {p.category} · ${p.price.toFixed(2)} · ⭐ {p.rating} ·{' '}
                      {p.reviews} recenzji
                    </p>
                  </div>
                  <button
                    onClick={() => setQcModal(p)}
                    className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary-300 hover:bg-primary/20 transition-colors text-xs font-medium inline-flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    QC
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                    aria-label="Usuń"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {open && <ProductFormModal onClose={() => setOpen(false)} onCreated={onCreated} />}
      {qcModal && (
        <QCManagerModal
          product={qcModal}
          onClose={() => setQcModal(null)}
          onUpdated={onQCUpdated}
        />
      )}
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="relative p-6 rounded-2xl bg-card border border-white/[0.06] overflow-hidden">
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${color}`}
      />
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
        <p className="font-display font-bold text-3xl mt-1">{value}</p>
      </div>
    </div>
  );
}

function ProductFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (p: Product) => void;
}) {
  const [form, setForm] = useState({
    name: '',
    category: 'Shoes',
    price: '',
    tag: 'BEST' as ProductTag,
    image: '',
    sourceUrl: '',
    rating: '5',
    reviews: '0',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        rating: parseInt(form.rating, 10),
        reviews: parseInt(form.reviews, 10),
      }),
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) setError(body.error ?? 'Błąd zapisu.');
    else onCreated(body);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-up">
      <form
        onSubmit={submit}
        className="relative w-full max-w-2xl rounded-3xl bg-card border border-white/[0.1] p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-display font-bold text-2xl mb-6">Nowy produkt</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nazwa">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nike Air Force 1"
              className="input"
            />
          </Field>
          <Field label="Kategoria">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-card">
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cena (USD)">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="29.99"
              className="input"
            />
          </Field>
          <Field label="Tag">
            <select
              value={form.tag}
              onChange={(e) =>
                setForm({ ...form, tag: e.target.value as ProductTag })
              }
              className="input"
            >
              {TAGS.map((t) => (
                <option key={t} value={t} className="bg-card">
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ocena (1-5)">
            <input
              type="number"
              min="1"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Liczba recenzji">
            <input
              type="number"
              min="0"
              value={form.reviews}
              onChange={(e) => setForm({ ...form, reviews: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        <Field label="URL zdjęcia" className="mt-4">
          <input
            required
            type="url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="input"
          />
        </Field>

        <Field
          label="Link źródłowy (Taobao / Weidian / 1688)"
          className="mt-4"
        >
          <input
            required
            type="url"
            value={form.sourceUrl}
            onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            placeholder="https://item.taobao.com/item.htm?id=..."
            className="input font-mono text-sm"
          />
        </Field>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-sm font-medium transition-colors"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary disabled:opacity-60"
          >
            {loading ? 'Zapisywanie...' : 'Dodaj produkt'}
          </button>
        </div>

        <style jsx>{`
          .input {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: inherit;
            font-size: 0.875rem;
            transition: all 0.15s;
          }
          .input:focus {
            outline: none;
            border-color: rgba(168, 85, 247, 0.4);
            box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
          }
        `}</style>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="block text-xs uppercase tracking-widest text-muted mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

function QCManagerModal({
  product,
  onClose,
  onUpdated,
}: {
  product: Product;
  onClose: () => void;
  onUpdated: (p: Product) => void;
}) {
  const [agent, setAgent] = useState(AGENTS[0].name);
  const [label, setLabel] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const images = imagesText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (images.length === 0) {
      setError('Wklej przynajmniej jeden URL zdjęcia (każdy w nowej linii).');
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/products/${product.id}/qc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, label: label || undefined, images }),
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) setError(body.error ?? 'Błąd.');
    else {
      onUpdated(body);
      setLabel('');
      setImagesText('');
    }
  }

  async function removeSet(setId: string) {
    if (!confirm('Usunąć ten set QC?')) return;
    const res = await fetch(`/api/products/${product.id}/qc/${setId}`, {
      method: 'DELETE',
    });
    const body = await res.json();
    if (res.ok) onUpdated(body);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-up">
      <div className="relative w-full max-w-3xl rounded-3xl bg-card border border-white/[0.1] p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-6 h-6 text-primary-300" />
          <h2 className="font-display font-bold text-2xl">Galerie QC</h2>
        </div>
        <p className="text-sm text-muted mb-6">
          Produkt: <strong className="text-foreground">{product.name}</strong>
        </p>

        {/* Existing sets */}
        {(product.qcSets ?? []).length > 0 && (
          <div className="mb-8 space-y-3">
            {product.qcSets!.map((set, i) => (
              <div
                key={set.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="flex -space-x-2">
                  {set.images.slice(0, 3).map((img, j) => (
                    <div
                      key={j}
                      className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-card"
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {set.label ?? `${set.agent} QC Set #${i + 1}`}
                  </p>
                  <p className="text-xs text-muted">
                    {set.agent} · {set.images.length} zdjęć
                  </p>
                </div>
                <button
                  onClick={() => removeSet(set.id)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new set */}
        <form onSubmit={add} className="space-y-4">
          <h3 className="font-semibold text-base flex items-center gap-2 mt-4">
            <Plus className="w-4 h-4" />
            Dodaj nowy set QC
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs uppercase tracking-widest text-muted mb-2">
                Agent
              </span>
              <select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="qcinput"
              >
                {AGENTS.map((a) => (
                  <option key={a.name} value={a.name} className="bg-card">
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs uppercase tracking-widest text-muted mb-2">
                Etykieta (opcjonalnie)
              </span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="np. Kakobuy QC Set #1"
                className="qcinput"
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-muted mb-2">
              URL-e zdjęć (każdy w nowej linii)
            </span>
            <textarea
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              rows={6}
              placeholder={`https://example.com/qc1.jpg\nhttps://example.com/qc2.jpg`}
              className="qcinput font-mono text-xs"
            />
          </label>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary disabled:opacity-60"
          >
            <ImageIcon className="w-4 h-4" />
            {loading ? 'Dodawanie...' : 'Dodaj set'}
          </button>
        </form>

        <style jsx>{`
          .qcinput {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: inherit;
            font-size: 0.875rem;
            transition: all 0.15s;
          }
          .qcinput:focus {
            outline: none;
            border-color: rgba(168, 85, 247, 0.4);
            box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
}
