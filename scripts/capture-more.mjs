import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/more-page';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function snap(tag, viewport) {
  const ctx = await browser.newContext({ viewport });
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
  await page.goto(BASE + '/more', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: true });
  console.log('✓', tag);
  await ctx.close();
}

await snap('mobile', { width: 390, height: 850 });
await browser.close();
console.log('Done.');
