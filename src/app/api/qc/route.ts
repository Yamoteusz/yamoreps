import { NextRequest, NextResponse } from 'next/server';
import {
  buildAll,
  parseLink,
  platformLabel,
  MULEBUY_REF,
} from '@/lib/converter';
import { findByPlatformId } from '@/lib/products';

export const runtime = 'edge';

/**
 * QC lookup:
 * 1) Parse the input link to detect platform + product id.
 * 2) Try to find a curated product in our DB by that id → return its qcSets.
 * 3) If no curated photos: return deep-link fallbacks to every agent's QC page.
 */
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

  const product = await findByPlatformId(parsed.id);
  const platformLc = parsed.platform.toLowerCase();

  const fallbackSources = [
    {
      name: 'Mulebuy',
      url: `https://mulebuy.com/product?id=${parsed.id}&platform=${parsed.platform === 'taobao' ? 'TAOBAO' : parsed.platform === 'weidian' ? 'WEIDIAN' : 'ALI_1688'}&ref=${MULEBUY_REF}`,
      featured: true,
    },
    {
      name: 'Kakobuy QC',
      url: `https://www.kakobuy.com/qc?shop_type=${platformLc}&id=${parsed.id}`,
    },
    {
      name: 'Sugargoo QC',
      url: `https://www.sugargoo.com/index/qc/index?tp=${platformLc}&id=${parsed.id}`,
    },
    { name: 'CSSBuy QC', url: `https://www.cssbuy.com/qcsearch?id=${parsed.id}` },
    { name: 'Hoobuy QC', url: `https://hoobuy.com/qc?id=${parsed.id}` },
    { name: 'CNFans QC', url: `https://cnfans.com/qc?id=${parsed.id}` },
    {
      name: 'Joyabuy QC',
      url: `https://joyabuy.com/qc?id=${parsed.id}`,
    },
  ];

  return NextResponse.json({
    platform: parsed.platform,
    platformLabel: platformLabel(parsed.platform),
    id: parsed.id,
    product: product
      ? {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
        }
      : null,
    qcSets: product?.qcSets ?? [],
    agentLinks: buildAll(parsed),
    fallbackSources,
  });
}
