import Link from 'next/link';
import { ArrowLeft, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-50 pointer-events-none" />
      <div className="absolute top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative max-w-2xl mx-4 text-center">
        <div className="font-display font-black text-[12rem] md:text-[16rem] leading-none gradient-text">
          404
        </div>
        <h1 className="mt-4 font-display font-bold text-3xl md:text-5xl tracking-tight">
          Nie znaleziono strony
        </h1>
        <p className="mt-4 text-muted text-lg">
          Wygląda na to, że ten produkt zniknął z magazynu albo wpisałeś
          niewłaściwy adres.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Strona główna
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-sm font-medium transition-colors"
          >
            <Compass className="w-4 h-4" />
            Przeglądaj produkty
          </Link>
        </div>
      </div>
    </section>
  );
}
