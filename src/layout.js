'use strict';
// Shared page shell for the Dynamic Connectome Lab site: head, header, footer.
// Every fact here traces to work/brief.json.

const NAV = [
  ['/', 'Home'],
  ['/team/', 'Team'],
  ['/research/', 'Research'],
  ['/publications/', 'Publications'],
  ['/resources/', 'Resources'],
  ['/join-us/', 'Join us'],
  ['/contact/', 'Contact'],
];

const SOCIALS = {
  x: 'https://x.com/connectomelab',
  bluesky: 'https://bsky.app/profile/connectomelab.bsky.social',
  linkedin: 'https://www.linkedin.com/in/marcus-kaiser-82214b2b/',
  youtube: 'https://www.youtube.com/channel/UCfM449LKUtYzbs6M9DccLTA',
  scholar: 'https://scholar.google.co.uk/citations?user=Ha_ZNlkAAAAJ&hl=en',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Original network-graph mark — nodes and edges, a nod to "connectome".
const MARK = `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
  <g stroke="#37B4B0" stroke-width="1.4" fill="none" opacity=".9">
    <path d="M8 26 L18 10 L31 14 L27 30 L8 26 Z M18 10 L27 30 M8 26 L31 14 M13 18 L22 21 L27 30 M22 21 L18 10"/>
  </g>
  <g fill="#DEB406"><circle cx="8" cy="26" r="3"/><circle cx="31" cy="14" r="3"/><circle cx="27" cy="30" r="3"/></g>
  <g fill="#fff"><circle cx="18" cy="10" r="3.2"/><circle cx="13" cy="18" r="2.2"/><circle cx="22" cy="21" r="4"/></g>
</svg>`;

const ICONS = {
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2.1l7.7-8.8L1.7 2h6.8l4.7 6.2L18.9 2zm-1.1 18h1.8L7.4 3.9H5.5L17.8 20z"/></svg>',
  bluesky: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 10.8c-1.1-2.1-4-6-6.8-8C2.6.9 1.6 1.3.9 1.6.2 1.9 0 3 0 3.6c0 .7.4 5.5.6 6.3.8 2.8 3.7 3.7 6.4 3.4-3.9.6-7.3 2-2.8 7 5 5.2 6.8-1.1 7.8-4.3 1 3.2 2.1 9.3 7.7 4.3 4.2-4.3 1.2-6.4-2.7-7 2.7.3 5.6-.6 6.4-3.4.2-.8.6-5.6.6-6.3 0-.6-.2-1.7-.9-2C22.4 1.3 21.4.9 18.8 2.8c-2.8 2-5.7 5.9-6.8 8z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.5V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
  scholar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 0 9l12 7 10-5.8V18h2V9L12 2zm0 16.4-6-3.5V17c0 2.2 2.7 4 6 4s6-1.8 6-4v-2.1l-6 3.5z"/></svg>',
};

function socialList(keys = ['x', 'bluesky', 'linkedin', 'youtube', 'scholar']) {
  const labels = { x: 'X', bluesky: 'Bluesky', linkedin: 'LinkedIn', youtube: 'YouTube', scholar: 'Google Scholar' };
  return `<ul class="socials">${keys.map(k => `<li><a href="${SOCIALS[k]}" rel="noopener">${ICONS[k]}<span>${labels[k]}</span></a></li>`).join('')}</ul>`;
}

function header(current) {
  return `<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/">${MARK}<span>Dynamic Connectome Lab<small>University of Nottingham</small></span></a>
    <input class="nav-toggle" type="checkbox" id="nav-toggle" aria-hidden="true">
    <label class="nav-btn" for="nav-toggle" aria-label="Menu">Menu</label>
    <nav class="site-nav" aria-label="Site">
      <ul>${NAV.map(([href, label]) => `<li><a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}</ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer on-dark">
  <div class="wrap">
    <div>
      <a class="brand" href="/">${MARK}<span>Dynamic Connectome Lab<small>University of Nottingham</small></span></a>
      <p>Simulating the dynamics and development of neural networks, and using focused ultrasound neuromodulation to change connectomes for better brain function.</p>
    </div>
    <div>
      <h4>Find us</h4>
      <address class="address">Precision Imaging<br>School of Medicine<br>University of Nottingham<br>QMC, Nottingham NG7 2UH</address>
      <p style="margin-top:10px"><a href="/contact/">Contact the lab →</a></p>
    </div>
    <div>
      <h4>Follow</h4>
      ${socialList()}
      <p style="margin-top:14px"><a href="https://www.nottingham.ac.uk/research/beacons-of-excellence/precision-imaging/index.aspx" rel="noopener">Precision Imaging Beacon</a> · <a href="http://www.neuroinformatics.org.uk/" rel="noopener">Neuroinformatics UK</a></p>
    </div>
    <div class="foot-note">
      <span>© Dynamic Connectome Lab, University of Nottingham</span>
      <span><a href="/team/">Team</a> · <a href="/publications/">Publications</a> · <a href="/join-us/">Join us</a></span>
    </div>
  </div>
</footer>`;
}

/* The Worker's custom domain. Only the metadata is absolute: a card unfurler
   and a crawler both read these off the page without a browser's idea of where
   the page came from, and workers.dev still serves the same site, so something
   has to say which of the two hostnames is the one to quote. Every link in the
   pages themselves stays relative. */
const BASE = 'https://dynamic-connectome-lab.basilicalabs.ai';

function page({ path, title, description, body, head = '', bodyClass = '' }) {
  const fullTitle = path === '/' ? 'Dynamic Connectome Lab — University of Nottingham' : `${title} — Dynamic Connectome Lab`;
  /* The 404 is served in place of whatever was asked for, so it has no URL of
     its own to claim. */
  const url = path === '/404.html' ? '' : BASE + path;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#10263B">
${url ? `  <link rel="canonical" href="${url}">\n  <meta property="og:url" content="${url}">\n` : ''}\
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Dynamic Connectome Lab">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${BASE}/assets/img/og.jpg?v=1.13">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="The population-average wiring of the human brain, drawn in fibre-direction colour, beside the lab's name.">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/fonts/fonts.css">
  <link rel="stylesheet" href="/assets/css/site.css?v=1.13">
${head}</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<!-- DEMO-BAR -->
<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

module.exports = { page, esc, socialList, MARK, ICONS, SOCIALS, NAV };
