# FAWZ — Web

Prize-draw engagement web app for the Iraqi market, built on top of the
SuperQi wallet.

> Stack: **React 19** · **Vite 6** · **TypeScript (strict)** ·
> **TailwindCSS v4** · **TanStack Query v5** · **Zustand v5** ·
> **react-i18next** · **react-router v7**.

---

## Quick start

```bash
npm install
npm run dev
# → http://localhost:5173
```

Then open the app and sign in (any well-formed email + ≥6-char password
works in mock mode):

| Field | Value |
|---|---|
| Email | `normaluser.20260506@fawz.com` |
| Password | `NormalUser@2026!` |

The login form pre-fills these from `.env` (see `.env.example`). After
login you land on `/home` with a populated demo session.

---

## Mock vs real data

The app supports two data sources, toggled in `src/stores/ui.store.ts`:

- **`mock`** *(default)* — every read resolves against in-memory
  fixtures in `src/core/mocks/` after a short `sleep()`. Auth is fully
  mocked: any creds sign in, any 6-digit OTP verifies. No network
  required.
- **`real`** — reads hit the sandbox API
  (`https://fawz-sandbox.dev.iqarx.com/api/v0`) via the `/api` Vite dev
  proxy. Read endpoints (draws, prizes, entries) fall back to fixtures
  on 404/403/network/timeout via `withFallback()` in
  `src/core/network/apiClient.ts`. Auth in this branch was rewritten to
  *always* use mock for demo speed; switching it back is a one-line
  change in `auth.service.ts`.

A toggle UI exists but is hidden in this submission build. Flip it via
the browser DevTools:

```js
JSON.parse(localStorage['fawz.ui'])  // inspect
localStorage.setItem('fawz.ui', JSON.stringify({
  state: { ...JSON.parse(localStorage['fawz.ui']).state, dataSource: 'real' },
  version: 0
}))
location.reload()
```

---

## Scripts

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # Production build to dist/
npm run preview      # Preview the production build
npm run lint         # ESLint, zero warnings allowed
npx tsc --noEmit     # Typecheck (strict mode)
```

---

## Project structure

```
src/
├── app/              # Root: providers, router
├── config/           # env, queryClient, theme tokens
├── core/             # network (apiClient + withFallback), i18n,
│                     # mocks (DEMO_USER_WINS source of truth),
│                     # theme tokens, utils
├── features/         # Vertical slices: auth, draws, entries, home,
│                     # prizes, profile, referral, notifications,
│                     # challenges, merchant
│                     #   ├── pages/       # Lazy-loaded route components
│                     #   ├── components/  # Feature-local components
│                     #   ├── hooks/       # Feature-local hooks
│                     #   ├── services/    # API + TanStack Query hooks
│                     #   └── types/       # Types + Zod schemas
├── shared/           # Cross-feature: components, hooks, layouts
├── stores/           # Zustand stores (auth, ui — both persisted)
├── routes/           # Route table + AuthGuard / GuestGuard
└── styles/           # globals.css, tailwind.css

public/brand/         # 3D PNG icons (calendar, ticket, gift,
                      # bell, on-air, etc.)
docs/                 # Internal: features, fdd flows, fdd edge
                      # cases, api, frontend standards
```

For the build contract (tech stack, code rules, RTL conventions,
state-management rules) see `CLAUDE.md`. For the engineering decisions
behind the most recent commit see `REPORT.md`.

---

## Internationalisation & RTL

- Two locales: `en` (LTR), `ar` (RTL — primary). Both are loaded
  upfront from `src/core/i18n/{en,ar}.json`.
- Direction switches via `document.documentElement.dir` on language
  change. TailwindCSS v4 logical properties (`ps-`, `pe-`, `start-`,
  `end-`, `text-start`, `text-end`) handle layout flipping
  automatically.
- Directional icons use `rtl:rotate-180`.
- Toggle in the top-right `Globe3D` button on every page.

---

## Auth flow shape

```
/login   ─submit─▶ useLogin().mutate()
                    ↓ (250 ms mock)
                  setSession() ─▶ /home

/signup  ─submit─▶ useSignup().mutate()
                    ↓ (300 ms mock)
                  /verify-email?email=…

/verify  ─OTP───▶ useVerifyEmail().mutate()
                    ↓ (250 ms mock)
                  setSession() ─▶ /home
```

Session token + user are persisted to `localStorage` under
`fawz.auth.token` and `fawz.auth` (Zustand). A 401 anywhere in the app
clears the token and dispatches a `auth:logout` event — see
`src/core/network/apiClient.ts`.

---

## Acceptance highlights

- **Pixel-perfect RTL.** Every screen verified in both directions.
- **Five page states.** Loading skeleton, data, empty, error,
  offline — handled per page.
- **Logical properties only.** No `pl-`/`pr-`/`ml-`/`mr-`/`left-`/`right-`
  in any committed code.
- **Zero `any`.** Strict TS, every API response typed.
- **Brand 3D icons.** Calendar, Ticket, Gift, Trophy, Clover, Dart,
  Wallet, Person, Bell, Globe, On-Air — all from `public/brand/`.
- **Single source of truth for demo wins** (`DEMO_USER_WINS`) — entries,
  draws, prizes, and result pages cannot disagree.

---

## Known limitations

See `REPORT.md` § Known limitations.
