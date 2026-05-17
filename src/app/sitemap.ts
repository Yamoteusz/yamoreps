import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';

export const runtime = 'edge';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yamoreps.pl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/products',
    '/agents',
    '/qc',
    '/link-converter',
    '/tracking',
    '/sellers',
    '/news',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const products = await getAllProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
