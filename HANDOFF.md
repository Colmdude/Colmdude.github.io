# HANDOFF.md: the one place status lives

## STATE
- Updated: 2026-10-30 · branch: `strip-gps`; PRs #1 and #2 are merged into main
- v2 rebuild of the photography site is built and tested locally (390px + 1440px, lightbox works, no horizontal scroll, no console errors apart from Google Fonts being blocked in the test sandbox).
- Site is live on Vercel from `main` of Colmdude/Colmdude.github.io (output dir `site`).
- Domain colemancalmus.com is registered at Namecheap with auto-renew; DNS points to Vercel (A record plus www CNAME). DNS/domain changes only with the user's say-so.
- The user backs up `originals/` themselves.
- 25 photos, 74 WebP thumbnails (4.7 MB) in `site/img/`, plus 25 untouched originals (11.8 MB) in `site/full/` for the lightbox.

## NEXT STEP
1. Merge the strip-gps PR (user merges), then try `./publish.sh` with a real new photo.

## DONE
- Investigated the old repo (read-only).
- Rules: CLAUDE.md, PRODUCT.md, docs/PRD.md, this file.
- Image pipeline: `scripts/build_images.py` (originals → WebP 480/960/1600, EXIF stripped, gallery written into `site/index.html`).
- Site: responsive masonry gallery (2 cols phone, 3 desktop), native `<dialog>` lightbox with arrows/keys/swipe, alt text on all 25 photos, lazy loading, width/height set.
- `vercel.json`: output dir, cache headers for images, basic security headers.

## BACKLOG
- Lightbox no longer pre-loads neighbouring photos (full files are large); revisit if next/prev feels slow.
- Captions for photos (optional field in `content/photos.json`).
- About / contact section and wording; contact method.
- Decide on the white frames baked into some photos (crop or keep).
- Photo order / curation; maybe fewer, stronger photos.
- Self-host Barlow font (removes Google Fonts request).
- Open Graph image + absolute URLs once the domain is final.
- Optional: bring back the v1 mobile carousel feel as a scroll-snap row.

## LOG
- 2026-10-30: `strip-gps` branch: build_images.py now removes only GPS tags (EXIF + XMP) from the copies in `site/full/` with exiftool (no re-encode, other EXIF kept, `originals/` untouched). The build stops if exiftool is missing or any GPS tag remains in `site/full/`.
- 2026-10-30: PR #1 merged. New branch `backend-cleanup` off main: removed the leftover GitHub Pages `CNAME` (Vercel handles the domain); added `./publish.sh`. GPS stripping skipped: exiftool not installed.
- 2026-10-30: `git init` on branch `drop-in-photos`. build_images.py now picks up everything in `originals/` (photos.json optional: alt, caption, slug, order); lightbox serves untouched originals from `site/full/`; thumbnails still EXIF-stripped; `/full/` cache header in vercel.json. Screenshots: `_review/drop-in-390.png`, `_review/drop-in-desktop.png`. Not committed, not pushed.
- 2026-10-21: Investigated old repo; rebuilt as plain static site; tested locally. Not yet committed or deployed.

## REFERENCE
- Add a photo: drop the file in `originals/`, run `python3 scripts/build_images.py` (needs `pip install Pillow` and `brew install exiftool`). Optional: add an entry to `content/photos.json` (src, plus alt, caption, slug) for real alt text/captions/order; otherwise alt is the cleaned-up filename. Supported: jpg, jpeg, png, webp, tif(f).
- Preview locally: `cd site && python3 -m http.server 8000`, open http://localhost:8000
- Old repo photos were the only originals available (1300–2700px); true full-size files, if they exist elsewhere, should go in `originals/`.
- Publish: drop photos in `originals/`, run `./publish.sh`. It builds, lists the changed files, asks y/N, then creates branch `photos-YYYY-MM-DD` off `origin/main`, commits those files by name, pushes, and opens a PR. It never pushes to main and never merges; you merge the PR on GitHub and Vercel deploys main. Needs `gh` logged in.
