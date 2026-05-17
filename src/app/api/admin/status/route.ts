import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { isGitHubSyncEnabled } from '@/lib/github';

export const runtime = 'edge';

export async function GET() {
  if (!(await isAuthed()))
    return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 });

  return NextResponse.json({
    githubSyncEnabled: isGitHubSyncEnabled(),
    repo: process.env.GITHUB_REPO ?? null,
    branch: process.env.GITHUB_BRANCH ?? 'main',
  });
}
