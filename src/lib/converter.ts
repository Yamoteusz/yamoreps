/**
 * Link converter logic for Chinese marketplace agents.
 * Detects platform + product ID from any link (direct or agent-wrapped),
 * then rebuilds URLs for every supported agent.
 */

export type Platform = 'taobao' | 'weidian' | '1688' | 'tmall';

export interface ParsedLink {
  platform: Platform;
  id: string;
  /** Original URL the user pasted. */
  raw: string;
}

const PLATFORM_HOSTS: Record<Platform, string[]> = {
  taobao: ['item.taobao.com', 'taobao.com', 'm.taobao.com'],
  weidian: ['weidian.com', 'shop.weidian.com'],
  '1688': ['1688.com', 'detail.1688.com', 'm.1688.com'],
  tmall: ['detail.tmall.com', 'tmall.com', 'detail.tmall.hk'],
};

/** Mulebuy ref code (your affiliate). */
export const MULEBUY_REF = '200054759';

/** Returns `null` if the URL can't be parsed. */
export function parseLink(input: string): ParsedLink | null {
  if (!input?.trim()) return null;
  let str = input.trim();

  // Tolerate links pasted without protocol.
  if (!/^https?:\/\//i.test(str)) {
    str = 'https://' + str;
  }

  let url: URL;
  try {
    url = new URL(str);
  } catch {
    return null;
  }

  // 1) Direct CN platform link: read host + id.
  for (const [platform, hosts] of Object.entries(PLATFORM_HOSTS) as [
    Platform,
    string[],
  ][]) {
    if (hosts.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) {
      const id = extractIdFromCnUrl(url, platform);
      if (id) return { platform, id, raw: input };
    }
  }

  // 2) Agent-wrapped link: pull the inner CN URL or known query params.
  const inner = extractInnerUrl(url);
  if (inner) {
    const recursed = parseLink(inner);
    if (recursed) return { ...recursed, raw: input };
  }

  // 3) Heuristic: agents often expose `?id=...&shop_type=taobao|weidian|1688`.
  const id =
    url.searchParams.get('id') ||
    url.searchParams.get('itemId') ||
    url.searchParams.get('itemID') ||
    url.searchParams.get('goodsId') ||
    url.searchParams.get('product_id');
  const shopType = (
    url.searchParams.get('shop_type') ||
    url.searchParams.get('platform') ||
    url.searchParams.get('type') ||
    ''
  ).toLowerCase();

  if (id && /^\d+$/.test(id)) {
    const platform =
      shopType === 'weidian' || shopType === 'wd'
        ? 'weidian'
        : shopType === '1688' || shopType === 'ali'
          ? '1688'
          : shopType === 'tmall'
            ? 'tmall'
            : 'taobao';
    return { platform, id, raw: input };
  }

  return null;
}

function extractIdFromCnUrl(url: URL, platform: Platform): string | null {
  if (platform === 'taobao' || platform === 'tmall') {
    const id = url.searchParams.get('id');
    if (id && /^\d+$/.test(id)) return id;
  }
  if (platform === 'weidian') {
    const id =
      url.searchParams.get('itemID') || url.searchParams.get('itemId');
    if (id && /^\d+$/.test(id)) return id;
  }
  if (platform === '1688') {
    // Format: /offer/<id>.html
    const m = url.pathname.match(/\/offer\/(\d+)\.html/);
    if (m) return m[1];
    const id = url.searchParams.get('id');
    if (id && /^\d+$/.test(id)) return id;
  }
  return null;
}

function extractInnerUrl(url: URL): string | null {
  // Common params that carry the source CN URL on agent sites.
  const candidates = ['url', 'goods_url', 'targetUrl', 'productUrl', 'link'];
  for (const k of candidates) {
    const v = url.searchParams.get(k);
    if (!v) continue;
    try {
      const decoded = decodeURIComponent(v);
      if (/taobao|weidian|1688|tmall/i.test(decoded)) return decoded;
    } catch {
      /* noop */
    }
  }
  return null;
}

/* ----------------------------- Build URLs ----------------------------- */

export type AgentKey =
  | 'mulebuy'
  | 'kakobuy'
  | 'sugargoo'
  | 'cssbuy'
  | 'hoobuy'
  | 'cnfans'
  | 'allchinabuy'
  | 'joyabuy'
  | 'oopbuy'
  | 'usfans'
  | 'acbuy'
  | 'litbuy';

interface AgentBuilder {
  key: AgentKey;
  name: string;
  build: (p: ParsedLink) => string;
}

const PLATFORM_PARAM: Record<Platform, string> = {
  taobao: 'TAOBAO',
  weidian: 'WEIDIAN',
  '1688': 'ALI_1688',
  tmall: 'TMALL',
};

const lc = (p: ParsedLink) => PLATFORM_PARAM[p.platform].toLowerCase();

const MULEBUY_PLATFORM: Record<Platform, string> = {
  taobao: 'TAOBAO',
  weidian: 'WEIDIAN',
  '1688': 'ALI_1688',
  tmall: 'TAOBAO',
};

export const AGENT_BUILDERS: AgentBuilder[] = [
  {
    key: 'mulebuy',
    name: 'Mulebuy',
    build: (p) =>
      `https://mulebuy.com/product?id=${p.id}&platform=${MULEBUY_PLATFORM[p.platform]}&ref=${MULEBUY_REF}`,
  },
  {
    key: 'kakobuy',
    name: 'Kakobuy',
    build: (p) =>
      `https://www.kakobuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'sugargoo',
    name: 'Sugargoo',
    build: (p) =>
      `https://www.sugargoo.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'cssbuy',
    name: 'CSSBuy',
    build: (p) =>
      `https://www.cssbuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'hoobuy',
    name: 'Hoobuy',
    build: (p) =>
      `https://hoobuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'cnfans',
    name: 'CNFans',
    build: (p) =>
      `https://cnfans.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'allchinabuy',
    name: 'Allchinabuy',
    build: (p) =>
      `https://www.allchinabuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'joyabuy',
    name: 'Joyabuy',
    build: (p) =>
      `https://joyabuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'oopbuy',
    name: 'Oopbuy',
    build: (p) =>
      `https://www.oopbuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'usfans',
    name: 'USFans',
    build: (p) =>
      `https://www.usfans.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'acbuy',
    name: 'ACBuy',
    build: (p) =>
      `https://www.acbuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
  {
    key: 'litbuy',
    name: 'LitBuy',
    build: (p) =>
      `https://www.litbuy.com/product/${platformIndex(p.platform)}/${p.id}`,
  },
];

function platformIndex(p: Platform): number {
  // Common numeric scheme used by Hoobuy / Oopbuy: 1=Taobao, 2=Weidian, 3=1688
  return p === 'taobao' ? 1 : p === 'weidian' ? 2 : p === '1688' ? 3 : 1;
}

export function rebuildCn(p: ParsedLink): string {
  switch (p.platform) {
    case 'taobao':
      return `https://item.taobao.com/item.htm?id=${p.id}`;
    case 'tmall':
      return `https://detail.tmall.com/item.htm?id=${p.id}`;
    case 'weidian':
      return `https://weidian.com/item.html?itemID=${p.id}`;
    case '1688':
      return `https://detail.1688.com/offer/${p.id}.html`;
  }
}

export function buildForAgent(key: AgentKey, parsed: ParsedLink): string {
  const builder = AGENT_BUILDERS.find((a) => a.key === key);
  if (!builder) throw new Error('Unknown agent: ' + key);
  return builder.build(parsed);
}

export function buildAll(parsed: ParsedLink): { key: AgentKey; name: string; url: string }[] {
  return AGENT_BUILDERS.map(({ key, name, build }) => ({
    key,
    name,
    url: build(parsed),
  }));
}

export function platformLabel(p: Platform): string {
  return p === 'taobao'
    ? 'Taobao'
    : p === 'weidian'
      ? 'Weidian'
      : p === '1688'
        ? '1688'
        : 'Tmall';
}
