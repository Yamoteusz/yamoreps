'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import Lightbox from '@/components/common/Lightbox';
import { type QCSet } from '@/lib/products';
import { AGENTS } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ProductQCGallery({
  productName,
  qcSets,
}: {
  productName: string;
  qcSets: QCSet[];
}) {
  const [lightbox, setLightbox] = useState<{
    images: string[];
    title: string;
    subtitle: string;
    startIndex: number;
  } | null>(null);

  return (
    <div className="mt-16 pt-12 border-t border-white/[0.06]">
      <h2 className="font-display font-bold text-3xl mb-6 flex items-center gap-3">
        <Camera className="w-7 h-7 text-primary-300" />
        Galerie QC
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {qcSets.map((set, setIdx) => {
          const agent = AGENTS.find(
            (a) => a.name.toLowerCase() === set.agent.toLowerCase()
          );
          const visible = set.images.slice(0, 4);
          const remaining = set.images.length - visible.length;
          return (
            <div
              key={set.id}
              className="rounded-2xl bg-card border border-white/[0.06] overflow-hidden hover:border-white/[0.15] transition-colors"
            >
              <div className="grid grid-cols-2 gap-1 p-1">
                {visible.map((img, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setLightbox({
                        images: set.images,
                        title: set.label ?? `${set.agent} QC Set #${setIdx + 1}`,
                        subtitle: productName,
                        startIndex: i,
                      })
                    }
                    className={cn(
                      'relative aspect-square rounded-xl overflow-hidden',
                      visible.length === 1 && 'col-span-2 aspect-[4/3]',
                      visible.length === 3 && i === 0 && 'col-span-2'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${set.label ?? set.agent} - ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform hover:scale-[1.02] duration-500"
                    />
                    {i === visible.length - 1 && remaining > 0 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="font-display font-bold text-2xl text-white">
                          +{remaining}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 p-4 border-t border-white/[0.04]">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent?.color ?? 'from-primary to-accent'} flex items-center justify-center text-lg shrink-0`}
                >
                  {agent?.logo ?? '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">
                    {set.label ?? `${set.agent} QC Set #${setIdx + 1}`}
                  </p>
                  <p className="text-xs text-muted">
                    {set.images.length}{' '}
                    {set.images.length === 1 ? 'zdjęcie' : 'zdjęć'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setLightbox({
                      images: set.images,
                      title: set.label ?? `${set.agent} QC Set #${setIdx + 1}`,
                      subtitle: productName,
                      startIndex: 0,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-xs font-medium transition-colors"
                >
                  Otwórz
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          title={lightbox.title}
          subtitle={lightbox.subtitle}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
