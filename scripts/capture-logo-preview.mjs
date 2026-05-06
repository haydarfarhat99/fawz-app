import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/logo-preview';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  sessionStorage.setItem('fawz.splash.shown', '1');
  localStorage.setItem('fawz.consent.sharia', 'true');
  localStorage.setItem('fawz.ui', JSON.stringify({
    state: { language: 'en', sidebarCollapsed: false, dataSource: 'mock' },
    version: 0,
  }));
});

const page = await ctx.newPage();
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, '01-login.png'), fullPage: true });
console.log('✓ login');

await ctx.addInitScript(() => {
  localStorage.setItem('fawz.auth.token', 'mock-1');
  localStorage.setItem('fawz.auth', JSON.stringify({
    state: {
      user: { id: 'mock', email: 'demo@fawz.io', fullName: 'Normal User', role: 'consumer', entryCount: 0, isNew: false },
      token: 'mock-1',
    },
    version: 0,
  }));
});

const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx2.addInitScript(() => {
  sessionStorage.setItem('fawz.splash.shown', '1');
  localStorage.setItem('fawz.consent.sharia', 'true');
  localStorage.setItem('fawz.auth.token', 'mock-1');
  localStorage.setItem('fawz.auth', JSON.stringify({
    state: {
      user: { id: 'mock', email: 'demo@fawz.io', fullName: 'Normal User', role: 'consumer', entryCount: 0, isNew: false },
      token: 'mock-1',
    },
    version: 0,
  }));
  localStorage.setItem('fawz.ui', JSON.stringify({
    state: { language: 'en', sidebarCollapsed: false, dataSource: 'mock' },
    version: 0,
  }));
});
const home = await ctx2.newPage();
await home.goto(BASE + '/home', { waitUntil: 'networkidle' });
await home.waitForTimeout(1000);
await home.screenshot({ path: path.join(OUT, '02-home.png'), fullPage: true });
console.log('✓ home');

const mobile = await browser.newContext({ viewport: { width: 390, height: 850 } });
await mobile.addInitScript(() => {
  sessionStorage.setItem('fawz.splash.shown', '1');
  localStorage.setItem('fawz.consent.sharia', 'true');
  localStorage.setItem('fawz.auth.token', 'mock-1');
  localStorage.setItem('fawz.auth', JSON.stringify({
    state: {
      user: { id: 'mock', email: 'demo@fawz.io', fullName: 'Normal User', role: 'consumer', entryCount: 0, isNew: false },
      token: 'mock-1',
    },
    version: 0,
  }));
  localStorage.setItem('fawz.ui', JSON.stringify({
    state: { language: 'en', sidebarCollapsed: false, dataSource: 'mock' },
    version: 0,
  }));
});
const mp = await mobile.newPage();
await mp.goto(BASE + '/home', { waitUntil: 'networkidle' });
await mp.waitForTimeout(800);
await mp.screenshot({ path: path.join(OUT, '03-home-mobile.png'), fullPage: true });
console.log('✓ home-mobile');

const mlogin = await browser.newContext({ viewport: { width: 390, height: 850 } });
await mlogin.addInitScript(() => {
  sessionStorage.setItem('fawz.splash.shown', '1');
});
const mlp = await mlogin.newPage();
await mlp.goto(BASE + '/login', { waitUntil: 'networkidle' });
await mlp.waitForTimeout(800);
await mlp.screenshot({ path: path.join(OUT, '04-login-mobile.png') });
console.log('✓ login-mobile');

await browser.close();
console.log('Done.');
