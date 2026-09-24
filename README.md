# dynamic-connectome-lab-web

A pitch demo for the **Dynamic Connectome Lab** (Marcus Kaiser, University of
Nottingham), built from their Google Site at
`sites.google.com/view/dynamicconnectomelab`. Three things live here, joined by
a demo bar:

| Route | What it is |
| --- | --- |
| `/` and the six sub-pages | The new site — Home, Team, Research, Publications, Resources, Join us, Contact |
| `/original/` | Their live site in a frame (a clean copy could not be made from the build environment) |
| `/offer/` | The offer — tale of the tape, terms, ownership |

## Where it lives

<https://dynamic-connectome-lab.basilicalabs.ai/> — a custom domain on the
Worker, added in the Cloudflare dashboard and recorded in `wrangler.jsonc`.
The `workers.dev` URL still serves the same site and must keep doing so:
links to it have already gone out. That is why `workers_dev` is set explicitly
rather than left to the default — Wrangler turns it off by itself as soon as a
route is present.

The canonical link and `og:url` on each page name the custom domain, so a
shared link unfurls under one hostname rather than whichever was used. The
pages still carry `noindex,nofollow` and `robots.txt` still shuts the search
crawlers out: this is a pitch demo and stays out of the indexes.

Every fact on the new site traces to `work/brief.json`; the page copy is the
lab's own, taken verbatim from the Google Site (typos fixed, PI's first-person
voice normalised to "the lab" in a few places). Unconfirmed facts — the email
and phone, which come from the university staff listing rather than the lab
site — carry a visible "To confirm" chip.

## Structure

```
public/                everything served — this is the site
  index.html           Home
  team/ research/ publications/ resources/ join-us/ contact/
  original/            framed live site (demo only)
  offer/               the offer (demo only)
  404.html
  assets/css/site.css  the stylesheet
  assets/js/publications.js
  assets/js/tractogram.js      home-page NiiVue tractogram (spin switch, drag)
  assets/js/niivue.umd.js      NiiVue 0.69.0, vendored from npm
  assets/js/research-figs.js   the four interactive research figures
  assets/tracts/hcp1065.trx    the streamlines — see "The tractogram" below
  fonts/               Fraunces 400/600/700 + Inter 400/500/600, self-hosted
  assets/img/og.jpg    the 1200×630 social card, drawn from the tractogram
  favicon.svg  robots.txt (search crawlers out, link previews in)  _headers
src/
  layout.js            shared shell: head, header, nav, footer
  pages-a.js           Home, Team, Research
  pages-b.js           Publications (parsed from content/), Resources, Join us, Contact, 404
  content/             publications.txt and the verbatim page text the build reads
  offer.html original.html demo-bar.html
scripts/
  build-site.js        src → public   (node scripts/build-site.js --demo)
  make-og.js           the social card, rendered from the live tractogram
  verify-layout.js     the layout gate, 320→1920 with the real fonts
  shots.js             full-page screenshots of every route at 1440 and 390
  build-preview.js     one self-contained HTML of the whole demo for phones
  measure-font.js      fetch fonts from npm @fontsource
  render_check.py      the cloudflare-static-site render check
work/                  brief.json and the captured page text (provenance)
wrangler.jsonc         assets-only Worker config
```

## Local development

```bash
npm install
npm run build        # regenerate public/ from src/ (with the demo bar)
npm run dev          # wrangler dev
npm run shots        # screenshots into .shots/
```

## Verification — before every push to main

```bash
npx wrangler deploy --dry-run
rm -rf .verify-stage && mkdir .verify-stage && cp -r public/. .verify-stage/ && rm -rf .verify-stage/original
npm run verify                                        # authored routes, leak check against sites.google.com
node scripts/verify-layout.js --dir "$PWD/public" --routes "/original/"   # the frame, on its own
npm run shots && open .shots/                         # then look at them
```

`verify-layout.js` needs an absolute `--dir`; a relative one 403s every route.
It also looks for Chromium on `PATH`. On a container that has only the
Playwright build (`shots.js` points straight at it), put it on `PATH` first:

```bash
mkdir -p .bin && ln -sf /opt/pw-browsers/chromium-*/chrome-linux/chrome .bin/chromium
export PATH="$PWD/.bin:$PATH"
```

## The tractogram

The home page's hero draws the HCP1065 population-average streamlines itself
with NiiVue, beside the headline and on the site's own blue, from `public/assets/tracts/hcp1065.trx` — the
real 6.2 MB file, the same one visualneuroscience.ai/tracts serves (the
0.6 MB `dpsv.trx` that stood in for it during the build is kept in
`work/tracts/` for reference). The strands draw themselves along their paths
first — every fibre growing from nothing to its full length together, over
about two and a half seconds — and the slow spin starts when they finish. The
switch stops and restarts the spin, and dragging turns it by hand. To refresh
the file from the source:

```bash
npm run tractogram      # curls it from visualneuroscience.ai/assets/tracts/
```

Nothing else changes: the viewer, spin switch and colours are file-agnostic.
The atlas is CC BY-SA 4.0 (Yeh FC, Nat Commun 2022) and the credit line under
the canvas stays.

Two things in `tractogram.js` are worth knowing before changing it. The zoom is
computed from the canvas, not fixed: NiiVue fits the model to the canvas's
shorter side, so a wide desktop canvas is bound by its height and a narrow
phone canvas by its width, and the constants there are the drawn brain's
extents measured at the widest point of a full turn. The growth animation
re-orders the fibre index buffer once, by how far along its own path each tube
segment sits, so that growing is nothing but a rising `indexCount` and no
geometry is ever rebuilt; if the buffer does not match what that code expects
it leaves it alone and skips the animation. `prefers-reduced-motion` skips it
too.

`/assets/*` is served immutable for a year, so a changed `tractogram.js` only
reaches a returning visitor if the `?v=` marker on the script tag in
`src/pages-a.js` is bumped with it.

`npm run shots` on a machine without a GPU may log `MISSED home phone`: software
GL cannot composite the tube mesh at phone widths in reasonable time. The pass
continues; check that view in a real browser.

## The social card

`public/assets/img/og.jpg` is what a shared link unfurls to — the site's own
tractogram rather than a stock picture. `npm run og` regenerates it: it serves
`public/`, lets the home page draw and grow the brain exactly as a visitor
sees it, crops the drawn brain out of the WebGL canvas and sets the wordmark
beside it in the real Fraunces and Inter, inside the page where they are
already loaded. It renders the page at two device pixels to one CSS pixel, so
the brain — drawn in one column of the hero rather than across the page — is
scaled down into the card rather than up. Re-run it after changing the viewer,
the palette or the wording on the card.

The pages point at it with a root-relative `og:image`. Every service that
matters resolves that against the page URL, but if this ever moves to the
lab's own domain it is worth making absolute.

Two things had to give for the card to appear at all. The offer page and the
new site carry `noindex,nofollow` and `robots.txt` still shuts every search
crawler out — but a link preview is fetched by a crawler too, so the seven
services that render one (Twitter, Facebook, Slack, LinkedIn, WhatsApp,
Discord, Telegram) are named in `robots.txt` and allowed. Previewing is not
indexing; nothing here reaches a search index either way.

## The research figures

`research-figs.js` rebuilds the four figures on the Google Site's research page
as interactive models with sliders: the VERTEX-style stimulation field and LFP
trace, the within/between-region ROC curves (defaults tuned to the published
AUCs), spatial growth of a network (Kaiser & Hilgetag 2004/2007), and a
hierarchical modular network with spreading activation (Kaiser & Hilgetag
2010). They are illustrative models of the mechanisms, not the lab's data, and
each panel says so in its intro.

## External resources

- Publication PDFs, datasets and the PI's CV link out to
  `www.dynamic-connectome.org` and publisher sites, exactly as on the Google Site.
- Fonts are self-hosted; nothing loads from Google Fonts.

## On transfer

Remove the demo bar (`node scripts/build-site.js` without `--demo`), delete
`public/original/` and `public/offer/`, switch `robots.txt` to allow, and drop
in the lab's own headshots and the NeuroFUS photo where the monograms stand
today.
