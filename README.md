# XTHIS

A tiny Chrome extension that opens X.com's post composer pre-filled with the
text you've highlighted and the URL of the page you're on. One step, no
copy-paste.

Triggers (all do the same thing):

- Toolbar icon click
- Right-click → **Post to X with XTHIS**
- `Ctrl+Shift+X` or `Option+Shift+X`

## Install

From source (until the Chrome Web Store listing is live):

1. Download or clone this repo.
2. Open `chrome://extensions`, enable Developer Mode.
3. **Load unpacked** → pick the `xthis/` folder.
4. Pin the icon. That's it.

See [`xthis/README.md`](xthis/README.md) for the per-extension install
details, shortcut rebinding, and asset notes.

## Repo layout

```
xthis/                The extension itself — what you load unpacked
  manifest.json
  background.js       Service worker — all three triggers
  content.js          Selection getter, injected on demand
  icons/              16/32/48/128 PNGs
  gen_icons.py        Regenerate icons (Pillow required)
  gen_promo.py        Regenerate store promo tile
  test_logic.js       Unit tests for URL building (node test_logic.js)
  README.md
privacy.md            Privacy policy — host this URL with the store listing
store-listing.md      Chrome Web Store listing copy
promo_440x280.png     Web Store small promo tile
LICENSE               MIT
```

## License

[MIT](LICENSE). Copyright (c) 2026 Joseph Rueter.

## Privacy

XTHIS does not collect, store, or transmit any data. See
[`privacy.md`](privacy.md) for details.
