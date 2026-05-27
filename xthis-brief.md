# XTHIS — Chrome Extension Project Brief

Build a Chrome Manifest V3 extension that posts highlighted text to X.com with the source URL attached. Internal use only, no Web Store distribution.

## Stack
- Chrome Extension Manifest V3
- Vanilla JS, no build step
- Service worker background script

## Behavior

### Tweet format
```
"<selected text>" <pageURL>
```
Single space between closing quote and URL. URL is plain — X auto-detects URLs in post intent and renders a link card. That's the desired behavior.

### Compose target
Open in a new tab:
```
https://x.com/intent/post?text=<URL-encoded payload>
```
Use `chrome.tabs.create({ url: ..., active: true })`.

### Character handling
- Tweet limit: 280
- X wraps any URL to t.co length (23 chars fixed)
- Fixed overhead: 2 quote chars + 1 space + 23 (URL) = **26 chars**
- Selected text budget: **254 chars**
- If selection > 254 chars: truncate to 253 chars + `…` (single ellipsis character, not three dots)

### Triggers
All three trigger the same compose action:

1. **Toolbar icon click** — `chrome.action.onClicked`
2. **Right-click context menu** — entry labeled "Post to X with XTHIS", visible when text is selected. Use `chrome.contextMenus` with `contexts: ["selection", "page"]`
3. **Keyboard shortcut** — `Cmd+Opt+T` on Mac, `Alt+Ctrl+T` on Win/Linux, via `commands` manifest key with `_execute_action` or a custom command

### Selection retrieval
Use a content script that listens for messages from the background worker and returns `window.getSelection().toString()`. Background worker requests selection on trigger, then constructs URL.

### Edge cases
- **No selection (or whitespace only)**: post just the current page URL, no quotes
- **Internal pages** (`chrome://`, `chrome-extension://`, `file://`, `about:`): extension is a no-op, no error
- **x.com itself**: works normally, URL is the current x.com page
- **Page with no URL access** (rare): fall back to no-selection path

## Design language

Claude Code GUI aesthetic:
- Background: near-black, `#0D0D0D`
- Accent: warm orange, `#D97706` (Anthropic signature orange)
- Text on dark: off-white, `#E8E6E3`
- Font: system monospace stack — `ui-monospace, "SF Mono", Menlo, monospace`
- Minimal, terminal-inspired, no rounded corners beyond 2-4px

### Icon (4 sizes: 16, 32, 48, 128 px)
Simple `XT` or `X→` monogram in orange (`#D97706`) on dark (`#0D0D0D`) background. Generate as PNG. If image generation is awkward, produce an SVG and convert, or use a solid orange square placeholder labeled clearly in the README so I can drop in art later.

### UI surfaces
No popup window required. If a brief toast or status indicator is useful for confirming the action fired (especially for the keyboard shortcut), use a small content-script-injected element styled to the above palette that auto-dismisses in ~1.5s. Optional.

## File structure
```
xthis/
├── manifest.json
├── background.js       # service worker: handles all three triggers, builds URL, opens tab
├── content.js          # gets selection on demand
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # install instructions, shortcut, how to update
```

## Manifest essentials
- `manifest_version: 3`
- `permissions: ["activeTab", "contextMenus", "scripting"]`
- `host_permissions`: omit if `activeTab` + `scripting` covers it — verify and use minimum needed
- `commands` block with `xthis-share` mapped to `Alt+Command+T` (Mac) / `Alt+Ctrl+T` (default)
- `background.service_worker: "background.js"`
- `action` with default icon

## Out of scope
- No options page
- No analytics, no telemetry
- No Chrome Web Store assets (privacy policy, screenshots, store copy)
- No Firefox/Safari/Edge support
- No X API integration — intent URL only
- No login handling — relies on user's existing X session

## Acceptance criteria
- Loads unpacked without errors in `chrome://extensions`
- All three triggers (icon, context menu, shortcut) produce identical behavior
- Tweet opens in a new tab, prefilled correctly, ready to post
- Selection > 254 chars truncates with single ellipsis character
- No-selection path posts URL only
- Keyboard shortcut works regardless of page focus state (within Chrome's normal limits)
- Internal pages produce no errors

## Install instructions (for README)
1. Open `chrome://extensions`
2. Enable Developer Mode (top right)
3. Click "Load unpacked" → select the `xthis/` folder
4. Pin the icon to the toolbar
5. To update after edits: hit the refresh icon on the XTHIS card

## Notes
- `Cmd+Opt+T` is generally free on Mac Chrome. If it conflicts with anything on my system, the shortcut can be rebound at `chrome://extensions/shortcuts` — no code change needed.
- Treat the orange/dark palette as locked. If icon assets need to be regenerated, match these hex values exactly.
