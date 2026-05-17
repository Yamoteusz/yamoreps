import { type ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative pt-36 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-50 pointer-events-none" />
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid-32 opacity-50 pointer-events-none"
        style={{
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)',
        }}
      />
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary-300 mb-5">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tighter max-w-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-muted text-lg max-w-2xl">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
