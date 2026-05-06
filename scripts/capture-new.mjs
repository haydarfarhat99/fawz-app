import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/desktop-en';
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ['splash',         '/login?splash_ms=4000',           { auth: false, wait: 1500, splash: true }],
];

const browser = await chromium.launch();

for (const [name, url, opts] of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const showSplash = !!opts.splash;
  if (opts.auth) {
    await context.addInitScript(({ showSplash }) => {
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
      if (!showSplash) sessionStorage.setItem('fawz.splash.shown', '1');
    }, { showSplash });
  } else {
    await context.addInitScript(({ showSplash }) => {
      localStorage.setItem('fawz.ui', JSON.stringify({ state: { language: 'en', sidebarCollapsed: false }, version: 0 }));
      if (!showSplash) sessionStorage.setItem('fawz.splash.shown', '1');
    }, { showSplash });
  }
  const page = await context.newPage();
  await page.goto(BASE + url, {
    waitUntil: opts.splash ? 'commit' : 'networkidle',
    timeout: 40_000,
  });
  await page.waitForTimeout(opts.wait);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log('✓', name);
  await context.close();
}

await browser.close();
console.log('\nDone.');
