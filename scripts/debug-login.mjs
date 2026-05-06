import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addInitScript(() => {
  sessionStorage.setItem('fawz.splash.shown', '1');
  localStorage.setItem('fawz.ui', JSON.stringify({
    state: { language: 'en', sidebarCollapsed: false, dataSource: 'real' },
    version: 0,
  }));
});
const page = await ctx.newPage();
page.on('request', (r) => { if (r.url().includes('login') || r.url().includes('api')) console.log('REQ', r.method(), r.url()); });
page.on('response', (r) => { if (r.url().includes('login') || r.url().includes('api')) console.log('RES', r.status(), r.url()); });

await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
await page.fill('input[type=email]', 'normaluser.20260506@fawz.com');
await page.fill('input[type=password]', 'NormalUser@2026!');
await page.click('button[type=submit]');
await page.waitForTimeout(3000);
await browser.close();
