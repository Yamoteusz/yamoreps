import { AGENTS } from '@/lib/data';

export default function AgentsMarquee() {
  const items = [...AGENTS, ...AGENTS];
  return (
    <section className="relative py-16 border-y border-white/[0.06] bg-card/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 mb-8">
        <p className="text-center text-xs uppercase tracking-widest text-muted">
          Wspierani agenci zakupowi
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee w-max">
          {items.map((agent, i) => (
            <div
              key={`${agent.name}-${i}`}
              className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm whitespace-nowrap min-w-fit"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl shrink-0`}
              >
                {agent.logo}
              </div>
              <span className="font-display font-semibold text-lg">
                {agent.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
