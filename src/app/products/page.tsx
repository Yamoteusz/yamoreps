import PageHeader from '@/components/layout/PageHeader';
import { getAllProducts } from '@/lib/products';
import ProductsBrowser from './ProductsBrowser';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  return (
    <>
      <PageHeader
        eyebrow="SPREADSHEET"
        title={
          <>
            Baza <span className="gradient-text">produktów</span>
          </>
        }
        description="Zweryfikowane przez społeczność linki do produktów. Wybierz kategorię i odkrywaj nowe znaleziska."
      />
      <ProductsBrowser products={products} categories={categories} />
    </>
  );
}
