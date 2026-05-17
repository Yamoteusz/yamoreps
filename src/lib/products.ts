/**
 * Hybrid edge-friendly products store.
 *
 * Read path:
 *   1) If GITHUB sync env vars are set, fetch latest `products.json`
 *      directly from the repo (so newly-committed admin changes are visible
 *      even before the Cloudflare rebuild finishes).
 *   2) Otherwise fall back to the JSON bundled into the worker at build time.
 *
 * Write path:
 *   1) Mutate in-memory cache so the response is immediate.
 *   2) Commit `data/products.json` to GitHub via the Contents API. The push
 *      triggers a Cloudflare Pages rebuild — within ~60s the change is
 *      baked into the next bundle and survives forever.
 *   3) If GitHub sync is disabled, mutations stay in memory only and reset
 *      on redeploy (good for dev / preview deployments).
 */

import seed from '../../data/products.json';
import { parseLink } from './converter';
import { commitProducts, pullProductsFromGitHub, isGitHubSyncEnabled } from './github';

export type ProductTag = 'BEST' | 'BUDGET' | 'RANDOM' | 'NEW';

export interface QCSet {
  id: string;
  agent: string;
  label?: string;
  images: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  tag: ProductTag;
  image: string;
  /** Original CN platform link (Taobao / Weidian / 1688). Required. */
  sourceUrl: string;
  qcSets?: QCSet[];
  createdAt: string;
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  tag: ProductTag;
  image: string;
  sourceUrl: string;
  rating?: number;
  reviews?: number;
  qcSets?: QCSet[];
}

/* -------------------------------------------------------------------------- */
/* Cache + freshness                                                          */
/* -------------------------------------------------------------------------- */

let cache: Product[] = (seed as Product[]).slice();
let cacheLoadedFromGitHub = false;
let lastFetchedAt = 0;

/** Only re-pull from GitHub at most once per CACHE_TTL window. */
const CACHE_TTL_MS = 30 * 1000;

async function load(): Promise<Product[]> {
  // Fast path: cache fresh enough.
  if (cache && Date.now() - lastFetchedAt < CACHE_TTL_MS) return cache;

  // Try GitHub first if configured. Falls back to seeded JSON on failure.
  if (isGitHubSyncEnabled()) {
    const remote = await pullProductsFromGitHub<Product[]>();
    if (remote) {
      cache = remote;
      cacheLoadedFromGitHub = true;
      lastFetchedAt = Date.now();
      return cache;
    }
  }

  if (!cacheLoadedFromGitHub) {
    cache = (seed as Product[]).slice();
  }
  lastFetchedAt = Date.now();
  return cache;
}

async function save(list: Product[], message: string): Promise<void> {
  cache = list;
  lastFetchedAt = Date.now();
  cacheLoadedFromGitHub = true;
  await commitProducts(list, message);
}

/* -------------------------------------------------------------------------- */
/* Public read API                                                            */
/* -------------------------------------------------------------------------- */

export async function getAllProducts(): Promise<Product[]> {
  const list = await load();
  return [...list].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProduct(id: string): Promise<Product | null> {
  const list = await load();
  return list.find((p) => p.id === id) ?? null;
}

export async function findByPlatformId(id: string): Promise<Product | null> {
  if (!id) return null;
  const list = await load();
  const idStr = String(id);
  return (
    list.find((p) => {
      const url = p.sourceUrl;
      return (
        url.includes('=' + idStr) ||
        url.includes('/' + idStr) ||
        url.includes('/' + idStr + '.html')
      );
    }) ?? null
  );
}

/* -------------------------------------------------------------------------- */
/* Public write API                                                           */
/* -------------------------------------------------------------------------- */

export async function createProduct(input: ProductInput): Promise<Product> {
  validateInput(input);
  const list = await load();
  const product: Product = {
    id: cryptoRandomId(),
    name: input.name.trim(),
    category: input.category.trim(),
    price: Number(input.price),
    rating: input.rating ?? 5,
    reviews: input.reviews ?? 0,
    tag: input.tag,
    image: input.image.trim(),
    sourceUrl: input.sourceUrl.trim(),
    qcSets: input.qcSets ?? [],
    createdAt: new Date().toISOString(),
  };
  await save([product, ...list], `admin: add product "${product.name}"`);
  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<ProductInput>
): Promise<Product | null> {
  const list = await load();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const merged = { ...list[idx], ...patch } as Product;
  validateInput(merged);
  list[idx] = merged;
  await save(list, `admin: update product "${merged.name}"`);
  return merged;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const list = await load();
  const target = list.find((p) => p.id === id);
  if (!target) return false;
  const next = list.filter((p) => p.id !== id);
  await save(next, `admin: delete product "${target.name}"`);
  return true;
}

export async function addQCSet(
  productId: string,
  set: Omit<QCSet, 'id' | 'createdAt'>
): Promise<Product | null> {
  const list = await load();
  const product = list.find((p) => p.id === productId);
  if (!product) return null;
  if (!set.agent?.trim()) throw new Error('Agent jest wymagany.');
  if (!Array.isArray(set.images) || set.images.length === 0)
    throw new Error('Dodaj przynajmniej jedno zdjęcie.');

  const newSet: QCSet = {
    id: cryptoRandomId(),
    agent: set.agent.trim(),
    label: set.label?.trim() || undefined,
    images: set.images.map((s) => s.trim()).filter(Boolean),
    createdAt: new Date().toISOString(),
  };
  product.qcSets = [...(product.qcSets ?? []), newSet];
  await save(list, `admin: add QC set to "${product.name}"`);
  return product;
}

export async function deleteQCSet(
  productId: string,
  setId: string
): Promise<Product | null> {
  const list = await load();
  const product = list.find((p) => p.id === productId);
  if (!product) return null;
  product.qcSets = (product.qcSets ?? []).filter((s) => s.id !== setId);
  await save(list, `admin: remove QC set from "${product.name}"`);
  return product;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function validateInput(input: ProductInput): void {
  if (!input.name?.trim()) throw new Error('Nazwa jest wymagana.');
  if (!input.category?.trim()) throw new Error('Kategoria jest wymagana.');
  if (!input.image?.trim()) throw new Error('URL zdjęcia jest wymagany.');
  if (!input.sourceUrl?.trim()) throw new Error('Link źródłowy jest wymagany.');
  if (typeof input.price !== 'number' || isNaN(input.price) || input.price < 0)
    throw new Error('Cena musi być liczbą >= 0.');
  if (!parseLink(input.sourceUrl))
    throw new Error(
      'Link źródłowy nieprawidłowy. Wymagany Taobao / Weidian / 1688 / Tmall.'
    );
  if (!['BEST', 'BUDGET', 'RANDOM', 'NEW'].includes(input.tag))
    throw new Error('Nieprawidłowy tag.');
}

function cryptoRandomId(): string {
  return (
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
  );
}
