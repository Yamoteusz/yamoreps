import { NextRequest, NextResponse } from 'next/server';
import { buildAll, parseLink, platformLabel } from '@/lib/converter';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { url } = await req.json().catch(() => ({ url: '' }));
  const parsed = parseLink(url);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          'Nie rozpoznano linku. Wklej link Taobao / Weidian / 1688 / Tmall lub link z agenta.',
      },
      { status: 400 }
    );
  }
  return NextResponse.json({
    platform: parsed.platform,
    platformLabel: platformLabel(parsed.platform),
    id: parsed.id,
    results: buildAll(parsed),
  });
}
