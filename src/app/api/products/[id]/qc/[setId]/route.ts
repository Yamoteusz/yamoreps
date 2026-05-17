import { NextRequest, NextResponse } from 'next/server';
import { deleteQCSet } from '@/lib/products';
import { isAuthed } from '@/lib/auth';

export const runtime = 'edge';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; setId: string }> }
) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 });
  const { id, setId } = await params;
  const updated = await deleteQCSet(id, setId);
  if (!updated)
    return NextResponse.json({ error: 'Nie znaleziono.' }, { status: 404 });
  return NextResponse.json(updated);
}
