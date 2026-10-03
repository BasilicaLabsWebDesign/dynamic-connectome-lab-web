#!/usr/bin/env node
/* make-og.js — the social sharing card: a photograph of the home page's own
 * hero, not a redrawing of it.
 *
 *   node scripts/make-og.js [--out public/assets/img/og.jpg]
 *
 * Serves public/, lets the hero draw and grow the brain exactly as a visitor
 * would see it, hides the two pieces of chrome that have no business in a link
 * preview — the demo bar and the sticky site header — and shoots the hero band
 * at the card's own size. Whatever the hero looks like is what the card shows,
 * so the two cannot drift apart.
 *
 * Re-run after changing the hero, the palette or the wording. The output is
 * committed; /assets/* is served immutable, so when the file is replaced rather
 * than added, bump the marker on it in src/layout.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { requireChromium } = require('./lib/chrome');
const { chromium } = require('playwright-core');

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'public');
const OUT = path.resolve(ROOT, arg('--out', 'public/assets/img/og.jpg'));

/* The card's size is the viewport's, at one device pixel to one CSS pixel, so
   the shot is the page at its own resolution with nothing rescaled. */
const CARD = { w: 1200, h: 630 };

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIR, p);
  if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'content-length': fs.statSync(file).size });
  fs.createReadStream(file).pipe(res);
});

/* Demo bar and sticky header out — neither belongs in a link preview — and the
   body padding the bar imposes with it. The hero is then pinned to the card's
   height with its content centred, so the band is framed the same whatever the
   lede and the credit line wrap to. */
const CAPTURE_CSS = h => `
  #pitch-bar, #pitch-bar + *, .site-header { display: none !important; }
  body { padding-top: 0 !important; }
  .hero { padding: 0 !important; height: ${h}px !important; display: grid; align-items: center; }
`;

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch({
    executablePath: requireChromium(),
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
  });
  const ctx = await browser.newContext({ viewport: { width: CARD.w, height: CARD.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load', timeout: 30000 });
  await page.addStyleTag({ content: CAPTURE_CSS(CARD.h) });
  await page.waitForFunction(() => document.getElementById('tractogram') &&
    document.getElementById('tractogram').classList.contains('is-ready'), { timeout: 300000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(6000);   // let the strands finish growing and the model turn to a lateral view

  /* Stop the spin so the frame is settled while the shot is taken, then take the
     switch out of the picture: it is a control, and a still of it reads as a
     brain that has been switched off. The click has to come before the hiding,
     or there is nothing left to click. */
  const spin = await page.$('.tract-spin');
  if (spin) await spin.click().catch(() => {});
  await page.addStyleTag({ content: '.tract-spin{display:none !important}' });
  await page.waitForTimeout(400);

  const box = await page.evaluate(() => {
    const r = document.querySelector('.hero').getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  if (box.h < CARD.h - 1) { console.error(`the hero came out ${box.h}px tall, short of the ${CARD.h}px card`); await browser.close(); server.close(); process.exit(1); }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await page.screenshot({ path: OUT, type: 'jpeg', quality: 92, clip: { x: 0, y: box.y, width: CARD.w, height: CARD.h } });
  console.log(`wrote ${path.relative(ROOT, OUT)} — ${CARD.w}×${CARD.h}, ` +
    `${(fs.statSync(OUT).size / 1024).toFixed(0)} KB, shot from the hero at ${box.w}×${box.h}`);
  await browser.close();
  server.close();
})();
