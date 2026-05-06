import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/auth-focus';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function snap(tag, viewport, route, focused) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('fawz.splash.shown', '1');
    localStorage.setItem('fawz.ui', JSON.stringify({
      state: { language: 'en', sidebarCollapsed: false, dataSource: 'mock' },
      version: 0,
    }));
  });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  if (focused) await page.focus('input[type=email]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: true });
  console.log('✓', tag);
  await ctx.close();
}

await snap('login-mobile',         { width: 390, height: 1100 }, '/login', false);
await snap('login-mobile-focused', { width: 390, height: 1100 }, '/login', true);
await snap('signup-mobile',        { width: 390, height: 1400 }, '/signup', false);
await snap('signup-mobile-focused',{ width: 390, height: 1400 }, '/signup', true);

await browser.close();
console.log('Done.');
