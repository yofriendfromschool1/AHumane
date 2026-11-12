const DEFAULTS = { appUrl: "http://localhost:3210" };

async function getAppUrl() {
  const stored = await chrome.storage.sync.get(DEFAULTS);
  return String(stored.appUrl || DEFAULTS.appUrl).replace(/\/$/, "");
}

function encodeHandoff(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function humanizeSelection() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) throw new Error("No active tab.");
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => String(window.getSelection()?.toString() || ""),
  });
  const text = String(results?.[0]?.result || "").trim();
  if (!text) throw new Error("Select some text first, then try again.");
  const appUrl = await getAppUrl();
  const url = `${appUrl}/studio/humanizer?handoff=${encodeHandoff(text)}`;
  await chrome.tabs.create({ url });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ahumane-humanize",
    title: "Humanize selection with AHumane",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "ahumane-humanize") {
    humanizeSelection().catch((error) => console.warn("AHumane:", error));
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "ahumane:humanize") {
    humanizeSelection()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }
  return false;
});
