# FAWZ Backend Integration Checklist

**Sandbox**: `https://fawz-sandbox.dev.iqarx.com/api/v0`
**Test user**: `normaluser.20260506@fawz.com` / `NormalUser@2026!`
**Token**: returned by `PATCH /fawz_user_management/user/login_user` as `encrypted_token` (Bearer).

The web app has a **Live API ↔ Mock data** toggle in the header (and on the auth pages). Real-mode requests that 404 or 403 fall back to dummy data automatically so the UI never breaks. This document tracks which endpoints are missing or restricted on the sandbox today.

---

## ✅ Working (200) — confirmed live

| Endpoint | Used by |
|----------|---------|
| `PATCH /fawz_user_management/user/login_user` | Login flow |
| `GET /fawz_user_management/user/me` | Header avatar / Profile bootstrap |
| `GET /fawz_consumer_engagement/notifications` | Notifications list (returns empty for new user) |
| `GET /fawz_draw_management/draw_winners` | Will power Prizes list once user has wins |
| `GET /fawz_draw_management/draw_prize_tiers` | Will power Draw detail tier table |

---

## 🟡 Forbidden (403) — endpoint exists, our role is missing the permission

The "Normal User" role (`a0000000-0000-0000-0000-000000000001`) needs these permissions added:

| Endpoint | Permission needed |
|----------|---------|
| `GET /fawz_consumer_engagement/notification_preferences` | `GetNotificationPreferences` |
| `PATCH /fawz_consumer_engagement/notification_preferences/{id}` | `UpdateNotificationPreferences` |
| `GET /fawz_prize_payout_management/prize_payouts` | `GetMyPrizePayouts` (or read-self filter) |
| `GET /fawz_prize_payout_management/budget_monitorings` | (admin-only — leave fallback) |
| `GET /fawz_draw_management/jackpot_rollovers` | `GetJackpotRollovers` |

---

## 🔴 Not deployed (404) — backend team needs to deploy these on the sandbox

The web app already has all the screens built and falls back to mock data; once these are live, they'll pick up real data automatically.

### Draws

- `GET /fawz_draw_management/draws` — list
- `GET /fawz_draw_management/draws/{draw_id}` — detail
- `GET /fawz_draw_management/draw_digit_events` — live digit reveals (websocket too)
- `GET /fawz_draw_management/websocket_connections` — live broadcast subscription

**Suggested consumer-friendly aliases the web app currently asks for** (optional — backend can add or we can rewrite client paths):
- `GET /fawz_draw_management/draw/current` → next/active draw
- `GET /fawz_draw_management/draw/{id}/my_result` → my entries-vs-winners for this draw

### Entries

- `GET /fawz_entry_generation/fawz_entries` — list (filter by user_id)
- `GET /fawz_entry_generation/transaction_eligibility_caches` — entry source breakdown

Web-app expectation: "My Numbers" page lists tickets grouped weekly/monthly, with source (transaction/challenge/referral/retroactive).

### Challenges

- `GET /fawz_challenge_system/challenges` — list
- `GET /fawz_challenge_system/challenges/{id}` — detail
- `GET /fawz_challenge_system/user_challenge_progresses` — my progress
- `GET /fawz_challenge_system/user_badges` — my badges
- `GET /fawz_challenge_system/badges` — catalog

### Referrals

- `GET /fawz_referral_system/referrals` — my history
- `GET /fawz_referral_system/referral_links` — my Golden Ticket link/code
- `POST /fawz_referral_system/referral_click_trackings` — share-click attribution

### Prizes

- `GET /fawz_prize_payout_management/user_payout_caps` — daily/weekly cap status
- (Already requires permission fix above for `prize_payouts`)

### Profile

- The web app calls `/fawz_user_management/user/fawz-profile` for consumer-specific stats (lifetime entries, wins, badges, tier). This endpoint doesn't exist in the API spec and currently 404s. Either:
  - Add a thin BFF endpoint that aggregates `user/me` + `user_badges` + `prize_payouts`, OR
  - Web app can stitch it client-side once `user_badges` and `prize_payouts` work.

### Disputes

- `GET /fawz_fraud_compliance/dispute/my-disputes` (alias) — or list filter on the underlying `disputes` resource
- `GET /fawz_fraud_compliance/dispute/quota` — monthly cap remaining

---

## How to verify after fixes

1. Toggle the header to **"Live API"**.
2. Reload any page.
3. If the endpoint now returns real data, the UI shows it; otherwise the fallback dummy data still renders and the browser console logs `Falling back to dummy data for: <label>`.
4. Open DevTools → Network. Look for `200 OK` instead of `404` or `403`.

## Toggle behaviour

- **Live API**: every request hits the real backend; failures fall back silently to dummy data (so partial-coverage doesn't break demos).
- **Mock data**: no network calls are made at all; the app behaves exactly like an offline demo.

The preference persists in `localStorage` under `fawz.ui` → `state.dataSource`.
