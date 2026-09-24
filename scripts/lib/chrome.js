'use strict';
/* chrome.js — where the browser is, for every script here that drives one.
 *
 * The container these scripts usually run in ships Chromium under
 * PLAYWRIGHT_BROWSERS_PATH with a build number in the directory name, so a
 * hard-coded path goes stale the first time that browser is updated. Look for
 * an explicit CHROME_PATH first, then whatever build is actually installed,
 * then the usual system locations. */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SYSTEM = [
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome-stable',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];
const ON_PATH = ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable', 'chrome'];

/* chromium-1194/chrome-linux/chrome and the headless shell beside it. */
function fromBrowsersPath() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  let entries;
  try { entries = fs.readdirSync(root); } catch { return []; }
  const rank = name => (/^chromium-\d/.test(name) ? 0 : /^chromium(_|$)/.test(name) ? 1 : 2);
  return entries
    .filter(name => name.startsWith('chromium'))
    .sort((a, b) => rank(a) - rank(b) || b.localeCompare(a, 'en', { numeric: true }))
    .flatMap(name => [
      path.join(root, name, 'chrome-linux', 'chrome'),
      path.join(root, name, 'chrome-linux', 'headless_shell'),
      path.join(root, name, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
    ]);
}

function findChromium() {
  const candidates = [process.env.CHROME_PATH, ...fromBrowsersPath(), ...SYSTEM].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  for (const c of ON_PATH) {
    try {
      const found = execSync(`command -v ${c}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (found) return found;
    } catch { /* keep looking */ }
  }
  return null;
}

/* Every script here wants the same answer when there isn't one. */
function requireChromium() {
  const found = findChromium();
  if (found) return found;
  console.error('No Chromium found. Set CHROME_PATH, or PLAYWRIGHT_BROWSERS_PATH to a Playwright browsers directory.');
  process.exit(1);
}

module.exports = { findChromium, requireChromium };
