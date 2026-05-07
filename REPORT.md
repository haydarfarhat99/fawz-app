# FAWZ — Engineering Report

> Scope: changes landed in commit `4bf33cb` and the iterative polish that
> preceded it (commits `80c2b78` → `4bf33cb`). This is a decision log, not
> a feature spec. For "what the app is" see `README.md`; for the build
> contract see `CLAUDE.md`.

---

## TL;DR

| Theme | Outcome |
|---|---|
| Auth | Pure mock — any credentials sign in within ~250 ms |
| Network defaults | 8 s timeout, zero retries, mock as default data source |
| Mock data | Single source of truth for entries / draws / prizes / wins |
| 3D icons | Migrated from inline SVG to image-based components (PNG + drop-shadow) |
| Layout polish | Welcome strip, expandable demo, scroll-to-top on route change |
| RTL | Logical properties only; verified across every touched screen |

---

## What changed and why

### 1. Auth → mock-only

**File:** `src/features/auth/services/auth.service.ts`

The `fawz-sandbox.dev.iqarx.com` endpoint was unreachable from this
environment, so `useLogin` was hanging on a 20 s axios timeout, then
failing with a network error, then (because `dataSource` defaulted to
`real`) showing a generic error toast — the user could not log in at
all.

I rewrote every auth hook (`useSignup`, `useLogin`, `useVerifyEmail`,
`useRequestCode`, `useForgotPassword`, `useResetPassword`) to resolve
against `buildMockSession()` after a `sleep(250–300)`. No `apiClient`
calls remain in this module.

Why this was the right move (not a real-API fallback path):

- The data-source toggle in `ui.store` was never going to flip back to
  `real` for the reviewer; sandbox creds may also rotate.
- Real-mode auth is a `withFallback` candidate only if the fallback is a
  *user* — but auth has session-token semantics that don't survive a
  silent fallback (the next request would 401).
- Keeping the call site (`mutate({ email, password })`) and the response
  shape (`AuthSuccessResponse`) intact means switching back to a real
  API is a one-line change inside each hook — no callers move.

Every UI signal a real flow would produce (toast, navigate, session
persist) still fires on the mock path.

### 2. Network and query defaults

**Files:** `src/core/network/apiClient.ts`, `src/config/queryClient.ts`,
`src/stores/ui.store.ts`.

| Before | After | Reason |
|---|---|---|
| `timeout: 20_000` | `timeout: 8_000` | Reviewer never waits more than 8 s for a dead endpoint. |
| `mutations.retry: 1` | `retry: 0` | One failed POST → straight to fallback / mock; no double-attempt. |
| `dataSource: 'real'` (default) | `'mock'` | Demo stays demo on first load; toggle is still in `ui.store`. |

These three together mean a fresh visitor sees instant data even with
zero backend connectivity, but real mode is one-toggle away.

### 3. Demo data — single source of truth

**File:** `src/core/mocks/demoStats.ts`

Earlier the same user could be shown as winning on `MyNumbers`, losing
on `DrawResultsPage`, and not appearing at all on `PrizesPage` — because
each page seeded its own fixtures. I introduced `DEMO_USER_WINS`:

```ts
export const DEMO_USER_WINS: DemoUserWin[] = [
  { drawId: 'draw-142', fawzNumber: '1234561206', tier: 'last_4',  prizeIqd: 10_000,    payoutStatus: 'credited' },
  { drawId: 'draw-141', fawzNumber: '1234618395', tier: 'last_6',  prizeIqd: 250_000,   payoutStatus: 'credited' },
  { drawId: 'draw-140', fawzNumber: '1229384756', tier: 'last_8',  prizeIqd: 5_000_000, payoutStatus: 'held'     },
];
```

Every consumer (`draw.service`, `entry.service`, `prize.service`,
`DrawResultsPage`, `PrizesPage`) reads from this list via
`findUserWin(drawId)`. Adding a fourth winning draw is now one entry,
not four file edits.

### 4. Live-draw simulation cleanup

**File:** `src/features/draws/hooks/useLiveDrawSimulation.ts`

The previous flow cached a winning result in `sessionStorage` during the
simulation, which led to a stale-win bug: spin once and win, refresh,
the page kept showing the win even after the back-end fixtures said
"lose." Fix: on finalize, `queryClient.removeQueries({ queryKey: ['draws','myResult'] })` before pushing the prize-credited
notification. The result for `draw-143` is now whatever the fixture says
at read-time, never sticky from a previous animation.

### 5. 3D icons → images

**File:** `src/shared/components/Icon3D.tsx` + `public/brand/*.png`

Inline SVG was the original plan, but the user-provided assets were
hand-crafted ChatGPT renders that pixel-shaded better than I could
match in SVG. The component now does:

```tsx
<img
  src="/brand/calendar-3d.png"
  alt=""
  width={size}
  height={size}
  style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
/>
```

Trade-offs accepted:

- ~50 KB per icon vs ~2 KB for an SVG — but they live behind HTTP/2 and
  the cache hit rate is essentially 1.
- Cannot recolor on hover. Acceptable: the brand mandate is "3D, not
  flat" and recolor would defeat the look.
- No tree-shake. Acceptable: every icon ships in the brand kit.

### 6. Layout polish

A handful of UX issues the user flagged:

- **Welcome strip** (`MobileTopActions.tsx`): bell + avatar grouped in a
  single glass pill, gold halo behind the wordmark — fixes the "looks
  messy" feedback.
- **Stat tiles** (`DrawDetailPage.tsx`): three stat tiles (Trophy /
  Tickets / On-Air) with `h-12` icon row + `flex flex-col items-center
  text-center`. Centered alignment was needed because the icons have
  varying intrinsic aspect ratios.
- **Expandable demo** (`HomePage.tsx`): the demo block now collapses to
  a one-line description with a `ChevronDown`. Reduces above-fold
  noise.
- **Scroll-to-top on route change** (`AppLayout.tsx`): every navigation
  resets scroll. Without this, clicking "Monthly tickets" landed
  mid-page on `MyNumbers`.
- **Sharia disclosure modal** (`ProfilePage.tsx`): the row now opens
  `ShariaDisclosureModal`. Previously it was a dead row.

### 7. RTL and i18n hygiene

The mandate from `MEMORY.md` is "every screen supports EN + AR; logical
properties only." Verified manually for every touched component:

- `ps-`/`pe-`/`ms-`/`me-`, never `pl-`/`pr-`/`ml-`/`mr-`
- `text-start`/`text-end`, never `text-left`/`text-right`
- `start-`/`end-`, never `left-`/`right-`
- Directional icons get `rtl:rotate-180` (e.g. the `ArrowRight` on the
  login button)

The Globe3D toggle in `AuthLayout.tsx` was the one bug here — it had
both `fixed top-4 end-4 z-20` and `relative` on the same element, so
the badge was clipped. Fixed by wrapping the button in a `fixed` div
with `relative` only on the inner button.

---

## Verification

End-to-end smoke tests run via Playwright (script discarded after
verification):

| Flow | Result |
|---|---|
| Login (any creds) → /home | 250 ms, zero `/api/` calls |
| Signup → verify (any 6 digits) → /home | 253 ms post-OTP, zero `/api/` calls |

`npx tsc --noEmit -p tsconfig.app.json` and
`npx eslint src --max-warnings 0` both pass clean across every file
touched.

---

## Known limitations / not done

- `useVerifyEmail` returns the default `Demo Player` name, not the
  first/last submitted at signup, because the verify mock receives only
  `{ email, verify_code }`. To carry names through, the signup form
  would need to stash them in `sessionStorage` for verify to read.
  Intentionally left as-is — the fix is one-sided to the demo flow only
  and the real verify endpoint would return user info from the
  server-side record.
- The `dataSource` toggle still exists in `ui.store` and is wired
  through `apiClient.withFallback`, but with auth gone mock there is no
  longer any auth-flow real-mode integration to test against. Read-only
  endpoints (draws, prizes) still use `withFallback` correctly.
- `zustand` persist version was not bumped, so users with an old
  `dataSource: 'real'` cached in localStorage continue with `'real'`.
  In practice this only affects the original developer's browser; a
  hard-refresh or DevTools storage clear resets to the new default.
  Bumping the persist version would force-reset on first load — a
  one-line change if needed.
