import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';

const VIEWPORTS = [
  { tag: 'w320', viewport: { width: 320, height: 700 } },
  { tag: 'w375', viewport: { width: 375, height: 812 } },
  { tag: 'w414', viewport: { width: 414, height: 896 } },
  { tag: 'w768', viewport: { width: 768, height: 1024 } },
  { tag: 'w1280', viewport: { width: 1280, height: 900 } },
];

const ROUTES = [
  ['login',         '/login',                                          { auth: false, wait: 600 }],
  ['home',          '/home',                                           { auth: true, wait: 800 }],
  ['live-mid',      '/draws/live?type=monthly&scenario=jackpot',       { auth: true, wait: 5000 }],
  ['live-win',      '/draws/live?type=weekly&scenario=jackpot',        { auth: true, wait: 16000 }],
  ['draw-results',  '/draws/results',                                  { auth: true, wait: 700 }],
  ['entries',       '/entries',                                        { auth: true, wait: 700 }],
  ['referral',      '/referral',                                       { auth: true, wait: 1000 }],
  ['prizes',        '/prizes',                                         { auth: true, wait: 700 }],
];

const browser = await chromium.launch();

for (const v of VIEWPORTS) {
  const OUT = `./screenshots/responsive-${v.tag}`;
  fs.mkdirSync(OUT, { recursive: true });

  for (const [name, url, opts] of ROUTES) {
    const context = await browser.newContext({ viewport: v.viewport });
    if (opts.auth) {
      await context.addInitScript(() => {
        localStorage.setItem('fawz.consent.sharia', 'true');
        localStorage.setItem('fawz.auth.token', 'demo-token-smoke');
        localStorage.setItem('fawz.auth', JSON.stringify({
          state: {
            user: { id: 'demo-user', email: 'test@fawz.io', fullName: 'Smoke Tester', role: 'consumer', entryCount: 12, isNew: false },
            token: 'demo-token-smoke',
          },
          version: 0,
        }));
        localStorage.setItem('fawz.ui', JSON.stringify({ state: { language: 'en', sidebarCollapsed: false }, version: 0 }));
        sessionStorage.setItem('fawz.splash.shown', '1');
      });
    } else {
      await context.addInitScript(() => {
        localStorage.setItem('fawz.ui', JSON.stringify({ state: { language: 'en', sidebarCollapsed: false }, version: 0 }));
        sessionStorage.setItem('fawz.splash.shown', '1');
      });
    }
    const page = await context.newPage();
    await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(opts.wait);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
    console.log('✓', v.tag, name);
    await context.close();
  }
}

await browser.close();
console.log('\nDone.');
