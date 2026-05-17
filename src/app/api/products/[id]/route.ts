import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct, getProduct, updateProduct } from '@/lib/products';
import { isAuthed } from '@/lib/auth';

export const runtime = 'edge';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product)
    return NextResponse.json({ error: 'Nie znaleziono.' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateProduct(id, body);
    if (!updated)
      return NextResponse.json({ error: 'Nie znaleziono.' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Błąd zapisu.' },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 });
  const { id } = await params;
  const ok = await deleteProduct(id);
  return NextResponse.json({ ok });
}
