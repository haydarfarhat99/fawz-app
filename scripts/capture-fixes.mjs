import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';

const PASSES = [
  { tag: 'desktop-en', viewport: { width: 1280, height: 800 }, lang: 'en' },
  { tag: 'mobile-en',  viewport: { width: 375, height: 812 },  lang: 'en' },
  { tag: 'mobile-ar',  viewport: { width: 375, height: 812 },  lang: 'ar' },
];

const ROUTES = [
  ['home',                '/home',                            { wait: 800 }],
  ['live-draw-jackpot',   '/draws/live?scenario=jackpot',     { wait: 30000 }],
  ['live-draw-lose',      '/draws/live?scenario=lose',        { wait: 30000 }],
  ['draw-detail-after-lose','/draws/draw-143?_setup=lose',    { wait: 800, setupLose: true }],
  ['draw-detail-after-win', '/draws/draw-143?_setup=jackpot', { wait: 800, setupJackpot: true }],
];

const browser = await chromium.launch();

for (const pass of PASSES) {
  const OUT = `./screenshots/${pass.tag}`;
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, url, opts] of ROUTES) {
    const context = await browser.newContext({ viewport: pass.viewport });
    await context.addInitScript(({ lang, setupLose, setupJackpot }) => {
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
      if (setupLose) {
        sessionStorage.setItem('fawz.lastDraw.scenario', 'lose');
        sessionStorage.removeItem('fawz.lastDraw.win');
      } else if (setupJackpot) {
        sessionStorage.setItem('fawz.lastDraw.scenario', 'jackpot');
        sessionStorage.setItem('fawz.lastDraw.win', JSON.stringify({
          tier: 'last_10', prize: 50000000, fawzNumber: '9387541206',
        }));
      }
    }, { lang: pass.lang, setupLose: !!opts.setupLose, setupJackpot: !!opts.setupJackpot });
    const page = await context.newPage();
    await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 40_000 });
    await page.waitForTimeout(opts.wait);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
    console.log('✓', pass.tag, name);
    await context.close();
  }
}

await browser.close();
console.log('\nDone.');
