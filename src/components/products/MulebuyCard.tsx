'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

export default function MulebuyCard({
  agentUrl,
  sourceUrl,
  logo,
  color,
}: {
  agentUrl: string;
  sourceUrl: string;
  logo: string;
  color: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(sourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/40">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg shrink-0`}
        >
          {logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Mulebuy</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
              <Sparkles className="w-2.5 h-2.5" />
              POLECANY
            </span>
          </div>
          <p className="text-[11px] text-muted mt-0.5">
            Otwórz Mulebuy → wklej link w search
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-xs font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Skopiowano link
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Kopiuj link produktu
            </>
          )}
        </button>
        <a
          href={agentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-medium hover:opacity-90 transition-opacity"
        >
          Otwórz Mulebuy
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
