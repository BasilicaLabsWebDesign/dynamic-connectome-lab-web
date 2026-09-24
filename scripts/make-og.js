#!/usr/bin/env node
/* make-og.js — the social sharing card, drawn from the site's own tractogram
 * rather than a stock picture.
 *
 *   node scripts/make-og.js [--out public/assets/img/og.jpg]
 *
 * Serves public/, lets the home page draw and grow the brain exactly as a
 * visitor would see it, then crops the drawn brain out of the WebGL canvas and
 * composes the 1200×630 card inside the page — where the real Fraunces and
 * Inter are already loaded, so the wordmark is set in the site's own type.
 *
 * Re-run after changing the viewer, the palette or the wording. The output is
 * committed; /assets/* is served immutable, so if the file is ever replaced
 * rather than added, bump the marker on it in src/layout.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright-core');

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'public');
const OUT = path.resolve(ROOT, arg('--out', 'public/assets/img/og.jpg'));
const { findChromium } = require('./lib/chrome');
const CHROME = findChromium();

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIR, p);
  if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'content-length': fs.statSync(file).size });
  fs.createReadStream(file).pipe(res);
});

/* Runs before any page script: keeps hold of the WebGL context so the brain can
   be read back, since the drawing buffer is not preserved between frames. */
const GRAB_CONTEXT = `
  window.__gl = null; window.__canvas = null;
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, opts) {
    const ctx = orig.call(this, type, opts);
    if (type && String(type).indexOf('webgl') === 0) { window.__gl = ctx; window.__canvas = this; }
    return ctx;
  };
`;

const CARD = {
  w: 1200, h: 630,
  navy: '#10263B', gold: '#DEB406', white: '#FFFFFF',
  eyebrow: 'PRECISION IMAGING · UNIVERSITY OF NOTTINGHAM',
  title: ['Dynamic', 'Connectome Lab'],
  blurb: 'Simulating the dynamics and development of neural networks — and using focused ultrasound to change them.',
  credit: 'HCP1065 population-average tractography'
};

/* Composed in the page: crop the brain out of the WebGL canvas, then set the
   words beside it in the site's own faces. */
function compose(card) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const gl = window.__gl, src = window.__canvas;
      const px = new Uint8Array(src.width * src.height * 4);
      gl.readPixels(0, 0, src.width, src.height, gl.RGBA, gl.UNSIGNED_BYTE, px);

      // The drawn brain, found by what is not the background.
      const bg = [16, 38, 59];
      let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
      for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
        const i = (y * src.width + x) * 4;
        if (Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) > 24) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
      if (maxX < 0) return resolve({ error: 'nothing drawn on the canvas' });
      const bw = maxX - minX + 1, bh = maxY - minY + 1;

      // readPixels is bottom-up; put the crop the right way up on a scratch canvas.
      const crop = document.createElement('canvas');
      crop.width = bw; crop.height = bh;
      const cim = crop.getContext('2d').createImageData(bw, bh);
      for (let y = 0; y < bh; y++) {
        const from = ((src.height - 1 - (minY + y)) * src.width + minX) * 4;
        cim.data.set(px.subarray(from, from + bw * 4), y * bw * 4);
      }
      crop.getContext('2d').putImageData(cim, 0, 0);

      const c = document.createElement('canvas');
      c.width = card.w; c.height = card.h;
      const g = c.getContext('2d');
      g.fillStyle = card.navy;
      g.fillRect(0, 0, card.w, card.h);

      // The brain, right of centre, as large as its box allows.
      const box = { x: 596, y: 30, w: 574, h: 570 };
      const k = Math.min(box.w / bw, box.h / bh);
      g.imageSmoothingQuality = 'high';
      g.drawImage(crop, box.x + (box.w - bw * k) / 2, box.y + (box.h - bh * k) / 2, bw * k, bh * k);

      // The words.
      const left = 80;
      g.textBaseline = 'alphabetic';
      g.fillStyle = card.gold;
      g.font = '600 14px Inter, sans-serif';
      let ex = left;
      for (const ch of card.eyebrow) { g.fillText(ch, ex, 208); ex += g.measureText(ch).width + 1.6; }

      g.fillStyle = card.white;
      g.font = '700 58px Fraunces, Georgia, serif';
      card.title.forEach((line, i) => g.fillText(line, left, 278 + i * 66));

      g.fillStyle = 'rgba(255,255,255,0.72)';
      g.font = '400 21px Inter, sans-serif';
      const words = card.blurb.split(' ');
      let line = '', y = 400;
      for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (g.measureText(test).width > 452 && line) { g.fillText(line, left, y); y += 31; line = w; }
        else line = test;
      }
      if (line) g.fillText(line, left, y);

      const rule = Math.max(458, y + 26);
      g.strokeStyle = card.gold; g.lineWidth = 3;
      g.beginPath(); g.moveTo(left, rule); g.lineTo(left + 56, rule); g.stroke();

      g.fillStyle = 'rgba(255,255,255,0.42)';
      g.font = '400 14px Inter, sans-serif';
      g.fillText(card.credit, left, rule + 34);

      resolve({ data: c.toDataURL('image/jpeg', 0.92), source: bw + '×' + bh });
    });
  });
}

(async () => {
  if (!CHROME) { console.error('No Chromium found.'); process.exit(1); }
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
  });
  /* The brain is drawn in one column of the hero now, so at one device pixel
     per CSS pixel the crop comes out smaller than the box it goes into on the
     card. Rendering at two doubles the canvas behind it, so the card is made
     by scaling the brain down rather than up. */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(GRAB_CONTEXT);
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => document.getElementById('tractogram') &&
    document.getElementById('tractogram').classList.contains('is-ready'), { timeout: 300000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(4000);   // let the strands finish growing

  const out = await page.evaluate(compose, CARD);
  if (out.error) { console.error(out.error); await browser.close(); server.close(); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(out.data.split(',')[1], 'base64'));
  console.log(`wrote ${path.relative(ROOT, OUT)} — ${CARD.w}×${CARD.h}, ` +
    `${(fs.statSync(OUT).size / 1024).toFixed(0)} KB, brain cropped from ${out.source}`);
  await browser.close();
  server.close();
})();
