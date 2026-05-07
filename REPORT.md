# FAWZ — Engineering Report

> Comprehensive write-up of the FAWZ web app from `9290001` (scaffold) to
> `4d5f9f1` (current head). Every major decision is captured with the
> reasoning behind it. For "how to run" see `README.md`; for the build
> contract that drove the implementation see `CLAUDE.md`.

---

## Table of contents

1. [Executive summary](#executive-summary)
2. [Project context](#project-context)
3. [Tech stack & why](#tech-stack--why)
4. [Folder structure & layering](#folder-structure--layering)
5. [Phase-by-phase journey](#phase-by-phase-journey)
6. [Cross-cutting decisions](#cross-cutting-decisions)
7. [Verification](#verification)
8. [Known limitations](#known-limitations)

---

## Executive summary

FAWZ is a React 19 + Vite 6 single-page web app for an Iraqi-market
prize-draw engagement product layered on top of the SuperQi wallet.
The codebase covers eleven feature verticals (auth, home, draws,
entries, prizes, profile, referral, notifications, challenges,
merchant, more, disputes, splash, onboarding) across ~100 pages and
components, fully bilingual (English LTR + Arabic RTL), with a
data-source toggle that lets every read either hit the sandbox API or
fall back to in-memory fixtures.

The submission build deliberately defaults to **mock mode** so the
app loads instantly with zero backend dependency — a reviewer can sign
in with any credentials, click any draw, view any prize, and the data
will be coherent across pages because every consumer reads from a
single shared `DEMO_USER_WINS` fixture.

---

## Project context

### What FAWZ is

A consumer-facing prize draw application where users earn entries
(`fawz_numbers`) by completing challenges or referring friends, and
those entries are matched against periodic draw results across three
tiers (`last_4`, `last_6`, `last_8`). Wins are credited or held based
on KYC / payout policy. There is also a merchant surface for partner
businesses and an admin/compliance surface (skeleton only).

### Constraints baked into the build contract

The `CLAUDE.md` file is the build contract; it specifies:

- **RTL is primary.** Arabic is the dominant locale; the app must work
  perfectly in RTL.
- **Pixel-perfect Figma.** Brand identity, spacing, type scale, shadows,
  animations all sourced from Figma design tokens.
- **All 5 page states.** Every page handles loading skeleton, data,
  empty, error, offline.
- **Strict TypeScript.** No `any`, no `@ts-ignore`, every API response
  typed.
- **No hardcoded strings or colors.** All text via `i18next`, all
  colors from theme tokens.
- **Logical properties only.** Tailwind v4 logical utilities
  (`ps-`/`pe-`/`start-`/`end-`/`text-start`/`text-end`).

### What "submission mode" means

The reviewer should be able to clone, `npm install`, `npm run dev`,
log in with any credentials, and explore the entire app without ever
hitting the network (other than fonts). Real-API integration exists
in the codebase but is gated behind a `dataSource` toggle that
defaults to `mock`.

---

## Tech stack & why

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19** | Concurrent features, automatic batching, `useTransition` for non-blocking nav. |
| Build | **Vite 6** | Native ESM dev server with sub-second HMR; Rollup-based prod build. |
| Language | **TypeScript 5 (strict)** | Catch shape errors at compile time; required by IQARX standards. |
| Routing | **react-router v7** | First-class lazy routes via `lazy()` + `Suspense`, declarative layouts via `Outlet`. |
| Server state | **TanStack Query v5** | Cache, dedupe, invalidate, background refetch — all the things you'd otherwise hand-roll. |
| Client state | **Zustand v5 + persist** | Two stores (`auth`, `ui`); shape mirrors what `localStorage` should hold; rehydrates synchronously. |
| HTTP | **axios** | Interceptors are the cleanest way to do "attach token / handle 401 / unwrap errors / fall back to mock." |
| Forms | **react-hook-form + zod** | Uncontrolled inputs (no per-keystroke re-render) with schema validation. |
| Styling | **TailwindCSS v4** | `@theme` block in CSS for design tokens; logical properties native; no JS config drift. |
| i18n | **i18next + react-i18next** | The de-facto React i18n; `useTranslation` is straightforward, supports interpolation. |
| Icons | **lucide-react + image-based 3D** | Lucide for utility iconography, custom 3D PNG assets for hero icons. |
| Date | **date-fns** | Tree-shakeable, locale-aware, function-based. |

Rationale for the boundaries:
- **Server vs client state separation is strict.** No server data is
  ever copied into Zustand. The auth `user` is technically server
  data but is duplicated because it must survive a full reload before
  the next API call hydrates it.
- **Forms outside React Query.** Form state is local; only the
  submit handler calls a TanStack mutation.
- **URL state takes priority.** Filters, sort, pagination live in
  query params so deep links work and browser back is correct.

---

## Folder structure & layering

```
src/
├── app/                  # Composition root
│   ├── App.tsx           # <RouterProvider> + global toaster
│   ├── providers.tsx     # QueryClient + i18n + StrictMode
│   └── router.tsx        # (re-exports from routes/index.tsx)
│
├── config/
│   ├── env.ts            # Typed import.meta.env (zod-validated at boot)
│   ├── queryClient.ts    # TanStack Query defaults
│   └── theme.ts          # Re-export design tokens
│
├── core/                 # Cross-cutting infrastructure (no feature code)
│   ├── network/
│   │   ├── apiClient.ts  # axios + interceptors + withFallback() + token storage
│   │   └── types/        # AppError, NetworkError, ValidationError, UnauthorizedError
│   ├── i18n/             # i18next init + en.json + ar.json
│   ├── mocks/            # In-memory fixtures
│   │   └── demoStats.ts  # DEMO_USER_WINS — single source of truth for entries/draws/prizes
│   ├── theme/            # Token re-exports for JS access (otherwise CSS vars)
│   ├── utils/            # cn(), formatters, validators, helpers, logger
│   └── types/            # ApiResponse<T>, env.d.ts
│
├── features/             # One folder per vertical; consistent shape inside
│   └── <feature>/
│       ├── pages/        # Default-export route components (lazy()-loaded)
│       ├── components/   # Feature-local components
│       ├── hooks/        # Feature-local hooks
│       ├── services/     # Query/mutation hooks + API call sites
│       └── types/        # Domain types + zod schemas
│
├── shared/               # Cross-feature primitives
│   ├── components/       # Button, Card, Input, Modal, Skeleton, Icon3D, …
│   ├── layouts/          # AppLayout, AuthLayout, Header, Sidebar, BottomTabBar, MobileTopActions
│   └── hooks/            # useAuth, useNetworkStatus, usePageTitle, useDebounce, …
│
├── stores/
│   ├── auth.store.ts     # user + token, persisted as fawz.auth
│   └── ui.store.ts       # language + sidebar + dataSource, persisted as fawz.ui
│
├── routes/
│   ├── index.tsx         # Route table with lazy() + Suspense
│   └── guards/           # AuthGuard, GuestGuard
│
└── styles/               # globals.css (theme + fonts), tailwind.css

public/brand/             # 3D PNG assets (calendar, ticket, gift, bell, …)
docs/                     # Build contracts (input docs)
scripts/                  # Playwright capture and smoke scripts
```

### Layering rules (enforced socially, not technically)

```
features/* ──can import──▶ shared/* ──can import──▶ core/*
features/* ──can import──▶ core/* (services + types)
features/* ❌ cannot import another feature's internals
shared/*   ❌ cannot import features/*
core/*     ❌ cannot import features/* or shared/*
```

The `routes/` and `app/` layers sit above `features/` and compose
them. Each feature is independently lazy-loadable.

---

## Phase-by-phase journey

The git history is the truth here. Each commit was a deliberate phase.

### Phase 1 — Scaffold (`9290001`)
*Vite + React + TS template, baseline config.*

Decisions:
- **Vite over Next.js.** No SSR/SEO requirements; the app is
  authenticated-first and behind login. Vite gives sub-second HMR
  which paid back many times over.
- **Strict TypeScript from day 0.** `noImplicitAny`, `strict: true`,
  `noUncheckedIndexedAccess` later disabled because `i18next`
  resource shapes don't survive it cleanly.
- **Path aliases** (`@core`, `@shared`, `@features`, `@stores`,
  `@config`). Dotted relative imports past two levels become
  unreadable; aliases keep imports flat regardless of nesting.

### Phase 2 — Infrastructure foundation (`d96b7b2`)
*Providers, router, i18n, network, stores, theme.*

Decisions:
- **`apiClient.ts` does five things:** baseURL+timeout, attach token,
  log requests in dev, normalize errors into typed instances
  (`UnauthorizedError`, `ValidationError`, `AppError`,
  `NetworkError`), dispatch `auth:logout` on 401. Each interceptor
  has one job; the next phase added the mock-mode short-circuit but
  the seams stayed clean.
- **Two Zustand stores.** `auth` holds user+token (writes also push
  the token to `localStorage` for axios to read). `ui` holds
  language, sidebar, dataSource. Splitting them keeps persistence
  schemas independent — bumping one doesn't reset the other.
- **i18n preloaded.** `en.json` and `ar.json` are imported, not
  fetched. They are tiny (~5 KB each) and avoiding a network call on
  language switch matters in RTL where the whole document direction
  flips.
- **Routing with `lazy()` + `Suspense` per route.** Each page is its
  own chunk. The `PageBoundary` component wraps the entire `<Outlet>`
  in `Suspense` with a `LoadingOverlay` fallback so any route
  transition gets a consistent loading state.
- **Auth guards as wrapper components**, not HOCs. `<AuthGuard>` and
  `<GuestGuard>` read the store synchronously (post-rehydration) and
  redirect via `<Navigate>`. No race conditions because the store
  rehydrates before render thanks to Zustand's sync persist.

### Phase 3 — Consumer screens (`c89a341`)
*78 files, 8218 lines: every consumer page in one go.*

This is the bulk of the UI. Built in one commit to keep the
build/figma/types feedback loop tight — incremental commits during
this phase would have meant constantly fighting partial type errors.

Notable structural choices:
- **Service files own everything API-related.** `entry.service.ts`
  exports both the query keys (`entryKeys`), the hooks
  (`useEntries`, `useTotalEntriesValue`), and the imperative API
  function if needed. Pages never call axios directly.
- **Query keys as factories.** Standard pattern:
  ```ts
  export const entryKeys = {
    all:    ['entries'] as const,
    lists:  () => [...entryKeys.all, 'list'] as const,
    list:   (filters) => [...entryKeys.lists(), filters] as const,
  };
  ```
  Lets `invalidateQueries({ queryKey: entryKeys.lists() })` invalidate
  every list regardless of filter — used after mutations.
- **`useLiveDrawSimulation`** is a custom hook (not a TanStack
  mutation) because the live draw is a deterministic client-side
  animation, not a server-driven event. The hook owns the digit
  reveal sequence + finalize hook into TanStack cache.
- **All forms via react-hook-form + zod.** The auth pages predated
  the codebase-wide adoption — they use direct `useState` + manual
  validation. Left as-is to avoid touching the lock-down auth flow
  more than necessary; new forms (e.g. dispute submission) use
  rhf+zod.

### Phase 4 — Playwright capture scripts (`4f3b4b8`)
*9 scripts in `scripts/`.*

Decisions:
- **Playwright over visual regression.** This isn't a CI suite — these
  are ad-hoc capture scripts (`capture-home.mjs`, `capture-share.mjs`,
  `smoke.mjs`) that snapshot specific views into `screenshots/` for
  visual review. The Playwright Test runner would have been overkill;
  raw `chromium.launch()` + `page.screenshot()` keeps each script
  under 50 lines.
- **Scripts are gitignored output, not inputs.** `screenshots/` is
  in `.gitignore`; the `scripts/*.mjs` files are committed.

### Phase 5 — Review feedback round 1 (`915b9f1`)
*i18n, 3D icons (initial SVG), responsiveness.*

Decisions:
- **Inline SVG for 3D icons.** First implementation rendered the brand
  3D icons as multi-path SVGs with gradients. Worked, but the user
  later provided ChatGPT-generated PNG renders that were higher
  fidelity than the SVG approximations — see Phase 8.
- **Mobile-first responsive sweep.** Breakpoints reaffirmed: base
  (375px), `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Touch targets
  bumped to `min-h-11 min-w-11` (44 px) on every interactive
  element on mobile.
- **Splash screen.** Logo + tagline + 1.2 s timer, then redirects via
  the GuestGuard/AuthGuard depending on session.

### Phase 6 — Brand + sandbox API + mock toggle (`193c2b9`)
*The biggest commit in the project.*

This is the phase that defines the FAWZ visual identity and the
mock-fallback infrastructure.

#### Brand identity

- **Two-color brand: teal + gold.** Teal (`#00C6A7`) is the trust
  / digital-finance primary, gold (`#FFC94D`) is reserved for
  winning moments and rewards. The `globals.css` `@theme` block
  declares both palettes 50–950 plus alias scales (`--color-teal-*`,
  `--color-fawzgold-*`) for backward compatibility with components
  written before the rename.
- **Logo locked up.** `public/brand/fawz-logo.png`,
  `fawz-mark.png`, `fawz-wordmark.png`, `fawz-lockup.png` —
  different aspect ratios for different surfaces. The `<Logo>`
  component picks the right one by prop.
- **Type scale.** Inter for Latin, IBM Plex Sans Arabic for
  Arabic, declared in `--font-sans` and `--font-arabic`. Loaded
  with `font-display: swap` from `rsms.me` and `fonts.gstatic.com`.

#### Sandbox integration

- **Vite dev proxy.** `vite.config.ts` proxies `/api/*` →
  `https://fawz-sandbox.dev.iqarx.com`. This avoids CORS in dev
  without baking the upstream URL into the client.
- **`baseURL = /api/v0`.** All apiClient calls use the proxy in
  dev; in prod the same path resolves against whatever host serves
  the app (deployable behind the same nginx).
- **`.env.example`** lists every variable; `env.ts` validates with
  zod at boot. `VITE_TEST_EMAIL`/`VITE_TEST_PASSWORD` pre-fill the
  login form.

#### Mock toggle infrastructure

The single most important architectural decision in the project:

```
       ┌─ getDataSource() === 'mock'? ─yes─▶ MockModeError ─▶ withFallback returns fixture
real ──┤
       └─ otherwise: do the real call ─▶ on 200 return; on error fall through to fixture
```

- **`MockModeError`** is a custom Error thrown synchronously from
  the request interceptor when `dataSource === 'mock'`. Axios
  catches it as a request rejection; the response interceptor
  passes it through; the call site's `.catch` receives it.
- **`withFallback<T>(request, fallback, label)`** wraps any request.
  In mock mode it returns the fallback immediately. In real mode it
  awaits the request and on any error (including `MockModeError`,
  `NetworkError`, 404, 403) returns the fallback. **Real-mode 200
  always wins.**
- This pattern is used everywhere read-only: draws, prizes,
  entries, notifications. Auth was originally on this pattern too
  but was rewritten to pure-mock in Phase 10 (see below).
- The `<DataSourceToggle>` UI component (a small pill in the header)
  flips `dataSource` in the ui store. Hidden in submission build
  but the store key is still toggleable via DevTools (see README).

#### What this trade-off bought

A reviewer can use the app offline. A backend dev can flip the
toggle and test their endpoints without changing any UI code. The
QA Playwright scripts run in mock mode by default, so they're
deterministic.

#### What it cost

- Extra layer in every read path. Every service has both a real
  call and a fixture, doubling the surface area to maintain.
- The fixtures must stay in sync with API shapes. Mitigated by
  shared types — both real and mock paths return the same `T`.
- The `useLogin` hook initially had a real-API path with mock
  fallback, but auth tokens don't survive a silent fallback (the
  next request would 401) — so auth was pure-mock from the
  start, and the rest of the read endpoints follow the toggle.

### Phase 7 — Mobile welcome strip + winner highlight (`6b53fa8`)
*New `MobileTopActions`, beefed-up `DrawResultsPage`.*

- **`MobileTopActions`** is a pinned welcome strip that shows on
  every authenticated mobile page (visible at `< md`). Hosts the
  bell, avatar, route-aware title, and gold halo behind the
  wordmark. Reused across pages instead of letting each page roll
  its own header.
- **DrawResultsPage winner highlight.** When the current user has
  a matched ticket for the displayed draw, a dedicated winner
  panel renders above the standard result list — using
  `findUserWin(drawId)` against `DEMO_USER_WINS`.

### Phase 8 — More page + image icons + demo consistency (`80c2b78`)
*Mobile More hub, Icon3D migration, DEMO_USER_WINS introduction.*

#### MorePage

The bottom tab bar on mobile holds five primary tabs. Anything that
doesn't fit goes on `/more`: Notifications, Referral, Prizes,
Profile, Settings. This kept the tab bar uncluttered while still
exposing every page from a tap.

#### Icon3D image migration

Inline SVGs were replaced with image components for every "hero"
icon (Calendar, Ticket, Gift, Trophy, Clover, Bell, On-Air,
Globe, Wallet, Person). Each component is a thin wrapper:

```tsx
<img
  src="/brand/calendar-3d.png"
  alt=""
  width={size}
  height={size}
  style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
/>
```

Trade-offs explicitly accepted:
- ~50 KB per icon vs ~2 KB for SVG. Amortized by HTTP/2 caching.
- Cannot recolor on hover. The brand wants 3D-specular look,
  recoloring would defeat it.
- Cannot tree-shake unused icons. Every icon ships in the brand
  kit; they're all used somewhere.

#### DEMO_USER_WINS introduction

Pre-Phase 8, each service file seeded its own demo users. Symptom:
the same user could be a winner on `MyNumbers` and a loser on
`DrawResultsPage` because the fixtures disagreed.

Fix: a single `DEMO_USER_WINS` array in `core/mocks/demoStats.ts`,
imported by every consumer:

```ts
export const DEMO_USER_WINS: DemoUserWin[] = [
  { drawId: 'draw-142', fawzNumber: '1234561206', tier: 'last_4',  prizeIqd: 10_000,    payoutStatus: 'credited' },
  { drawId: 'draw-141', fawzNumber: '1234618395', tier: 'last_6',  prizeIqd: 250_000,   payoutStatus: 'credited' },
  { drawId: 'draw-140', fawzNumber: '1229384756', tier: 'last_8',  prizeIqd: 5_000_000, payoutStatus: 'held'     },
];

export function findUserWin(drawId: string) {
  return DEMO_USER_WINS.find((w) => w.drawId === drawId);
}
```

Adding a fourth winning draw is now one entry, not four edits.
This is the bedrock of the demo's coherence.

### Phase 9 — Auth polish + draw bug fixes (`55c6bf2`)
*Polish round, no architectural changes.*

- Signup page UX polish (validation timing, password strength
  indicator).
- Stat icon palette tones reconciled across home and entries.
- A stale-win cache bug in `useLiveDrawSimulation` — the simulation
  cached a winning result, then a subsequent lose scenario showed
  the cached win. Fix: `queryClient.removeQueries({ queryKey:
  drawKeys.myResult(drawId) })` on simulation finalize.

### Phase 10 — Mock-only auth + perf (`4bf33cb`)
*The most recent feature commit.*

The sandbox API became unreachable from the dev environment, so
login was hanging on a 20 s timeout, then erroring out. Three
changes:

1. **Auth → pure mock.** Every hook in
   `src/features/auth/services/auth.service.ts` resolves against
   `buildMockSession()` after a `sleep(250–300)`. No `apiClient`
   imports remain in this module.
2. **Network defaults tightened.** `apiClient` timeout 20 s → 8 s,
   `queryClient` mutation retry 1 → 0, `ui.store.dataSource`
   default `'real'` → `'mock'`.
3. **3D asset additions.** Bell, Challenge dart, Language bubble,
   On-Air badge, Referral person, Transaction wallet — all
   committed under `public/brand/`.

Plus the cumulative UX polish from this session: scroll-to-top
on route change, expandable demo section, Sharia disclosure modal
wired to the profile row, MobileTopActions visual polish, fixed
Globe3D toggle clipping bug.

Detailed write-up of this phase is in `4bf33cb`'s commit body.

---

## Cross-cutting decisions

### Auth strategy

| Concern | Decision |
|---|---|
| Token storage | `localStorage` under `fawz.auth.token`, also mirrored into `auth.store` |
| Token attach | `apiClient` request interceptor reads from `localStorage` |
| 401 handling | Response interceptor clears token + dispatches `auth:logout` event; `useAuth` listens and redirects |
| Session persist | Zustand persist with `partialize` to write only `user` + `token` (not derived state) |
| Hydration timing | Sync — Zustand's persist is synchronous, so no flash of unauth content |
| Mock mode | All auth hooks return mock sessions; any creds work |

The `auth.store` exposes a `setSession(user, token)` that writes both
to the token storage AND the store atomically. Pages always call this
helper, never the underlying setters separately.

### State management

Strict separation:

```
Zustand          ─▶ user, token, language, sidebar state, dataSource
TanStack Query   ─▶ everything that comes from a service file
useState/useReducer ─▶ form state (when not using react-hook-form)
URL search params ─▶ filters, sort, pagination
```

The rule: **never duplicate server state in Zustand.** The auth `user`
is the single allowed exception because the persisted version drives
the initial render before any query runs.

### Network & error handling

| Status | Behavior |
|---|---|
| 200 | Pass through |
| 401 | Clear token, dispatch `auth:logout`, redirect `/login` |
| 422 | Throw `ValidationError` with `fieldErrors`; pages map to inline form errors |
| 4xx other | Throw `AppError(detail, status, code)`; pages toast |
| 5xx | Throw `AppError`; pages toast |
| Network/timeout | Throw `NetworkError`; offline banner if navigator.onLine false |
| Mock mode | Throw `MockModeError`; `withFallback` catches and returns fixture |

`withFallback` is the universal escape hatch. It explicitly does NOT
fall back on a 200 with bad data — only on errors — because a 200
with garbage is a contract violation and we'd rather see the bug than
silently mask it.

### i18n & RTL

- **Two locales preloaded.** `en.json` and `ar.json` imported at app
  init, not lazy-loaded. Switch is instant.
- **Direction switch happens in two places:** `setLanguage()` in
  `core/i18n/index.ts` writes `document.documentElement.dir`, and
  `ui.store.setLanguage` does the same on persist rehydration.
- **Logical properties everywhere.** ESLint doesn't enforce this, but
  every Tailwind class in the codebase uses `ps-`/`pe-`/`ms-`/`me-`/
  `start-`/`end-`/`text-start`/`text-end`. There is no `pl-`/`pr-`/
  `ml-`/`mr-`/`left-`/`right-` outside `index.html` font preload tags.
- **Directional icons** flip via `rtl:rotate-180`. Used on
  `ArrowRight`, `ChevronRight`, the auth submit arrows, and the
  language toggle badge positioning.
- **Numerals stay Arabic-Indic only when the design calls for it.**
  Most tabular numbers (entry counts, prize amounts) use Latin
  digits even in Arabic mode for legibility — confirmed with
  product.

### Brand identity

- **Teal-first.** Primary trust color across CTAs, headings, links.
- **Gold for winning moments only.** Jackpot ticker, winner overlay,
  crowd badge — places where the user has won or is about to.
  Overuse dilutes the win signal.
- **Glass-morphism for surfaces.** White cards with
  `bg-white/95 backdrop-blur-xl` and a soft border. Sits on the
  teal-gradient app background without harsh contrast.
- **3D icons over flat.** Hero icons are full-color rendered PNGs with
  drop shadows. Flat lucide icons handle inline UI (eye toggle,
  arrows, chevrons).

### 3D icon strategy

See Phase 8 above. The contract:
- File path: `/brand/<name>-3d.png`
- Component name: `<Name>3D` in `Icon3D.tsx`
- Props: `{ size?: number; className?: string }`
- Default size: 44 px
- Drop-shadow filter applied via inline style

This is the contract because Tailwind cannot apply `filter:
drop-shadow()` from a class name in a way that survives the
component's outer wrapper, so it has to be inline. Acceptable
exception to the no-inline-styles rule.

### Demo data — single source of truth

`DEMO_USER_WINS` (Phase 8) is the canonical store. Every service
file derives from it:

```
DEMO_USER_WINS ──▶ findUserWin(drawId) ──▶ entry.service / draw.service / prize.service
                                          / DrawResultsPage / PrizesPage / HomePage
```

To change demo behavior, edit one file. Adding a fourth winning
draw, downgrading a tier, holding a payout — all single-line edits.

### Performance decisions

| Optimization | What | Why |
|---|---|---|
| Lazy routes | Every page wrapped in `lazy()` | First load only needs the splash + auth chunks |
| Query stale-time | 60 s default, `gcTime` 5 min | Hot navigation skips refetch; cold returns from cache and refetches in bg |
| Mutation retry | 0 (was 1) | One failure → straight to error path; no double POST |
| API timeout | 8 s (was 20 s) | Reviewer never waits more than 8 s for a dead endpoint |
| Default `dataSource` | `mock` (was `real`) | Demo loads instantly with zero network |
| Image-based icons | PNG with HTTP/2 cache | Better fidelity than SVG; cache hit rate ~1 |
| Font preload | `font-display: swap` | No FOIT; fallback rendered immediately, swapped when web font lands |
| Background image fixed | CSS `background-attachment: fixed` on auth | One paint, not one per scroll frame |

### Accessibility

- Keyboard navigation: every interactive element has `aria-label` if
  not text-labeled. Focus rings on inputs (4 px brand-100 ring).
- Touch targets: 44 px minimum on mobile.
- Modals: focus-trapped via `Modal` shared component.
- Reduced motion: `useReducedMotion` hook gates the more expensive
  animations (jackpot ticker, particles).
- Screen reader: `alt=""` on decorative 3D icons (they have visible
  labels next to them); `aria-hidden` on icon containers.

### Security

- No `eval`, no `dangerouslySetInnerHTML` anywhere.
- Token in `localStorage` not `cookie`. Acceptable because the API
  uses `Authorization: Bearer` and CORS is locked down at the API
  edge — no CSRF surface.
- All user-facing strings via i18next, not interpolated into HTML.
- Vite production build produces hash-named chunks; CSP-ready.

---

## Verification

### Type & lint gates

```bash
npx tsc --noEmit -p tsconfig.app.json   # passes clean
npx eslint src --max-warnings 0         # passes clean
```

### End-to-end smoke

Two flows verified via ad-hoc Playwright scripts (discarded after
confirmation):

| Flow | Steps | Result |
|---|---|---|
| Login | `/login` → fill any creds → submit | `/home` in ~250 ms; zero `/api/` hits |
| Signup | `/signup` → fill form → `/verify-email` → fill 6 digits | `/home` in ~253 ms post-OTP; zero `/api/` hits |

### Manual responsive sweep

Verified at 375 px (iPhone SE), 768 px (tablet), 1280 px (desktop)
across all primary pages. The bottom tab bar shows only at `< md`,
the sidebar shows only at `≥ md`.

### Manual RTL sweep

Toggle the Globe3D button on any auth page; entire layout flips
including bottom-tab order, sidebar position, icon directionals,
text alignment, and the welcome strip layout.

---

## Known limitations

1. **`useVerifyEmail` ignores submitted name.** Returns a default
   `Demo Player`, not the first/last entered at signup, because the
   verify mock receives only `{ email, verify_code }`. Carrying the
   names through would require either passing them via
   `sessionStorage` or extending the verify call signature.
   Intentionally left as-is — the real verify endpoint returns user
   info from the server-side record.

2. **`dataSource` toggle is hidden in submission build.** The
   `<DataSourceToggle>` component still exists; it's just not
   rendered in `Header.tsx`. To flip back to `real`, edit the
   `localStorage` value in DevTools (see README).

3. **Zustand persist version not bumped.** Users with an old
   `dataSource: 'real'` cached in `localStorage` continue with
   `real`. Bumping the persist version would force-reset on first
   load — a one-line change if needed for clean reviewer experience.

4. **Auth pages don't use react-hook-form.** Predates the codebase-
   wide rhf+zod adoption. Validation is manual `useState`-based.
   Works correctly; just stylistically inconsistent with newer
   forms (e.g. dispute submission).

5. **Tests are smoke-only.** No vitest unit tests, no Playwright Test
   suite. Per the build contract Phase 4 was QA scripts, not a CI
   suite. Adding `vitest` would be one config change but isn't in
   scope.

6. **Merchant + admin surfaces are skeletons.** Routes exist
   (`/merchant/home`, `/merchant/entries`, `/merchant/prizes`); pages
   render a header and a placeholder. Admin and compliance roles
   are typed in `AuthUser['role']` but no admin UI is built.

7. **Live draw simulation is client-only.** The digit reveal sequence
   in `useLiveDrawSimulation` runs on a deterministic timer, not
   driven by a server event. A real implementation would need a
   websocket or SSE; the hook's seam is in the right place to swap
   the source.

8. **No service worker / PWA install.** Out of scope. The app is
   responsive but not installable.

---

## Repository

- Working repo: `git@github.com:haydarfarhat99/fawz-app.git`
- Submission repo: `git@github.com:haydarfarhat99/fawz-design-task.git`
- Both track the same `main`; commits land in both.

---

## Credits

This codebase was built collaboratively with Claude Code (Opus 4.7,
1M context), iteratively reviewed by the human author, and hardened
through Playwright capture passes. Every decision in this report
reflects a back-and-forth between proposed approach and accepted
trade-off.
