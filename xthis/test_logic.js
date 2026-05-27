// Standalone test of XTHIS URL-building logic. Mirrors background.js exactly.
// Run: node test_logic.js

const TWEET_LIMIT = 280;
const TCO_LENGTH = 23;
const QUOTE_AND_SPACE_OVERHEAD = 3;
const SELECTION_BUDGET = TWEET_LIMIT - TCO_LENGTH - QUOTE_AND_SPACE_OVERHEAD;

const INTERNAL_PROTOCOLS = new Set([
  "chrome:", "chrome-extension:", "edge:", "brave:",
  "about:", "file:", "view-source:", "devtools:",
]);

function isInternalUrl(url) {
  if (!url) return true;
  try {
    return INTERNAL_PROTOCOLS.has(new URL(url).protocol);
  } catch { return true; }
}

function truncateSelection(raw) {
  const text = (raw || "").replace(/\s+/g, " ").trim();
  if (text.length <= SELECTION_BUDGET) return text;
  return text.slice(0, SELECTION_BUDGET - 1) + "…";
}

function buildIntentUrl(selection, pageUrl) {
  const trimmed = (selection || "").trim();
  const payload = trimmed
    ? `"${truncateSelection(trimmed)}" ${pageUrl}`
    : pageUrl;
  return `https://x.com/intent/post?text=${encodeURIComponent(payload)}`;
}

// ---- assertions ----
const cases = [];
function ok(name, actual, expected) {
  const pass = actual === expected;
  cases.push({ name, pass, actual, expected });
}

// Constants
ok("budget = 254", SELECTION_BUDGET, 254);

// Internal URL detection
ok("chrome://settings internal",  isInternalUrl("chrome://settings"),  true);
ok("file:// internal",            isInternalUrl("file:///tmp/x.html"), true);
ok("about:blank internal",        isInternalUrl("about:blank"),        true);
ok("https not internal",          isInternalUrl("https://example.com"), false);
ok("garbage internal",            isInternalUrl("not a url"),          true);
ok("undefined internal",          isInternalUrl(undefined),            true);

// Truncation
const exact = "a".repeat(254);
ok("254 chars passthrough",   truncateSelection(exact),                exact);
const over = "a".repeat(300);
const truncated = truncateSelection(over);
ok("over: length = 254",      truncated.length,                        254);
ok("over: ends with ellipsis", truncated.endsWith("…"),                true);
ok("over: 253 a's + ellipsis", truncated, "a".repeat(253) + "…");
ok("whitespace collapse",     truncateSelection("hi   \n  there"),    "hi there");

// Intent URL
const url = "https://example.com/post/1";
ok("no selection -> URL only",
   buildIntentUrl("", url),
   `https://x.com/intent/post?text=${encodeURIComponent(url)}`);
ok("whitespace selection -> URL only",
   buildIntentUrl("   \n  ", url),
   `https://x.com/intent/post?text=${encodeURIComponent(url)}`);
ok("with selection -> quoted + URL",
   buildIntentUrl("hello world", url),
   `https://x.com/intent/post?text=${encodeURIComponent(`"hello world" ${url}`)}`);

// Long selection inside intent URL
const longBuilt = buildIntentUrl("z".repeat(500), url);
const decoded = decodeURIComponent(longBuilt.split("text=")[1]);
ok("long: payload starts with quote", decoded.startsWith(`"`), true);
ok("long: payload ends with quoted-ellipsis + space + url",
   decoded.endsWith(`…" ${url}`), true);
ok("long: inner text is exactly 254",
   decoded.match(/^"(.*)" /)[1].length, 254);

// ---- report ----
let fail = 0;
for (const c of cases) {
  if (c.pass) {
    console.log(`PASS  ${c.name}`);
  } else {
    fail++;
    console.log(`FAIL  ${c.name}`);
    console.log(`        expected: ${JSON.stringify(c.expected)}`);
    console.log(`        actual:   ${JSON.stringify(c.actual)}`);
  }
}
console.log(`\n${cases.length - fail}/${cases.length} passed`);
process.exit(fail ? 1 : 0);
