# PRD: Coleman Calmus photography (v2 rebuild)

**Purpose (v1):** portfolio only.
**Audience:** see PRODUCT.md.
**Stack:** plain HTML/CSS/JS, static, Vercel. No database, no framework.

## Pages (v1)
1. **Home / gallery:** name, one-line intro, masonry gallery of all photos.
2. **Lightbox:** open any photo large; next/previous; keyboard, swipe, Esc.
3. **About / contact:** a small footer section on the same page. *Open: wording and contact method.*

Extra pages (series/albums, bookings, shop) are out of scope for v1.

## Why a rebuild
v1 hand-typed the photo list in JS, had no alt text, loaded full-size JPEGs for thumbnails, built the gallery twice, and used fragile custom touch code. See the HANDOFF.md LOG.

## Requirements
- One list of photos (`content/photos.json`) with alt text and optional caption. Adding a photo = drop the file in `originals/`, add one entry, run the build script.
- Generated WebP at several widths with `srcset`; width/height set so nothing jumps; lazy loading below the fold.
- Lightbox using native `<dialog>`: accessible and keyboard friendly.
- Works at 390px and desktop; no horizontal scroll.
- EXIF/GPS metadata stripped from web images.
- Copyright line in the footer.

## Done for v1 =
- Live on a Vercel preview, then on the real domain, with HTTPS.
- All 25 photos have alt text.
- Verified on a real phone.
- Page weight within budget; no console errors.

## Open decisions
- Domain: keep colemancalmus.com (the old repo's CNAME)?
- About/contact wording and method.
- Whether to crop off the white frames baked into some photos.
- Photo order.
