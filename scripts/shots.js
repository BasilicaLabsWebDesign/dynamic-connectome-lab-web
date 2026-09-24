#!/usr/bin/env node
/* shots.js — full-page screenshots of every route at desktop and phone widths,
 * served from public/, for eyeballing before the verify gate.
 *   node scripts/shots.js [--out .shots] [--routes "/,/team/"] */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { requireChromium } = require('./lib/chrome');
const { chromium } = require('playwright-core');

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const DIR = path.resolve('public');
const OUT = path.resolve(arg('--out', '.shots'));
const ROUTES = arg('--routes', '/,/team/,/research/,/publications/,/resources/,/join-us/,/contact/,/offer/,/original/,/404.html').split(',');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIR, p);
  if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: requireChromium(), args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [name, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    let ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    let page = await ctx.newPage();
    for (const r of ROUTES) {
      await page.goto(`http://127.0.0.1:${port}${r}`, { waitUntil: 'load', timeout: 20000 }).catch(e => console.error(r, e.message));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(r === '/' ? 6000 : r === '/research/' ? 2500 : 200);
      if (r === '/research/') { for (const f of await page.$$('.ifig')) { await f.scrollIntoViewIfNeeded(); await page.waitForTimeout(150); } await page.waitForTimeout(2500); }
      /* Stop the brain turning before the shutter, or the capture catches it
         mid-frame. The switch is therefore off in every home-page screenshot
         even though the page opens with it on — that is this click, not a
         regression. */
      if (r === '/') { const sp = await page.$('.tract-spin'); if (sp) await sp.click().catch(() => {}); await page.waitForTimeout(400); }
      const slug = r === '/' ? 'home' : r.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
      try {
        await page.screenshot({ path: path.join(OUT, `${slug}-${name}.png`), fullPage: true, timeout: 120000 });
        console.log('shot', slug, name);
      } catch (e) {
        /* A stalled capture (software GL choking on the tube mesh at phone
           widths, on machines without a GPU) must not abort the pass: log it,
           drop the wedged context and carry on with a fresh one. */
        console.error('MISSED', slug, name, '-', String(e.message).split('\n')[0]);
        await ctx.close().catch(() => {});
        ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
        page = await ctx.newPage();
      }
    }
    await ctx.close();
  }
  await browser.close();
  server.close();
})();
