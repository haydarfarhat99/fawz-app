import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/global-rollout';
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ['login',         '/login',                     { auth: false, wait: 700 }],
  ['signup',        '/signup',                    { auth: false, wait: 600 }],
  ['forgot',        '/forgot-password',           { auth: false, wait: 500 }],
  ['home',          '/home',                      { auth: true,  wait: 900 }],
  ['entries',       '/entries',                   { auth: true,  wait: 700 }],
  ['draws-results', '/draws/results',             { auth: true,  wait: 700 }],
  ['draws-live-mid','/draws/live?type=monthly&scenario=jackpot', { auth: true, wait: 5000 }],
  ['challenges',    '/challenges',                { auth: true,  wait: 700 }],
  ['referral',      '/referral',                  { auth: true,  wait: 800 }],
  ['prizes',        '/prizes',                    { auth: true,  wait: 700 }],
  ['notifications', '/notifications',             { auth: true,  wait: 700 }],
  ['profile',       '/profile',                   { auth: true,  wait: 700 }],
];

const VIEWPORTS = [
  { tag: 'desktop', viewport: { width: 1280, height: 900 } },
  { tag: 'mobile',  viewport: { width: 390, height: 850 } },
];

const browser = await chromium.launch();

for (const v of VIEWPORTS) {
  for (const [name, url, opts] of ROUTES) {
    const ctx = await browser.newContext({ viewport: v.viewport });
    await ctx.addInitScript(() => {
      sessionStorage.setItem('fawz.splash.shown', '1');
      localStorage.setItem('fawz.consent.sharia', 'true');
      localStorage.setItem('fawz.ui', JSON.stringify({
        state: { language: 'en', sidebarCollapsed: false, dataSource: 'mock' },
        version: 0,
      }));
    });
    if (opts.auth) {
      await ctx.addInitScript(() => {
        localStorage.setItem('fawz.auth.token', 'mock-1');
        localStorage.setItem('fawz.auth', JSON.stringify({
          state: {
            user: { id: 'mock', email: 'test@fawz.io', fullName: 'Normal User', role: 'consumer', entryCount: 0, isNew: false },
            token: 'mock-1',
          },
          version: 0,
        }));
      });
    }
    const page = await ctx.newPage();
    await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(opts.wait);
    await page.screenshot({ path: path.join(OUT, `${v.tag}-${name}.png`), fullPage: true });
    console.log('✓', v.tag, name);
    await ctx.close();
  }
}

await browser.close();
console.log('Done.');
