// SPDX-License-Identifier: MIT
// Injected on demand by background.js via chrome.scripting.executeScript.
// The last expression value is returned as the script's result.
(() => {
  const sel = window.getSelection();
  return sel ? sel.toString() : "";
})();
