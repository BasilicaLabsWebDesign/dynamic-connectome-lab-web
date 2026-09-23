# CLAUDE.md

Standing policy for this repository. Read it before making any change here.

## What this repo is

A Cloudflare Workers static-assets site. Everything served lives in `public/`
and there is no build step on Cloudflare - the files in that directory are the
site. `public/` is generated from `src/` by `node scripts/build-site.js --demo`
and the output is committed; edit `src/` and rebuild rather than editing
`public/` by hand. The repo is connected to Cloudflare Workers Builds, so
**every push to `main` deploys to production**, at
<https://dynamic-connectome-lab.basilicalabs.ai/>. The `workers.dev` URL serves
the same site and has to keep working, which is why `workers_dev` is pinned
`true` in `wrangler.jsonc`: Wrangler defaults it to false once a route exists.

```
public/            everything served (generated, committed)
  index.html + team/ research/ publications/ resources/ join-us/ contact/
  original/ offer/ demo-only tabs (the offer states the terms, not the fees)
  404.html
  assets/css|js    stylesheet, publications search, tractogram viewer (NiiVue), research figures
  assets/tracts    hcp1065.trx — the real HCP1065 streamlines (6.2 MB), same file visualneuroscience.ai serves
  fonts/           self-hosted Fraunces + Inter
  _headers         security + caching headers
  robots.txt       search crawlers out; the link-preview services allowed in
  assets/img       og.jpg, the social card (npm run og, from the live tractogram)
src/               page sources, content, offer and frame pages
scripts/           build, verify, screenshots, offline preview
work/brief.json    every fact on the site, with its source and date
wrangler.jsonc     assets-only config, no Worker script
package.json       wrangler + playwright-core devDependencies
```

## Local development

```bash
npm install
npm run build        # src → public (with the demo bar)
npm run dev          # wrangler dev
```

## Verification - before every push to main

1. `npx wrangler deploy --dry-run`
2. `node scripts/verify-layout.js` on a staged copy of `public/` without
   `original/`, with `--original-host sites.google.com`; then `/original/`
   alone without it. Absolute `--dir` only.
3. `npm run shots`, then look at the screenshots: fonts loaded, layout intact,
   nothing collapsed to unstyled text. On a machine without a GPU the phone
   capture of `/` can stall (software GL and the tube mesh); the script logs it
   as `MISSED` and carries on — check that one in a real browser instead.

Never leave pushed work unverified or half-finished. Work in small, complete
batches: implement, verify, commit, push.

## Git and release workflow

- Before committing: `git config user.name "Fid" && git config user.email "fid_kk@proton.me"`
- Develop on the working branch and push there first. Release verified work by
  fast-forwarding `main` onto it and pushing `main`.
- Every push to `main` is a release. Versions are an ascending `vMAJOR.MINOR`
  sequence starting at `v1.0`; every push bumps the minor regardless of size. A
  major bump is reserved for a ground-up overhaul.
- With every push to `main`, provide release-tag text in the reply, in exactly
  this shape. The owner creates the GitHub release manually - **never push tags**:

  ```
  Tag: v<next>  —  Title: <five to nine words, plain and evocative>
  Description: <one to three sentences of editorial prose describing what changed
  from the owner's point of view — outcomes, not implementation. No bullet lists,
  no jargon, no file names.>
  ```

- Append the release line to the ledger below as part of the same push.
- Commit messages: descriptive imperative first line (what the change does, not
  "update X"), then a short prose body; dash bullets are fine there. One commit
  per coherent piece of work; several may share a push, but each push gets
  exactly one version entry.
- Never include model names, AI attribution trailers, session links, or other
  tooling identifiers in commit messages, titles, or code.

## The prompt archive

`prompt text/` holds the records for the version currently in service - nothing
else. Shipping version N replaces the folder's contents wholesale, in the same
push that releases the version: remove the previous version's folder(s) and add
`prompt text/N/` containing `input.txt` (the prompt, byte for byte),
`output.txt` (the reply that shipped it, byte for byte) and any input images or
files the owner provided. The files are owner-supplied records: never edit,
reformat, trim or regenerate them. N counts the prompts that have shipped and
is not the release tag: a push that ships no new prompt leaves the archive
exactly as it is.

The skill that describes this archive also asks for an `ai model.txt` naming
the model. This session's standing instructions forbid writing a model
identifier into anything pushed to a repository, so that one file is left for
the owner to add.

## The pages themselves

Content is the lab's own, taken from their Google Site and recorded with source
and date in `work/brief.json`. Nothing goes on a page that the brief cannot
prove; a missing fact becomes a question for the client, never a guess. The
two unconfirmed facts (email, phone) keep their "To confirm" chip until the lab
confirms them. Design tokens are the University of Nottingham palette; the
typography laws in `public/assets/css/site.css` (single-word headings never
split, nothing capped at a reading measure - body text runs the full width of
its column so a page lines up on the right, card grids use
`minmax(min(300px,100%),1fr)`) are enforced by the verify gate.

## Release ledger

| Version | Title | Description |
| --- | --- | --- |
| v1.0 | The lab's site, rebuilt across all seven pages | A new home for the Dynamic Connectome Lab: every page of the Google Site rebuilt in the University's colours, the publications list made searchable, an interactive brain-wiring model on the home page, with the current site and the offer alongside for comparison. |
| v1.1 | The brain on the page, and figures you can play with | The home page now draws the brain's wiring itself on the site's own blue — spin it, drag it, one switch — instead of framing another website. The four research figures have become interactive models with sliders: stimulate tissue, move a classifier threshold, grow a network, watch activity spread. |
| v1.2 | The whole brain, not a single bundle | The home page now carries the complete population-average wiring of the human brain in place of the stand-in bundle it launched with — every tract drawn on the site's blue, turning slowly from the moment the page opens. |
| v1.3 | The site gets a home that publishes it | The demo now lives in its own repository and publishes itself: every change pushed to the main branch goes straight to Cloudflare, so what the lab is shown is always the current version. Nothing on the pages themselves has changed. |
| v1.4 | The brain wires itself, and fits the phone | On a phone the whole brain is now in view instead of being cropped at the sides, whichever way it has turned to. And it no longer simply appears: every strand draws itself from nothing to its full length, all of them together, and the slow turn begins once the wiring is finished. |
| v1.5 | Prices off the page, and a card for links | The offer now sets out the deal — one flat fee, an optional fortnight of changes, nothing recurring — and leaves the figures to be given in person. Sharing a link shows a proper preview card too: the lab's own brain wiring, its name, and what it works on. |
| v1.6 | The brain keeps turning while you look at it | Moving the mouse across the brain used to stop it turning, so it seemed to give up a moment after the page settled. It now keeps going unless you take hold of it, and the switch beside it reads the same either way, set to on when the page opens. |
| v1.7 | The wiring grows evenly instead of in waves | The brain used to build itself in about twenty visible pulses, each one sweeping across it, because every strand in the file is the same length and they all lengthened in step. The strands are now offset from one another by a fraction of a segment, so the wiring fills in as one continuous flow. |
| v1.8 | The lab's name stays put when you point at it | Hovering the wordmark in the header made it vanish: it turned the same navy as the bar behind it. It now stays where it is, along with every other link on the dark parts of the site, and the buttons no longer change colour under the pointer. |
| v1.9 | Body text now reaches the same edge | Paragraphs used to stop well short of the right-hand edge that the headings, cards and figures all reach, which left a band of empty space down the side of several pages. The text now runs the full width of its column, so everything on a page lines up. |
| v1.10 | The offer talks about ownership, not money | The offer page no longer explains fees it does not show. It leads instead with what the lab ends up owning, and says the figures are gone through on a video call. It closes by making the no-obligation part plain: the site comes down on request, or the lab can simply keep it, hosted free for good at its own domain. |
| v1.11 | The demo gets an address of its own | The site now answers on a proper domain instead of only a generated one, and says so on every page, so a shared link always unfurls under the same name. The old address keeps working exactly as before — nothing that has already been sent out will break. |
| v1.12 | The tape reads in titles, not cells | The comparison at the top of the offer is no longer a wall of table text: each point is a card, the problem named in a few words above the fix that answers it, so the argument can be taken in at a glance. The money is worded the way the rest of the pitch is, and the page still shows no figures at all. |
