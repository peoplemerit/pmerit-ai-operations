/**
 * PMERIT AI PLATFORM: DYNAMIC PARTIAL LOADER
 * Loads header, body, and footer partials into the main index.html
 */

// Function to load a partial into a container
function loadPartial(containerId, partialPath) {
  fetch(partialPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${partialPath}: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      document.getElementById(containerId).innerHTML = html;
      // Initialize components after loading
      if (typeof initComponents === 'function') {
        initComponents();
      }
    })
    .catch(error => {
      console.error(error);
      document.getElementById(containerId).innerHTML = `
        <div style="padding: 20px; color: red; text-align: center;">
          Error loading ${partialPath}. Please refresh the page.
        </div>
      `;
    });
}

// Load all partials when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadPartial('headerContainer', 'partials/header.html');
  loadPartial('bodyContainer', 'partials/body.html');
  loadPartial('footerContainer', 'partials/footer.html');
});
