#!/usr/bin/env python3
"""Generate XTHIS extension icons. XT monogram in orange on near-black."""
from PIL import Image, ImageDraw, ImageFont
import os

BG = (13, 13, 13, 255)       # #0D0D0D
FG = (217, 119, 6, 255)      # #D97706
SIZES = [16, 32, 48, 128]

# SF Mono — same family Terminal.app uses by default. Bold for icon legibility.
FONT_CANDIDATES = [
    "/Library/Fonts/SF-Mono-Bold.otf",
    "/Applications/Utilities/Terminal.app/Contents/Resources/Fonts/SF-Mono-Bold.otf",
    "/Library/Fonts/SF-Mono-Semibold.otf",
    "/Library/Fonts/SF-Mono-Regular.otf",
    "/System/Library/Fonts/SFNSMono.ttf",
    "/System/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/Monaco.ttf",
]

def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

out_dir = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(out_dir, exist_ok=True)

for size in SIZES:
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Tiny corner radius effect: paint a 2px inset border block of bg color
    # (skipped - terminal look prefers sharp corners)

    text = "XT"
    # Pick a font size that fills the icon nicely
    font_px = int(size * 0.62)
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
