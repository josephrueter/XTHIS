# XTHIS

Chrome Manifest V3 extension that posts highlighted text to X.com with the
source URL attached. Internal use only — no Web Store distribution.

## Tweet format

```
"<selected text>" <pageURL>
```

Single space between the closing quote and the URL. X auto-detects URLs in the
post intent and renders a link card — that is the intended behavior.

Selection over 254 chars is truncated and terminated with a single ellipsis
character `…`. With no selection, only the page URL is posted.

## Install

1. Open `chrome://extensions`.
2. Enable Developer Mode (top right).
3. Click **Load unpacked** and select this `xthis/` folder.
4. Pin the XTHIS icon to the toolbar.
5. To pick up edits, hit the refresh icon on the XTHIS card in
   `chrome://extensions`.

## Triggers

All three do the same thing:

- **Toolbar icon click**
- **Right-click → "Post to X with XTHIS"** (works with or without a selection)
- **Keyboard shortcut** (either fires the same action):
  - `⌃⇧X` (Control+Shift+X)
  - `⌥⇧X` (Option+Shift+X) — note: in text fields macOS may insert `˛` before
    Chrome catches the keypress. If that bites, rebind at
    `chrome://extensions/shortcuts`.

If the shortcut conflicts with anything on your system, rebind it at
`chrome://extensions/shortcuts` — no code change required.

## Notes

- Relies on your existing X login session.
- Internal pages (`chrome://`, `chrome-extension://`, `file://`, `about:`) are
  a no-op.
- The 254-character selection budget assumes X wraps the appended URL to its
  fixed 23-char t.co length: 280 − 23 − 3 (two quotes + space) = 254.

## License

MIT — see [`LICENSE`](../LICENSE) at the project root.

## Icons

`icons/icon{16,32,48,128}.png` are an XT monogram, orange `#D97706` on
near-black `#0D0D0D`. Regenerate with `python3 gen_icons.py` (requires
Pillow) — match these hex values exactly if you swap in custom art.
