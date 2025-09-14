// assets/js/boot-includes.js
// Load header/body/footer partials, then signal main init. Robust to network/cache.

(async function () {
  async function loadPartial(targetId, url) {
    const host = document.getElementById(targetId);
    if (!host) return;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    host.innerHTML = await res.text();
  }

  async function boot() {
    try {
      await Promise.all([
        loadPartial("header-container", "partials/header.html"),
        loadPartial("body-container",   "partials/body.html"),
        loadPartial("footer-container", "partials/footer.html"),
      ]);
    } catch (e) {
      console.error(e);
    }

    // Prefer direct call; fall back to event for safety
    if (typeof window.PMERIT_INIT === "function") {
      window.PMERIT_INIT();
    } else {
      document.dispatchEvent(new Event("partials:loaded"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
