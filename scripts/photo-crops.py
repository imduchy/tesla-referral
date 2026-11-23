"""Crops and compresses assets/hero-source.jpg into src/img/ (published).

Needs Pillow: `python3 scripts/photo-crops.py`. Re-run if the source photo changes.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/hero-source.jpg"
OUT = ROOT / "src/img"

# Focus point (fraction of width/height) — the charge port.
FOCUS = (0.42, 0.40)
CROPS = {
    "wide": (16, 9, [800, 1280, 1920]),   # desktop, below the hero
    "mobile": (4, 3, [480, 800, 1200]),   # phones
    "og": (5, 6, [500]),                  # share-image panel (500×600)
}


def crop(im, rw, rh):
    w, h = im.size
    if w / h > rw / rh:
        cw, ch = round(h * rw / rh), h
    else:
        cw, ch = w, round(w * rh / rw)
    x = min(max(round(FOCUS[0] * w - cw / 2), 0), w - cw)
    y = min(max(round(FOCUS[1] * h - ch / 2), 0), h - ch)
    return im.crop((x, y, x + cw, y + ch))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    for name, (rw, rh, widths) in CROPS.items():
        c = crop(im, rw, rh)
        for w in widths:
            r = c.resize((w, round(w * rh / rw)), Image.LANCZOS)
            r.save(OUT / f"photo-{name}-{w}.webp", "WEBP", quality=78, method=6)
            r.save(OUT / f"photo-{name}-{w}.jpg", "JPEG", quality=80, optimize=True, progressive=True)
            print("wrote", f"src/img/photo-{name}-{w}.{{webp,jpg}}")


if __name__ == "__main__":
    main()
