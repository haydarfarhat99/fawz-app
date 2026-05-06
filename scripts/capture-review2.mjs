import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/review2';
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ['login-en',          '/login',                     { auth: false, lang: 'en', wait: 600 }],
  ['login-ar',          '/login',                     { auth: false, lang: 'ar', wait: 600 }],
  ['home-en',           '/home',                      { auth: true,  lang: 'en', wait: 800 }],
  ['home-ar',           '/home',                      { auth: true,  lang: 'ar', wait: 800 }],
  ['entries-en',        '/entries',                   { auth: true,  lang: 'en', wait: 700 }],
  ['entries-ar',        '/entries',                   { auth: true,  lang: 'ar', wait: 700 }],
  ['prizes-en',         '/prizes',                    { auth: true,  lang: 'en', wait: 700 }],
  ['prizes-ar',         '/prizes',                    { auth: true,  lang: 'ar', wait: 700 }],
  ['notifications-en',  '/notifications',             { auth: true,  lang: 'en', wait: 700 }],
  ['notifications-ar',  '/notifications',             { auth: true,  lang: 'ar', wait: 700 }],
  ['challenges-en',     '/challenges',                { auth: true,  lang: 'en', wait: 700 }],
  ['challenges-ar',     '/challenges',                { auth: true,  lang: 'ar', wait: 700 }],
];

const browser = await chromium.launch();

for (const [name, url, opts] of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const lang = opts.lang;
  await context.addInitScript((lang) => {
    if (window.localStorage) {
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
    }
  }, lang);

  if (!opts.auth) {
    // override: clear auth so guest pages work
    await context.addInitScript(() => {
      localStorage.removeItem('fawz.auth.token');
      localStorage.removeItem('fawz.auth');
    });
  }

  const page = await context.newPage();
  await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(opts.wait);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log('✓', name);
  await context.close();
}

await browser.close();
console.log('Done.');
