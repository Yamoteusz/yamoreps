# YamoREPS

Najlepszy spreadsheet w Polsce — agregator linków, konwerter, QC i tracking.
Hosted na **Cloudflare Pages**, edytowany przez built-in CMS, który commituje
zmiany prosto do GitHuba.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** (dark + gradient violet/cyan)
- **Edge runtime** wszędzie — działa na Cloudflare Workers
- **lucide-react** dla ikon
- **GitHub Contents API** jako "baza" produktów

## Workflow (CMS → GitHub → Cloudflare)

```
Admin /admin → klik "Dodaj produkt"
            ↓
   POST /api/products  (edge function na Cloudflare)
            ↓
   commit data/products.json do GitHuba
            ↓
   webhook GH → Cloudflare Pages rebuild
            ↓
   ~60s później nowa wersja live
```

Tak długo jak ustawisz `GITHUB_TOKEN` + `GITHUB_REPO`, każda zmiana w admin
trwale ląduje w repo. Bez tych zmiennych admin działa "in-memory" (zmiany
giną przy redeploy) — dobre do testów lokalnych.

## Quick start

```bash
npm install
cp .env.example .env.local
# edytuj .env.local — ADMIN_PASSWORD i SESSION_SECRET
npm run dev
```

→ http://localhost:3000  ·  Admin: `/admin/login`

## Skrypty

```bash
npm run dev               # dev server
npm run build             # next build
npm start                 # next start
npm run lint              # ESLint
npm run import:vectoreps  # import 1300+ produktów z vectoreps.pl
```

## Deploy krok po kroku

### 1. Wgraj kod na GitHub

```bash
git init
git add .
git commit -m "init yamoreps"
git branch -M main
git remote add origin git@github.com:<TWOJ_USER>/yamoreps.git
git push -u origin main
```

### 2. Stwórz GitHub PAT (token, którym admin będzie commitował)

1. GitHub → Settings → Developer settings → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. **Repository access:** Only select repositories → wybierz `yamoreps`
3. **Permissions → Repository permissions:**
   - **Contents: Read and write**
   - (reszta domyślnie)
4. Skopiuj token (`github_pat_xxx...`) — pokazuje się tylko raz

### 3. Połącz repo z Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Wybierz repo `yamoreps`
3. **Build settings:**
   - Framework preset: **Next.js**
   - Build command: `npx @cloudflare/next-on-pages`
   - Build output directory: `.vercel/output/static`
   - Root directory: (puste)
4. **Environment variables (Production):**
   ```
   ADMIN_PASSWORD = TwojeMocneHaslo123!
   SESSION_SECRET = długi-losowy-string-min-32-znaki
   GITHUB_TOKEN   = github_pat_xxx... (z kroku 2)
   GITHUB_REPO    = TwojUser/yamoreps
   GITHUB_BRANCH  = main
   NEXT_PUBLIC_SITE_URL = https://yamoreps.pages.dev
   NODE_VERSION   = 20
   ```
5. **Settings → Functions → Compatibility flags:** dodaj `nodejs_compat`
6. **Save and Deploy**

### 4. Custom domena (opcjonalne)

Pages project → **Custom domains** → **Set up a custom domain** → wpisz domenę.
Jeśli domena jest u Cloudflare, DNS i SSL ustawiają się same.

## Sprawdzenie po deployu

- `https://twoja-domena.pl` → strona główna
- `https://twoja-domena.pl/admin/login` → wpisz `ADMIN_PASSWORD`
- W panelu zobaczysz baner:
  - 🟢 **GitHub sync aktywny** — zmiany commitują się do repo
  - 🟡 **GitHub sync wyłączony** — sprawdź env vars

Kliknij "Dodaj produkt", wypełnij, zapisz. W ciągu ~60s zobaczysz nowy commit
w repo i nowy deploy w Cloudflare Pages.

## Konfiguracja środowiska

| Zmienna | Wymagana | Opis |
|---|---|---|
| `ADMIN_PASSWORD` | ✅ | Hasło do `/admin` |
| `SESSION_SECRET` | ✅ | HMAC key do cookie |
| `GITHUB_TOKEN` | ⚠️ dla persistencji | Fine-grained PAT, Contents: read & write |
| `GITHUB_REPO` | ⚠️ dla persistencji | `owner/repo` |
| `GITHUB_BRANCH` | opcjonalna | Domyślnie `main` |
| `NEXT_PUBLIC_SITE_URL` | zalecane | Używane w sitemap, robots, OG |

## Struktura

```
data/products.json              # baza, edytowana przez CMS, bundled przy buildzie
public/_headers                 # security headers (Cloudflare)
wrangler.toml                   # Cloudflare config
scripts/import-vectoreps.mjs    # importer
src/
├── app/
│   ├── api/                    # wszystkie z runtime='edge'
│   │   ├── auth/, products/, products/[id]/qc/
│   │   ├── admin/status/       # status sync GitHuba
│   │   ├── convert/, qc/
│   ├── admin/                  # CMS, hasło z env
│   ├── products/, products/[id]/
│   ├── qc/, link-converter/, agents/, sellers/, news/
│   ├── sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
├── components/                 # layout / home / products / common
└── lib/
    ├── converter.ts            # parser + builders dla 12 agentów
    ├── products.ts             # hybrid store (GitHub fetch + memory cache)
    ├── github.ts               # Contents API client
    ├── auth.ts                 # Web Crypto HMAC sessions
    ├── data.ts                 # statyczne agents/stats
    └── utils.ts
```

## Konwerter

Wspiera linki: Taobao, Tmall, Weidian, 1688, oraz wrapped agent links
(`?id=...&shop_type=...` lub `?url=encoded`).

Generuje URL-e dla 12 agentów. **Mulebuy** zawsze z afiliacją `200103195`.

## Limity Cloudflare Free

- Requests: 100k/dzień
- Build time: 20 min (z buforem starczy)
- Bundle size: 1MB skompresowane (~250 KB w naszym przypadku)
- CPU per request: 10ms (edge functions)

## Bezpieczeństwo

- HMAC-SHA256 cookie sessions (Web Crypto, constant-time compare)
- 7-dniowy TTL sesji
- Wszystkie write API wymagają auth
- Security headers (X-Frame, CSP-relevant) w `public/_headers`
- robots.txt blokuje `/admin` i `/api`
- GitHub PAT scope ograniczony tylko do tego repo

## Disclaimer

YamoREPS nie sprzedaje fizycznych produktów. Strona służy wyłącznie celom
edukacyjnym. Nie wspieramy sprzedaży podróbek.
