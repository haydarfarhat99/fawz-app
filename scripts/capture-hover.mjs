import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = './screenshots/desktop-en';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await context.addInitScript(() => {
  localStorage.setItem('fawz.consent.sharia', 'true');
  localStorage.setItem('fawz.auth.token', 'demo-token-smoke');
  localStorage.setItem('fawz.auth', JSON.stringify({
    state: {
      user: { id: 'demo-user', email: 'test@fawz.io', fullName: 'Smoke Tester', role: 'consumer', entryCount: 12, isNew: false },
      token: 'demo-token-smoke',
    },
    version: 0,
  }));
  localStorage.setItem('fawz.ui', JSON.stringify({ state: { language: 'en', sidebarCollapsed: false }, version: 0 }));
  sessionStorage.setItem('fawz.splash.shown', '1');
});
const page = await context.newPage();
page.on('console', m => console.log('[console]', m.type(), m.text()));
await page.goto(BASE + '/referral', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const found = await page.evaluate(() => {
  // The Golden Ticket card has bg-gradient-to-br + from-gold-200
  const cards = Array.from(document.querySelectorAll('div'));
  const card = cards.find(c => c.className.includes('from-gold-200') && c.className.includes('overflow-hidden'));
  if (!card) return { found: false };
  const sweep = card.querySelector('span[class*="pointer-events-none"]');
  if (!sweep) return { found: 'card-only', cardClass: card.className.slice(0, 100) };
  const span = sweep;
  span.style.animation = 'glow-sweep 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
  return { found: true, sweepClass: span.className.slice(0, 100) };
});
console.log('Result:', JSON.stringify(found));

await page.waitForTimeout(450);
await page.screenshot({ path: path.join(OUT, 'referral-hover-glow-mid.png') });
console.log('✓ mid-sweep captured');

await browser.close();
