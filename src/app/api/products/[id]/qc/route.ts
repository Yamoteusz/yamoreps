import { NextRequest, NextResponse } from 'next/server';
import { addQCSet } from '@/lib/products';
import { isAuthed } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await addQCSet(id, {
      agent: body.agent,
      label: body.label,
      images: body.images ?? [],
    });
    if (!updated)
      return NextResponse.json({ error: 'Nie znaleziono produktu.' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Błąd zapisu.' },
      { status: 400 }
    );
  }
}
