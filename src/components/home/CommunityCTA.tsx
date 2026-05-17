import Link from 'next/link';
import { MessageCircle, Users, Sparkles } from 'lucide-react';

export default function CommunityCTA() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-700 to-accent opacity-90" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid-32 opacity-20" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              SPOŁECZNOŚĆ
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight">
              Dołącz do społeczności
            </h2>
            <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Ponad 120 000 członków na Discordzie. Dziel się wiedzą, znajduj
              sprawdzone produkty i bądź na bieżąco.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://discord.gg/yamoreps"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-white text-primary hover:bg-white/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Dołącz do Discorda
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Users className="w-5 h-5" />
                Zobacz Spreadsheet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
