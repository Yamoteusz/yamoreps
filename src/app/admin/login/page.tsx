'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Nieprawidłowe hasło.');
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-50 pointer-events-none" />
      <div className="absolute top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative w-full max-w-md mx-4">
        <div className="rounded-3xl gradient-border p-8 md:p-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow-primary">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">Panel admina</h1>
          <p className="text-muted text-sm mb-8">
            Wpisz hasło, by zarządzać produktami.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary disabled:opacity-60"
            >
              {loading ? 'Logowanie...' : 'Zaloguj'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="mt-4 text-xs text-muted text-center">
          Domyślne hasło ustawione w <code>.env.local</code> jako{' '}
          <code>ADMIN_PASSWORD</code>.
        </p>
      </div>
    </section>
  );
}
