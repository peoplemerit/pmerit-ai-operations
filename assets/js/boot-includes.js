// assets/js/boot-includes.js
// Loads header/body/footer partials, then signals the app to initialize.
// Robust to network/cache issues and missing containers.

(() => {
  const PARTIALS = [
    { host: 'header-container', url: 'partials/header.html' },
    { host: 'body-container',   url: 'partials/body.html'   },
    { host: 'footer-container', url: 'partials/footer.html' },
  ];

  // Small utility: safe log group
  const log = (...a) => console.log('[boot-includes]', ...a);
  const warn = (...a) => console.warn('[boot-includes]', ...a);
  const err = (...a) => console.error('[boot-includes]', ...a);

  async function loadPartial({ host, url }) {
    const mount = document.getElementById(host);
    if (!mount) {
      warn(`Missing mount #${host}. Skipping ${url}.`);
      return { host, url, ok: false, reason: 'missing-mount' };
    }

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      const html = await res.text();
      mount.innerHTML = html;
      return { host, url, ok: true };
    } catch (e) {
      err(`Failed to load ${url}:`, e);
      // Leave a tiny placeholder so devs see something in DOM while not crashing
      mount.innerHTML = `<!-- failed to load: ${url} -->`;
      return { host, url, ok: false, reason: e.message || 'fetch-failed' };
    }
  }

  function signalReady(results) {
    try {
      // Mark on <html> so CSS/other scripts can gate on it if needed
      document.documentElement.setAttribute('data-partials-ready', '1');

      const evt = new CustomEvent('partials:ready', { detail: { results } });
      document.dispatchEvent(evt);
      log('Dispatched event "partials:ready".', results);

      // Optional direct init (if app exposes it)
      if (typeof window.PMERIT_INIT === 'function') {
        try {
          window.PMERIT_INIT();
          log('Called window.PMERIT_INIT()');
        } catch (e) {
          err('Error in window.PMERIT_INIT():', e);
        }
      }
    } catch (e) {
      err('Error dispatching partials:ready:', e);
    }
  }

  async function boot() {
    log('Starting partial loads…');
    const results = [];
    // Load in parallel but preserve result order for easier reading
    await Promise.all(
      PARTIALS.map(async (p, i) => (results[i] = await loadPartial(p)))
    );
    signalReady(results);
  }

  // Ensure DOM exists before we start touching it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    // If script is deferred, DOM is already there
    boot();
  }

  // Safety net: if something blocks DOMContentLoaded, fire after a grace period
  setTimeout(() => {
    const flagged = document.documentElement.getAttribute('data-partials-ready') === '1';
    if (!flagged) {
      warn('Grace timeout reached — attempting late boot.');
      boot();
    }
  }, 7000);
})();
