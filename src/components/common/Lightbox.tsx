'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';

interface Props {
  images: string[];
  startIndex?: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export default function Lightbox({
  images,
  startIndex = 0,
  title,
  subtitle,
  onClose,
}: Props) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  if (!images.length) return null;
  const src = images[idx];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-up"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between gap-4 z-10">
        <div className="text-white">
          {title && <p className="font-display font-semibold">{title}</p>}
          {subtitle && (
            <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/80">
            {idx + 1} / {images.length}
          </span>
          <a
            href={src}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            aria-label="Pobierz"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            aria-label="Zamknij"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIdx((i) => (i - 1 + images.length) % images.length);
          }}
          aria-label="Poprzednie"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-full h-full max-w-6xl max-h-[80vh] m-4 md:m-12"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={title ?? 'QC photo'}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIdx((i) => (i + 1) % images.length);
          }}
          aria-label="Następne"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="absolute bottom-5 left-0 right-0 flex justify-center px-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 max-w-full overflow-x-auto p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
            {images.map((thumb, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={
                  i === idx
                    ? 'relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-primary shrink-0'
                    : 'relative w-16 h-16 rounded-lg overflow-hidden opacity-50 hover:opacity-100 transition-opacity shrink-0'
                }
              >
                <Image src={thumb} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
