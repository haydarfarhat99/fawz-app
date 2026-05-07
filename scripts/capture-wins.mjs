import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/wins-consistency';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function snap(tag, route, viewport = { width: 1280, height: 1100 }) {
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
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: true });
  console.log('✓', tag);
  await ctx.close();
}

await snap('results',         '/draws/results');
await snap('entries',         '/entries');
await snap('detail-142',      '/draws/draw-142');
await snap('detail-141',      '/draws/draw-141');
await snap('detail-140',      '/draws/draw-140');

await browser.close();
console.log('Done.');
