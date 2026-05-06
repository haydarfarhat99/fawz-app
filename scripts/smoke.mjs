import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';

const ROUTES = [
  ['login',           '/login',                          { auth: false }],
  ['signup',          '/signup',                         { auth: false }],
  ['verify-email',    '/verify-email?email=test@fawz.io',{ auth: false }],
  ['forgot-pw',       '/forgot-password',                { auth: false }],
  ['reset-pw',        '/reset-password?email=test@fawz.io',{ auth: false }],
  ['splash',          '/login',                          { auth: false, wait: 800, splash: true }],
  ['home',            '/home',                           { auth: true }],
  ['live-draw',       '/draws/live',                     { auth: true, wait: 4500 }],
  ['live-draw-win',   '/draws/live?scenario=win',        { auth: true, wait: 32000 }],
  ['live-draw-lose',  '/draws/live?scenario=lose',       { auth: true, wait: 32000 }],
  ['draw-results',    '/draws/results',                  { auth: true }],
  ['draw-detail',     '/draws/draw-142',                 { auth: true }],
  ['winner-share',    '/winners/win-1/share',            { auth: true }],
  ['draw-not-found',  '/draws/zzz-bad-id',               { auth: true, wait: 800 }],
  ['draws-redirect',  '/draws',                          { auth: true }],
  ['entries',         '/entries',                        { auth: true }],
  ['challenges',      '/challenges',                     { auth: true }],
  ['challenge-detail',  '/challenges/ch-spark',          { auth: true }],
  ['challenge-not-found','/challenges/zzz-bad',          { auth: true, wait: 800 }],
  ['referral',        '/referral',                       { auth: true }],
  ['referral-history','/referral/history',               { auth: true }],
  ['prizes',          '/prizes',                         { auth: true }],
  ['notifications',   '/notifications',                  { auth: true }],
  ['notif-prefs',     '/settings/notifications',         { auth: true }],
  ['profile',         '/profile',                        { auth: true }],
  ['dispute-submit',  '/support/dispute',                { auth: true }],
  ['dispute-history', '/support/disputes',               { auth: true }],
  ['merchant-home',   '/merchant/home',                  { auth: true }],
  ['merchant-entries','/merchant/entries',               { auth: true }],
  ['merchant-prizes', '/merchant/prizes',                { auth: true }],
];

const PASSES = [
  { tag: 'desktop-en', viewport: { width: 1280, height: 800 }, lang: 'en' },
  { tag: 'mobile-en',  viewport: { width: 375, height: 812 },  lang: 'en' },
  { tag: 'mobile-ar',  viewport: { width: 375, height: 812 },  lang: 'ar' },
];

const browser = await chromium.launch();

const allErrors = {};
let totalErrors = 0;
let totalRoutes = 0;

for (const pass of PASSES) {
  const OUT = `./screenshots/${pass.tag}`;
  fs.mkdirSync(OUT, { recursive: true });

  console.log(`\n=== PASS: ${pass.tag} (${pass.viewport.width}x${pass.viewport.height}, ${pass.lang}) ===`);

  for (const [name, url, opts] of ROUTES) {
    totalRoutes++;
    const context = await browser.newContext({ viewport: pass.viewport });

    const showSplash = !!opts.splash;
    if (opts.auth) {
      await context.addInitScript(({ lang, showSplash }) => {
        localStorage.setItem('fawz.consent.sharia', 'true');
        localStorage.setItem('fawz.auth.token', 'demo-token-smoke');
        localStorage.setItem('fawz.auth', JSON.stringify({
          state: {
            user: { id: 'demo-user', email: 'test@fawz.io', fullName: 'Smoke Tester', role: 'consumer', entryCount: 12, isNew: false },
            token: 'demo-token-smoke',
          },
          version: 0,
        }));
        localStorage.setItem('fawz.ui', JSON.stringify({
          state: { language: lang, sidebarCollapsed: false },
          version: 0,
        }));
        if (!showSplash) sessionStorage.setItem('fawz.splash.shown', '1');
      }, { lang: pass.lang, showSplash });
    } else {
      await context.addInitScript(({ lang, showSplash }) => {
        localStorage.setItem('fawz.ui', JSON.stringify({
          state: { language: lang, sidebarCollapsed: false },
          version: 0,
        }));
        if (!showSplash) sessionStorage.setItem('fawz.splash.shown', '1');
      }, { lang: pass.lang, showSplash });
    }

    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push('JS_ERROR: ' + e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') {
        const txt = m.text();
        if (!txt.includes('Failed to load resource')) errors.push('CONSOLE_ERROR: ' + txt.slice(0, 200));
      }
    });

    try {
      await page.goto(BASE + url, {
        waitUntil: opts.splash ? 'commit' : 'networkidle',
        timeout: 40_000,
      });
      await page.waitForTimeout(opts.wait ?? 400);
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
      const status = errors.length ? `✗ ${errors.length} ERR` : '✓';
      console.log(status.padEnd(10), name.padEnd(22), url);
      if (errors.length) {
        allErrors[`${pass.tag}/${name}`] = errors;
        totalErrors += errors.length;
      }
    } catch (e) {
      console.log('✗ NAV_FAIL'.padEnd(10), name.padEnd(22), url, '·', e.message.slice(0, 100));
      allErrors[`${pass.tag}/${name}`] = [e.message];
      totalErrors++;
    }

    await context.close();
  }
}

console.log('\n=== SUMMARY ===');
console.log('Total runs:', totalRoutes);
console.log('Total errors:', totalErrors);
if (totalErrors > 0) {
  console.log('\n=== DETAILS ===');
  for (const [name, errs] of Object.entries(allErrors)) {
    console.log(`\n[${name}]`);
    for (const e of errs.slice(0, 5)) console.log('  ', e);
  }
}

await browser.close();
process.exit(totalErrors > 0 ? 1 : 0);
