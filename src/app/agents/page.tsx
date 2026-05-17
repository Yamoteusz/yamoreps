import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { AGENTS } from '@/lib/data';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function AgentsPage() {
  const featured = AGENTS.filter((a) => a.featured);
  const others = AGENTS.filter((a) => !a.featured);

  return (
    <>
      <PageHeader
        eyebrow="AGENCI"
        title={
          <>
            Wspierani <span className="gradient-text">agenci zakupowi</span>
          </>
        }
        description="Pełna lista agentów obsługiwanych przez nasz konwerter linków, QC i tracking. Polecani znajdują się na samej górze."
      />

      <section className="pb-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Polecani
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((agent) => (
              <Link
                key={agent.name}
                href={agent.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform"
              >
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-full p-7 rounded-3xl bg-card overflow-hidden">
                  <div
                    className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity bg-gradient-to-br ${agent.color}`}
                  />
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl mb-5 shadow-lg`}
                    >
                      {agent.logo}
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">
                      {agent.name}
                    </h3>
                    {agent.description && (
                      <p className="text-sm text-muted leading-relaxed mb-5">
                        {agent.description}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 group-hover:gap-2.5 transition-all">
                      Otwórz
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-xs uppercase tracking-widest text-muted mb-5 mt-6">
            Pozostali agenci
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((agent) => (
              <Link
                key={agent.name}
                href={agent.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-6 rounded-2xl bg-card border border-white/[0.06] hover:border-white/[0.15] hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div
                  className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-br ${agent.color}`}
                />
                <div className="relative flex items-start gap-4">
                  <div
                    className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl`}
                  >
                    {agent.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display font-semibold text-lg">
                        {agent.name}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary-300 transition-colors shrink-0" />
                    </div>
                    {agent.description && (
                      <p className="mt-1 text-sm text-muted leading-relaxed">
                        {agent.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
