import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';

const PASSES = [
  { tag: 'desktop-en', viewport: { width: 1280, height: 900 }, lang: 'en' },
  { tag: 'mobile-ar',  viewport: { width: 375, height: 1100 }, lang: 'ar' },
];

const ROUTES = [
  ['home',                       '/home',                                          { wait: 800 }],
  ['live-draw-weekly-spin',      '/draws/live?type=weekly&scenario=jackpot',       { wait: 5000 }],
  ['live-draw-weekly-jackpot',   '/draws/live?type=weekly&scenario=jackpot',       { wait: 16000 }],
  ['live-draw-weekly-lose',      '/draws/live?type=weekly&scenario=lose',          { wait: 16000 }],
  ['live-draw-monthly-spin',     '/draws/live?type=monthly&scenario=jackpot',      { wait: 6000 }],
  ['live-draw-monthly-jackpot',  '/draws/live?type=monthly&scenario=jackpot',      { wait: 33000 }],
  ['live-draw-monthly-lose',     '/draws/live?type=monthly&scenario=lose',         { wait: 33000 }],
];

const browser = await chromium.launch();

for (const pass of PASSES) {
  const OUT = `./screenshots/${pass.tag}`;
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, url, opts] of ROUTES) {
    const context = await browser.newContext({ viewport: pass.viewport });
    await context.addInitScript((lang) => {
      localStorage.setItem('fawz.consent.sharia', 'true');
      localStorage.setItem('fawz.auth.token', 'demo-token-smoke');
      localStorage.setItem('fawz.auth', JSON.stringify({
        state: {
          user: { id: 'demo-user', email: 'test@fawz.io', fullName: 'Smoke Tester', role: 'consumer', entryCount: 12, isNew: false },
          token: 'demo-token-smoke',
        },
        version: 0,
      }));
      localStorage.setItem('fawz.ui', JSON.stringify({ state: { language: lang, sidebarCollapsed: false }, version: 0 }));
      sessionStorage.setItem('fawz.splash.shown', '1');
    }, pass.lang);
    const page = await context.newPage();
    await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.waitForTimeout(opts.wait);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
    console.log('✓', pass.tag, name);
    await context.close();
  }
}

await browser.close();
console.log('\nDone.');
