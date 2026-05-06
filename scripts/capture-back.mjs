import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/back-buttons';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function snap(tag, route) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 850 } });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('fawz.splash.shown', '1');
    localStorage.setItem('fawz.consent.sharia', 'true');
    localStorage.setItem('fawz.auth.token', 'mock-1');
    localStorage.setItem('fawz.auth', JSON.stringify({
      state: {
        user: { id: 'mock', email: 'test@fawz.io', fullName: 'Normal User', role: 'consumer', entryCount: 0, isNew: false },
        token: 'mock-1',
      },
      version: 0,
    }));
    localStorage.setItem('fawz.ui', JSON.stringify({
      state: { language: 'en', sidebarCollapsed: false, dataSource: 'mock' },
      version: 0,
    }));
  });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: false });
  console.log('✓', tag);
  await ctx.close();
}

await snap('notifications', '/notifications');
await snap('referral',      '/referral');
await snap('prizes',        '/prizes');
await snap('profile',       '/profile');
await snap('home-no-back',  '/home');

await browser.close();
console.log('Done.');
