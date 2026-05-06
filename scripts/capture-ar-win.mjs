import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('./screenshots/responsive-w375', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 900 } });
await ctx.addInitScript(() => {
  localStorage.setItem('fawz.consent.sharia', 'true');
  localStorage.setItem('fawz.auth.token', 'demo-token-smoke');
  localStorage.setItem('fawz.auth', JSON.stringify({
    state: { user: { id: 'demo-user', email: 'test@fawz.io', fullName: 'Smoke Tester', role: 'consumer', entryCount: 12, isNew: false }, token: 'demo-token-smoke' },
    version: 0,
  }));
  localStorage.setItem('fawz.ui', JSON.stringify({ state: { language: 'ar', sidebarCollapsed: false }, version: 0 }));
  sessionStorage.setItem('fawz.splash.shown', '1');
});
const page = await ctx.newPage();
await page.goto('http://localhost:5173/draws/live?type=monthly&scenario=jackpot', { waitUntil: 'networkidle' });
await page.waitForTimeout(31000);
await page.screenshot({ path: './screenshots/responsive-w375/live-win-ar-monthly-jackpot.png' });
console.log('done');
await browser.close();
