const go = document.getElementById("go");
const status = document.getElementById("status");
const options = document.getElementById("options");

go.addEventListener("click", async () => {
  go.disabled = true;
  status.textContent = "";
  try {
    const response = await chrome.runtime.sendMessage({ type: "ahumane:humanize" });
    if (!response?.ok) throw new Error(response?.error || "Could not read the selection.");
    window.close();
  } catch (error) {
    status.textContent = error.message || "Could not read the selection.";
    go.disabled = false;
  }
});

options.addEventListener("click", async (event) => {
  event.preventDefault();
  const current = await chrome.storage.sync.get({ appUrl: "http://localhost:3210" });
  const next = window.prompt("AHumane app URL", current.appUrl);
  if (next) await chrome.storage.sync.set({ appUrl: next.trim().replace(/\/$/, "") });
  status.textContent = "App URL saved.";
});
