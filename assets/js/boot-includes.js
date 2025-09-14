document.addEventListener('DOMContentLoaded', () => {
  const loadPartial = async (containerId, filePath) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Could not load ${filePath}`);
      const text = await response.text();
      document.getElementById(containerId).innerHTML = text;
    } catch (error) {
      console.error(error);
    }
  };

  loadPartial('header-container', 'partials/header.html');
  loadPartial('body-container', 'partials/body.html');
  loadPartial('footer-container', 'partials/footer.html');
});
