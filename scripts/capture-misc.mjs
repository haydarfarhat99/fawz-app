import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';

const PASSES = [
  { tag: 'desktop-en', viewport: { width: 1280, height: 800 }, lang: 'en' },
  { tag: 'mobile-en',  viewport: { width: 375, height: 812 },  lang: 'en' },
  { tag: 'mobile-ar',  viewport: { width: 375, height: 812 },  lang: 'ar' },
];

const ROUTES = [
  // unauth+splash
  ['splash',          '/login?splash_ms=4000', { auth: false, wait: 1500, splash: true }],
  // mid-broadcast: capture live-draw at ~6s wait so we see digits filling
  ['live-draw',       '/draws/live',           { auth: true,  wait: 6000 }],
];

const browser = await chromium.launch();

for (const pass of PASSES) {
  const OUT = `./screenshots/${pass.tag}`;
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, url, opts] of ROUTES) {
    const context = await browser.newContext({ viewport: pass.viewport });
    const showSplash = !!opts.splash;
    await context.addInitScript(({ lang, auth, showSplash }) => {
      if (auth) {
        localStorage.setItem('fawz.consent.sharia', 'true');
        localStorage.setItem('fawz.auth.token', 'demo-token-smoke');
        localStorage.setItem('fawz.auth', JSON.stringify({
          state: {
            user: { id: 'demo-user', email: 'test@fawz.io', fullName: 'Smoke Tester', role: 'consumer', entryCount: 12, isNew: false },
            token: 'demo-token-smoke',
          },
          version: 0,
        }));
      }
      localStorage.setItem('fawz.ui', JSON.stringify({ state: { language: lang, sidebarCollapsed: false }, version: 0 }));
      if (!showSplash) sessionStorage.setItem('fawz.splash.shown', '1');
    }, { lang: pass.lang, auth: !!opts.auth, showSplash });
    const page = await context.newPage();
    await page.goto(BASE + url, { waitUntil: opts.splash ? 'commit' : 'networkidle', timeout: 40_000 });
    await page.waitForTimeout(opts.wait);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
    console.log('✓', pass.tag, name);
    await context.close();
  }
}

await browser.close();
console.log('\nDone.');
