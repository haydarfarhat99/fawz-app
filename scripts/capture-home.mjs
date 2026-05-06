import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';

const PASSES = [
  { tag: 'desktop-en', viewport: { width: 1280, height: 800 }, lang: 'en' },
  { tag: 'mobile-en',  viewport: { width: 375, height: 812 },  lang: 'en' },
  { tag: 'mobile-ar',  viewport: { width: 375, height: 812 },  lang: 'ar' },
];

const browser = await chromium.launch();

for (const pass of PASSES) {
  const OUT = `./screenshots/${pass.tag}`;
  fs.mkdirSync(OUT, { recursive: true });
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
  await page.goto(BASE + '/home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'home.png'), fullPage: false });
  // Take a full-page version too to see the demo card on mobile
  await page.screenshot({ path: path.join(OUT, 'home-full.png'), fullPage: true });
  console.log('✓', pass.tag);
  await context.close();
}

await browser.close();
console.log('\nDone.');
