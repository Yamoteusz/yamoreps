'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { MapPin, Package, Truck, CheckCircle2, Search } from 'lucide-react';

const STEPS = [
  { icon: Package, label: 'Odebrana', date: '12.05.2026', done: true },
  { icon: Truck, label: 'W tranzycie', date: '14.05.2026', done: true },
  { icon: MapPin, label: 'W kraju', date: '17.05.2026', done: true },
  { icon: CheckCircle2, label: 'Dostarczona', date: '—', done: false },
];

export default function TrackingPage() {
  const [code, setCode] = useState('');
  const [shown, setShown] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="TRACKING"
        title={
          <>
            Śledź swoje <span className="gradient-text">paczki</span>
          </>
        }
        description="Wszystkie trackery w jednym miejscu. Wklej numer przesyłki i sprawdź jej status."
      />

      <section className="pb-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="rounded-3xl gradient-border p-8 md:p-10">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Numer śledzenia
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="LP123456789CN"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 focus:outline-none text-sm placeholder:text-muted"
                />
              </div>
              <button
                onClick={() => setShown(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary"
              >
                Sprawdź
              </button>
            </div>
          </div>

          {shown && (
            <div className="mt-10 rounded-3xl bg-card border border-white/[0.06] p-8 animate-fade-up">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted">
                    Numer śledzenia
                  </p>
                  <p className="font-mono text-lg mt-1">
                    {code || 'LP123456789CN'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  W tranzycie
                </span>
              </div>

              <div className="relative">
                <div className="absolute left-5 top-5 bottom-5 w-px bg-white/[0.08]" />
                <div
                  className="absolute left-5 top-5 w-px bg-gradient-to-b from-primary to-accent"
                  style={{ height: '60%' }}
                />
                <ol className="space-y-6">
                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    return (
                      <li
                        key={step.label}
                        className="relative flex items-center gap-4 pl-1"
                      >
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                            step.done
                              ? 'bg-gradient-to-br from-primary to-accent'
                              : 'bg-white/[0.04] border border-white/[0.08]'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              step.done ? 'text-white' : 'text-muted'
                            }`}
                          />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <p
                            className={`font-medium ${
                              step.done ? 'text-foreground' : 'text-muted'
                            }`}
                          >
                            {step.label}
                          </p>
                          <span className="text-xs text-muted">{step.date}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
