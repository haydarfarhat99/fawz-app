import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/signup';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function snap(tag, viewport) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('fawz.splash.shown', '1');
    localStorage.setItem('fawz.ui', JSON.stringify({
      state: { language: 'en', sidebarCollapsed: false, dataSource: 'mock' },
      version: 0,
    }));
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/signup', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: true });
  console.log('✓', tag);
  await ctx.close();
}

await snap('desktop', { width: 1280, height: 1100 });
await snap('mobile', { width: 390, height: 1100 });

await browser.close();
console.log('Done.');
