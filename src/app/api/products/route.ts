import { NextRequest, NextResponse } from 'next/server';
import { createProduct, getAllProducts } from '@/lib/products';
import { isAuthed } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 });

  try {
    const body = await req.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Błąd zapisu.' },
      { status: 400 }
    );
  }
}
