#!/usr/bin/env python3
"""Generate XTHIS extension icons. XT monogram, Cormorant Garamond on dark."""
from PIL import Image, ImageDraw, ImageFont
import os

BG = (26, 27, 31, 255)       # #1A1B1F
FG = (236, 230, 220, 255)    # #ECE6DC
SIZES = [16, 32, 48, 128]

# Cormorant Garamond, variable font (wght axis). Vendored, SIL OFL.
HERE = os.path.dirname(__file__)
FONT_PATH = os.path.join(HERE, "fonts", "CormorantGaramond[wght].ttf")
FONT_WEIGHT = 700  # Bold

def load_font(size):
    font = ImageFont.truetype(FONT_PATH, size)
    try:
        font.set_variation_by_axes([FONT_WEIGHT])
    except Exception:
        pass
    return font

out_dir = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(out_dir, exist_ok=True)

for size in SIZES:
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Tiny corner radius effect: paint a 2px inset border block of bg color
    # (skipped - terminal look prefers sharp corners)

    text = "XT"
    # Cormorant Garamond Bold is wide; size so painted "XT" leaves a small
    # margin inside the tile (and reads clean at 16px).
    font_px = int(size * 0.7)
    font = load_font(font_px)

    # Center text
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1]
    draw.text((x, y), text, fill=FG, font=font)

    path = os.path.join(out_dir, f"icon{size}.png")
    img.save(path, "PNG")
    print(f"wrote {path}")
