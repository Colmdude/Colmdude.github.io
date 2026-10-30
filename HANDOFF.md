# HANDOFF.md: the one place status lives

## STATE
- Updated: 2026-10-30 · branch: `drop-in-photos` (git initialised, author = GitHub no-reply email, NOTHING COMMITTED YET)
- v2 rebuild of the photography site is built and tested locally (390px + 1440px, lightbox works, no horizontal scroll, no console errors apart from Google Fonts being blocked in the test sandbox).
- Old site (Colmdude/Colmdude.github.io, deployed on Vercel at colemancalmus-github-io.vercel.app) is untouched and still live.
- 25 photos, 74 WebP thumbnails (4.7 MB) in `site/img/`, plus 25 untouched originals (11.8 MB) in `site/full/` for the lightbox.

## NEXT STEP
1. Review the uncommitted changes on `drop-in-photos`, then commit (stage files by name). Decide about GPS in `site/full/` (see BACKLOG).
2. Decide the repo: push to a NEW private repo, or open a PR against Colmdude/Colmdude.github.io replacing its contents (user merges).
3. Vercel: Root = repo root; vercel.json already sets output directory to `site`. Check the preview URL on a real phone.
4. Domain: confirm whether colemancalmus.com stays; old repo has a GitHub Pages `CNAME` file, which the new site does not carry. DNS changes only with the user's say-so.

## DONE
- Investigated the old repo (read-only).
- Rules: CLAUDE.md, PRODUCT.md, docs/PRD.md, this file.
- Image pipeline: `scripts/build_images.py` (originals → WebP 480/960/1600, EXIF stripped, gallery written into `site/index.html`).
- Site: responsive masonry gallery (2 cols phone, 3 desktop), native `<dialog>` lightbox with arrows/keys/swipe, alt text on all 25 photos, lazy loading, width/height set.
- `vercel.json`: output dir, cache headers for images, basic security headers.

## BACKLOG
- **Privacy decision:** `site/full/` files are byte-for-byte originals, so any EXIF/GPS in them becomes public once deployed. The 25 current files have no GPS tags, but future drops might. Option: strip GPS from the full copies only.
- Lightbox no longer pre-loads neighbouring photos (full files are large); revisit if next/prev feels slow.
- Captions for photos (optional field in `content/photos.json`).
- About / contact section and wording; contact method.
- Decide on the white frames baked into some photos (crop or keep).
- Photo order / curation; maybe fewer, stronger photos.
- Self-host Barlow font (removes Google Fonts request).
- Open Graph image + absolute URLs once the domain is final.
- Optional: bring back the v1 mobile carousel feel as a scroll-snap row.
- Back up `originals/` somewhere outside this folder (cloud drive / external disk).

## LOG
- 2026-10-30: `git init` on branch `drop-in-photos`. build_images.py now picks up everything in `originals/` (photos.json optional: alt, caption, slug, order); lightbox serves untouched originals from `site/full/`; thumbnails still EXIF-stripped; `/full/` cache header in vercel.json. Screenshots: `_review/drop-in-390.png`, `_review/drop-in-desktop.png`. Not committed, not pushed.
- 2026-10-21: Investigated old repo; rebuilt as plain static site; tested locally. Not yet committed or deployed.

## REFERENCE
- Add a photo: drop the file in `originals/`, run `python3 scripts/build_images.py` (needs `pip install Pillow`). Optional: add an entry to `content/photos.json` (src, plus alt, caption, slug) for real alt text/captions/order; otherwise alt is the cleaned-up filename. Supported: jpg, jpeg, png, webp, tif(f).
- Preview locally: `cd site && python3 -m http.server 8000`, open http://localhost:8000
- Old repo photos were the only originals available (1300–2700px); true full-size files, if they exist elsewhere, should go in `originals/`.
