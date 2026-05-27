// SPDX-License-Identifier: MIT
// XTHIS background service worker.
// Three triggers (toolbar click, context menu, keyboard shortcut) all funnel
// through share() — get selection from the active tab, build the X intent
// URL, open it in a new tab.

const TWEET_LIMIT = 280;
const TCO_LENGTH = 23;             // X wraps every URL to 23 chars
const QUOTE_AND_SPACE_OVERHEAD = 3; // opening quote + closing quote + space
const SELECTION_BUDGET = TWEET_LIMIT - TCO_LENGTH - QUOTE_AND_SPACE_OVERHEAD; // 254

const INTERNAL_PROTOCOLS = new Set([
  "chrome:",
  "chrome-extension:",
  "edge:",
  "brave:",
  "about:",
  "file:",
  "view-source:",
  "devtools:",
]);

function isInternalUrl(url) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return INTERNAL_PROTOCOLS.has(parsed.protocol);
  } catch {
    return true;
  }
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

async function getSelectionFromTab(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"],
    });
    return results?.[0]?.result || "";
  } catch {
    return "";
  }
}

async function share(tab, selectionHint) {
  if (!tab || tab.id == null) return;
  if (isInternalUrl(tab.url)) return;

  let selection = (selectionHint || "").trim();
  if (!selection) {
    selection = await getSelectionFromTab(tab.id);
  }

  const intentUrl = buildIntentUrl(selection, tab.url);
  await chrome.tabs.create({ url: intentUrl, active: true });
}

async function shareActiveTab(selectionHint) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) await share(tab, selectionHint);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "xthis-share",
      title: "Post to X with XTHIS",
      contexts: ["selection", "page"],
    });
  });
});

chrome.action.onClicked.addListener((tab) => {
  share(tab);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "xthis-share") return;
  share(tab, info.selectionText);
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "xthis-share" && command !== "xthis-share-alt") return;
  shareActiveTab();
});
