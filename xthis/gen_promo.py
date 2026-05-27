#!/usr/bin/env python3
"""Generate the Chrome Web Store 440x280 small promo tile for XTHIS."""
from PIL import Image, ImageDraw, ImageFont
import os

BG = (13, 13, 13, 255)       # #0D0D0D
FG = (217, 119, 6, 255)      # #D97706
DIM = (232, 230, 227, 255)   # #E8E6E3
W, H = 440, 280

FONT_BOLD = "/Library/Fonts/SF-Mono-Bold.otf"
FONT_REG  = "/Library/Fonts/SF-Mono-Regular.otf"

img = Image.new("RGBA", (W, H), BG)
draw = ImageDraw.Draw(img)

# Wordmark
wordmark = "XTHIS"
font_wm = ImageFont.truetype(FONT_BOLD, 96)
bbox = draw.textbbox((0, 0), wordmark, font=font_wm)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
x = (W - tw) / 2 - bbox[0]
y = 60 - bbox[1]
draw.text((x, y), wordmark, fill=FG, font=font_wm)

# Tagline
tagline = "post highlights to x"
font_tag = ImageFont.truetype(FONT_REG, 20)
bbox = draw.textbbox((0, 0), tagline, font=font_tag)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
x = (W - tw) / 2 - bbox[0]
y = 180 - bbox[1]
draw.text((x, y), tagline, fill=DIM, font=font_tag)

# Subtle terminal prompt
prompt = "> _"
font_p = ImageFont.truetype(FONT_REG, 16)
draw.text((24, 240), prompt, fill=FG, font=font_p)

out = os.path.join(os.path.dirname(__file__), "..", "promo_440x280.png")
img.save(out, "PNG")
print(f"wrote {out}")
