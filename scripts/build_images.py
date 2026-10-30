#!/usr/bin/env python3
"""Build the site's images from originals/.

Usage (from the project root):  python3 scripts/build_images.py
Needs:  pip install Pillow

Every image in originals/ appears on the site. content/photos.json is optional:
it only adds alt text, a caption, a slug or the order for photos you list in it.
Photos not listed go after the listed ones, sorted by filename, with the
filename cleaned up as alt text.

Reads   originals/<file>              (never modified)
Reads   content/photos.json           (optional: src, slug, alt, caption)
Writes  site/img/<slug>-<width>.webp  (grid thumbnails, EXIF/GPS stripped)
Writes  site/full/<slug>.<ext>        (byte-for-byte copy of the original, for the lightbox;
                                       metadata is NOT stripped from these)
Writes  the gallery markup into site/index.html between the GALLERY markers
"""
import html
import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ORIGINALS = ROOT / "originals"
OUT = ROOT / "site" / "img"
FULL = ROOT / "site" / "full"
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
WIDTHS = [480, 960, 1600]
QUALITY = 80


def tile(i, m):
    sizes = m["sizes"]
    srcset = ", ".join(f"img/{m['slug']}-{w}.webp {w}w" for w in sizes)
    mid = min(sizes, key=lambda w: abs(w - 960))
    full = f"full/{m['slug']}{m['ext']}"
    eager = i < 4  # first few load immediately, the rest lazily
    prio = 'fetchpriority="high" ' if i == 0 else ""
    loading = "eager" if eager else "lazy"
    alt = html.escape(m["alt"], quote=True)
    cap = html.escape(m.get("caption", ""), quote=True)
    return (
        f'      <button class="tile" type="button" data-full="{full}" data-caption="{cap}" aria-label="Open photo: {alt}">\n'
        f'        <img src="img/{m["slug"]}-{mid}.webp" srcset="{srcset}" '
        f'sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 380px" '
        f'width="{m["width"]}" height="{m["height"]}" alt="{alt}" '
        f'{prio}loading="{loading}" decoding="async">\n'
        f'      </button>'
    )


def write_gallery(manifest):
    page = ROOT / "site" / "index.html"
    text = page.read_text()
    body = "\n".join(tile(i, m) for i, m in enumerate(manifest))
    new, n = re.subn(
        r"(<!-- GALLERY:START -->\n).*?(<!-- GALLERY:END -->)",
        lambda m: m.group(1) + body + "\n" + m.group(2),
        text,
        flags=re.S,
    )
    if n != 1:
        sys.exit("GALLERY markers not found in site/index.html")
    page.write_text(new)


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "photo"


def default_alt(stem):
    """Readable fallback: 'IMG_4436' -> 'IMG 4436', 'river-dusk' -> 'river dusk'."""
    return re.sub(r"[\s_\-]+", " ", stem).strip() or "Photograph"


def collect():
    """Return [{src, slug, alt, caption?}] for every image in originals/."""
    entries = json.loads((ROOT / "content" / "photos.json").read_text())
    on_disk = {p.name: p for p in ORIGINALS.iterdir()
               if p.is_file() and p.suffix.lower() in EXTENSIONS}
    for p in sorted(ORIGINALS.iterdir()):
        if p.is_file() and not p.name.startswith(".") and p.suffix.lower() not in EXTENSIONS:
            print(f"skipping {p.name}: unsupported file type")

    ordered, seen = [], set()
    for e in entries:
        if e["src"] not in on_disk:
            print(f"warning: {e['src']} is in content/photos.json but not in originals/, skipped")
            continue
        ordered.append(dict(e))
        seen.add(e["src"])
    for name in sorted(on_disk, key=str.lower):
        if name not in seen:
            ordered.append({"src": name})

    used = set()
    for e in ordered:
        stem = Path(e["src"]).stem
        base = e.get("slug") or slugify(stem)
        slug, n = base, 2
        while slug in used:  # two files with the same name stem, or a clashing slug
            slug, n = f"{base}-{n}", n + 1
        used.add(slug)
        e["slug"] = slug
        if not e.get("alt", "").strip():
            e["alt"] = default_alt(stem)
    return ordered


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    FULL.mkdir(parents=True, exist_ok=True)
    manifest, wanted, wanted_full = [], set(), set()

    for e in collect():
        src = ORIGINALS / e["src"]
        ext = src.suffix.lower()
        full_name = f"{e['slug']}{ext}"
        wanted_full.add(full_name)
        full_path = FULL / full_name
        if (not full_path.exists() or full_path.stat().st_size != src.stat().st_size
                or full_path.stat().st_mtime < src.stat().st_mtime):
            shutil.copy2(src, full_path)  # untouched bytes, metadata included

        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")  # fixes rotation, drops metadata
            w0, h0 = im.size
            # every standard width smaller than the original, plus the largest we allow
            # (or the original's own width if it is smaller). Never upscale.
            widths = sorted({w for w in WIDTHS if w < w0} | {min(max(WIDTHS), w0)})
            made = []
            for tw in widths:
                th = round(h0 * tw / w0)
                name = f"{e['slug']}-{tw}.webp"
                wanted.add(name)
                path = OUT / name
                if not path.exists() or path.stat().st_mtime < src.stat().st_mtime:
                    im.resize((tw, th), Image.LANCZOS).save(path, "WEBP", quality=QUALITY, method=6)
                made.append(tw)
        manifest.append({**e, "ext": ext, "width": w0, "height": h0, "sizes": made})

    for old in OUT.glob("*.webp"):  # remove thumbnails of photos no longer in originals/
        if old.name not in wanted:
            old.unlink()
    for old in FULL.iterdir():  # same for copies in site/full/ (never touches originals/)
        if old.is_file() and old.name not in wanted_full:
            old.unlink()

    write_gallery(manifest)
    thumbs = sum(p.stat().st_size for p in OUT.glob("*.webp"))
    fulls = sum(p.stat().st_size for p in FULL.iterdir() if p.is_file())
    print(f"{len(manifest)} photos, {len(wanted)} thumbnails ({thumbs/1e6:.1f} MB in site/img/), "
          f"{len(wanted_full)} full-size copies ({fulls/1e6:.1f} MB in site/full/)")


if __name__ == "__main__":
    main()
