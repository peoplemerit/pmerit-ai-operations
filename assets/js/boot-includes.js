// assets/js/boot-includes.js
// Loads header/body/footer partials, then signals main.js to initialize.

(async function () {
  async function loadPartial(targetId, url) {
    const host = document.getElementById(targetId);
    if (!host) return;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    host.innerHTML = await res.text();
  }

  async function boot() {
    // Load the three partials
    await Promise.all([
      loadPartial("header-container", "partials/header.html"),
      loadPartial("body-container", "partials/body.html"),
      loadPartial("footer-container", "partials/footer.html"),
    ]);

    // Tell main.js it's safe to wire up the UI now
    if (typeof window.PMERIT_INIT === "function") {
      window.PMERIT_INIT();
    } else {
      // Fallback: dispatch an event if main.js hasn't attached yet
      document.dispatchEvent(new Event("partials:loaded"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
