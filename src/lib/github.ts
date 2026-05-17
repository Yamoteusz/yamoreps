/**
 * Edge-compatible GitHub Contents API client.
 *
 * Used to commit `data/products.json` straight from the admin panel.
 * When env vars are set, every admin mutation pushes a new commit to the
 * configured branch, which triggers a Cloudflare Pages rebuild and makes
 * the change permanent within ~60 seconds.
 *
 * Required env vars:
 *   GITHUB_TOKEN  — fine-grained PAT with "Contents: read & write" on the repo
 *   GITHUB_REPO   — "owner/repo" string
 *   GITHUB_BRANCH — defaults to "main"
 *
 * Without these, sync silently no-ops and admin keeps working in-memory.
 */

const API = 'https://api.github.com';
const PRODUCTS_PATH = 'data/products.json';
const COMMITTER_NAME = 'YamoREPS Admin';
const COMMITTER_EMAIL = 'admin@yamoreps.local';

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!token || !repo) return null;
  return { token, repo, branch };
}

export function isGitHubSyncEnabled(): boolean {
  return config() !== null;
}

/* -------------------------------------------------------------------------- */
/* base64 helpers (UTF-8 safe, edge runtime safe — no Buffer)                 */
/* -------------------------------------------------------------------------- */

function utf8ToBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  // btoa wants binary string. Convert each byte to a code unit < 256.
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const cleaned = b64.replace(/\s/g, '');
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/* -------------------------------------------------------------------------- */
/* Low-level helpers                                                          */
/* -------------------------------------------------------------------------- */

async function gh(
  cfg: NonNullable<ReturnType<typeof config>>,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'YamoREPS-Admin',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

interface FileMeta {
  sha: string;
  content?: string;
}

async function getFile(
  cfg: NonNullable<ReturnType<typeof config>>,
  filePath: string
): Promise<FileMeta | null> {
  const res = await gh(
    cfg,
    `/repos/${cfg.repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(cfg.branch)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub getFile failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { sha: string; content?: string };
  return json;
}

async function putFile(
  cfg: NonNullable<ReturnType<typeof config>>,
  filePath: string,
  body: {
    content: string; // already base64
    sha?: string;
    message: string;
  }
): Promise<{ ok: true } | { conflict: true } | { error: string }> {
  const res = await gh(
    cfg,
    `/repos/${cfg.repo}/contents/${encodeURIComponent(filePath)}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: body.message,
        content: body.content,
        sha: body.sha,
        branch: cfg.branch,
        committer: { name: COMMITTER_NAME, email: COMMITTER_EMAIL },
      }),
    }
  );
  if (res.ok) return { ok: true };
  if (res.status === 409 || res.status === 422) return { conflict: true };
  return { error: `${res.status}: ${await res.text()}` };
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Fetch latest products.json from GitHub. Returns null if sync disabled,
 * file missing, or fetch failed.
 */
export async function pullProductsFromGitHub<T = unknown>(): Promise<T | null> {
  const cfg = config();
  if (!cfg) return null;
  try {
    const file = await getFile(cfg, PRODUCTS_PATH);
    if (!file?.content) return null;
    return JSON.parse(base64ToUtf8(file.content)) as T;
  } catch {
    return null;
  }
}

/**
 * Commit an updated products.json to GitHub. With one retry on SHA conflict
 * (concurrent admin writes).
 *
 * Returns:
 *  - `{ synced: false, reason: 'disabled' }` if env vars are missing
 *  - `{ synced: true, commitSha?: string }` on success
 *  - throws on hard failure (so admin gets a 500)
 */
export async function commitProducts(
  products: unknown,
  message: string
): Promise<
  | { synced: false; reason: 'disabled' }
  | { synced: true }
> {
  const cfg = config();
  if (!cfg) return { synced: false, reason: 'disabled' };

  const json = JSON.stringify(products, null, 2) + '\n';
  const content = utf8ToBase64(json);

  // Two attempts: first with the SHA we know, second after re-fetching SHA
  // if GitHub rejected our update due to a concurrent change.
  for (let attempt = 0; attempt < 2; attempt++) {
    const existing = await getFile(cfg, PRODUCTS_PATH);
    const result = await putFile(cfg, PRODUCTS_PATH, {
      content,
      sha: existing?.sha,
      message,
    });
    if ('ok' in result) return { synced: true };
    if ('conflict' in result) continue;
    throw new Error(`GitHub commit failed: ${result.error}`);
  }
  throw new Error('GitHub commit failed: SHA conflict after retry.');
}
