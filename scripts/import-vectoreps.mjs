/**
 * Import products from the public VectoReps API into our JSON store.
 *
 * - Fetches all pages from https://vectoreps.pl/api/products
 * - Normalises shape -> our `Product` interface
 * - Translates the embedded USFans link into a canonical CN platform URL
 *   (so our converter can rebuild it for every agent we support)
 * - Substitutes their affiliate refs with ours
 *
 * Usage:
 *   node scripts/import-vectoreps.mjs
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_PATH = path.join(__dirname, '..', 'data', 'products.json');

const API = 'https://vectoreps.pl/api/products';
const PAGE_SIZE = 100;

// ---------- helpers ----------

/** USFans path platform index → our platform key. */
const PLATFORM_BY_INDEX = {
  '1': 'taobao',
  '2': 'weidian',
  '3': '1688',
};

/** VectoReps "batch" → our tag enum. */
const TAG_BY_BATCH = {
  best: 'BEST',
  budget: 'BUDGET',
  random: 'RANDOM',
  new: 'NEW',
};

function rebuildCnUrl(platform, id) {
  switch (platform) {
    case 'taobao':
      return `https://item.taobao.com/item.htm?id=${id}`;
    case 'weidian':
      return `https://weidian.com/item.html?itemID=${id}`;
    case '1688':
      return `https://detail.1688.com/offer/${id}.html`;
    default:
      return null;
  }
}

/**
 * Vector links look like:
 *   https://www.usfans.com/product/1/852964348764?ref=vector
 *           or
 *   https://www.usfans.com/product/3/7547887953?ref=vector
 *   https://www.kakobuy.com/item/details?url=https%3A%2F%2Fitem.taobao.com...
 *
 * Returns { platform, id } if recognised, otherwise null.
 */
function parseSourceLink(link) {
  if (!link) return null;
  let url;
  try {
    url = new URL(link);
  } catch {
    return null;
  }

  // USFans pattern
  if (url.hostname.includes('usfans.com')) {
    const m = url.pathname.match(/\/product\/(\d+)\/(\d+)/);
    if (m) {
      const platform = PLATFORM_BY_INDEX[m[1]];
      if (platform) return { platform, id: m[2] };
    }
  }

  // Generic agent pattern: ?id= and ?shop_type=
  const id = url.searchParams.get('id') || url.searchParams.get('itemID');
  const type = (
    url.searchParams.get('shop_type') ||
    url.searchParams.get('type') ||
    ''
  ).toLowerCase();
  if (id && /^\d+$/.test(id)) {
    const platform =
      type === 'weidian' ? 'weidian' : type === '1688' ? '1688' : 'taobao';
    return { platform, id };
  }

  // Wrapped url=... param
  for (const k of ['url', 'goods_url', 'targetUrl']) {
    const v = url.searchParams.get(k);
    if (v) {
      try {
        const decoded = decodeURIComponent(v);
        if (decoded.includes('taobao'))
          return parseSourceLink(decoded) || null;
        if (decoded.includes('weidian'))
          return parseSourceLink(decoded) || null;
        if (decoded.includes('1688'))
          return parseSourceLink(decoded) || null;
      } catch {
        /* noop */
      }
    }
  }

  // Direct CN platform URLs
  if (url.hostname.includes('taobao.com')) {
    const id2 = url.searchParams.get('id');
    if (id2) return { platform: 'taobao', id: id2 };
  }
  if (url.hostname.includes('weidian.com')) {
    const id2 = url.searchParams.get('itemID') || url.searchParams.get('itemId');
    if (id2) return { platform: 'weidian', id: id2 };
  }
  if (url.hostname.includes('1688.com')) {
    const m = url.pathname.match(/\/offer\/(\d+)\.html/);
    if (m) return { platform: '1688', id: m[1] };
  }

  return null;
}

function normalizeCategory(raw) {
  if (!raw) return 'Other';
  const lc = raw.toLowerCase().trim();
  const MAP = {
    akcesoria: 'Accessories',
    accessories: 'Accessories',
    shoes: 'Shoes',
    buty: 'Shoes',
    hoodies: 'Hoodies',
    bluzy: 'Hoodies',
    'food&snacks': 'Food & Snacks',
    food: 'Food & Snacks',
    socks: 'Socks',
    skarpetki: 'Socks',
    underwear: 'Underwear',
    bielizna: 'Underwear',
    shorts: 'Shorts',
    spodenki: 'Shorts',
    pants: 'Pants',
    spodnie: 'Pants',
    't-shirts': 'T-Shirts',
    koszulki: 'T-Shirts',
    bags: 'Bags',
    torby: 'Bags',
    watches: 'Watches',
    zegarki: 'Watches',
    jackets: 'Jackets',
    kurtki: 'Jackets',
    lego: 'Lego',
  };
  return MAP[lc] ?? raw[0].toUpperCase() + raw.slice(1);
}

function shortId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

// ---------- main ----------

async function fetchPage(page) {
  const res = await fetch(`${API}?page=${page}&limit=${PAGE_SIZE}`, {
    headers: {
      'User-Agent': 'YamoREPS-Importer/1.0',
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Page ${page}: HTTP ${res.status}`);
  return res.json();
}

async function main() {
  console.log('→ Fetching VectoReps products...');
  const first = await fetchPage(1);
  const totalPages = first.totalPages;
  const totalItems = first.totalItems;
  console.log(`  Total: ${totalItems} items across ${totalPages} pages.`);

  const all = [...first.products];
  for (let p = 2; p <= totalPages; p++) {
    process.stdout.write(`  Page ${p}/${totalPages}...\r`);
    const page = await fetchPage(p);
    all.push(...page.products);
    // Tiny throttle to be polite.
    await new Promise((r) => setTimeout(r, 80));
  }
  console.log(`\n  Fetched ${all.length} raw products.`);

  // ---------- normalize ----------
  let kept = 0;
  let dropped = 0;
  const seen = new Set();
  const products = [];

  for (const raw of all) {
    if (!raw?.link || !raw?.image || !raw?.name) {
      dropped++;
      continue;
    }
    const parsed = parseSourceLink(raw.link);
    if (!parsed) {
      dropped++;
      continue;
    }
    // De-duplicate by platform+id (different listings for the same item)
    const dedupKey = `${parsed.platform}:${parsed.id}`;
    if (seen.has(dedupKey)) {
      dropped++;
      continue;
    }
    seen.add(dedupKey);

    const sourceUrl = rebuildCnUrl(parsed.platform, parsed.id);
    if (!sourceUrl) {
      dropped++;
      continue;
    }

    const tag = TAG_BY_BATCH[(raw.batch || '').toLowerCase()] ?? 'NEW';
    const price = typeof raw.price === 'number' ? raw.price : Number(raw.price) || 0;

    products.push({
      id: shortId(),
      name: String(raw.name).trim(),
      category: normalizeCategory(raw.category),
      price,
      rating: 5,
      reviews: Number(raw.likes ?? 0) + Number(raw.views ?? 0),
      tag,
      image: String(raw.image),
      sourceUrl,
      qcSets: [],
      createdAt: raw.createdAt || new Date().toISOString(),
    });
    kept++;
  }

  // Newest first
  products.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log(`  Kept ${kept}, dropped ${dropped} (no parseable link / duplicate).`);
  console.log(`→ Writing to ${OUT_PATH}`);
  await fs.writeFile(OUT_PATH, JSON.stringify(products, null, 2), 'utf8');
  console.log(`✔ Done. ${products.length} products saved.`);
}

main().catch((err) => {
  console.error('IMPORT FAILED:', err);
  process.exit(1);
});
