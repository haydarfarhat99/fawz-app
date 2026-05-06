import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/real-data';
fs.mkdirSync(OUT, { recursive: true });

const EMAIL = 'normaluser.20260506@fawz.com';
const PASSWORD = 'NormalUser@2026!';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  sessionStorage.setItem('fawz.splash.shown', '1');
  localStorage.setItem('fawz.consent.sharia', 'true');
  localStorage.setItem('fawz.ui', JSON.stringify({
    state: { language: 'en', sidebarCollapsed: false, dataSource: 'real' },
    version: 0,
  }));
});

const page = await ctx.newPage();
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') console.log('[browser]', m.type(), m.text());
});

console.log('→ login page');
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, '01-login-real.png') });

console.log('→ submitting credentials');
await page.fill('input[type=email]', EMAIL);
await page.fill('input[type=password]', PASSWORD);
await Promise.all([
  page.waitForResponse((r) => r.url().includes('/login_user') && r.status() === 200, { timeout: 30_000 }),
  page.click('button[type=submit]'),
]);
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(OUT, '02-home-real.png') });

const routes = [
  ['03-entries', '/entries'],
  ['04-prizes', '/prizes'],
  ['05-notifications', '/notifications'],
  ['06-challenges', '/challenges'],
  ['07-referral', '/referral'],
  ['08-draws-results', '/draws/results'],
  ['09-profile', '/profile'],
];
for (const [name, url] of routes) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log('✓', name);
}

console.log('→ toggling to mock mode');
await page.goto(BASE + '/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const toggleBtn = page.locator('button').filter({ hasText: /Live API|Mock data/i }).first();
if (await toggleBtn.count()) {
  await toggleBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '10-home-mock.png') });
  console.log('✓ 10-home-mock');
}

await browser.close();
console.log('Done.');
