/**
 * PMERIT AI PLATFORM: MAIN.JS
 * Handles core interactivity: toggles, chat input, dark mode, badges
 */

// Initialize components after partials are loaded
function initComponents() {
  // State management
  const state = {
    auth: false,
    dark: localStorage.getItem('pmerit_dark') === 'true',
    vh: false,
    support: false,
    tts: false,
    lang: localStorage.getItem('pmerit_lang') || 'en'
  };

  // Apply initial state
  if (state.dark) {
    document.body.classList.add('dark');
  }

  // Set up event listeners
  setupEventListeners(state);
  updateDashboardVisual(state);
}

function setupEventListeners(state) {
  // Dark Mode Toggle
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      state.dark = !state.dark;
      document.body.classList.toggle('dark', state.dark);
      localStorage.setItem('pmerit_dark', state.dark);
    });
  }

  // Virtual Human Toggle
  const vhToggle = document.getElementById('vhToggle');
  if (vhToggle) {
    vhToggle.addEventListener('click', () => {
      state.vh = !state.vh;
      const vhBadge = document.getElementById('vhBadge');
      const vhStage = document.getElementById('vhStage');
      const textChat = document.getElementById('textChat');
      const vhAvatar = document.getElementById('vhAvatar');
      
      if (vhBadge) vhBadge.style.display = state.vh ? 'inline-block' : 'none';
      if (vhStage) vhStage.style.display = state.vh ? 'block' : 'none';
      if (textChat) textChat.style.display = state.vh ? 'none' : 'block';
      if (vhAvatar) vhAvatar.classList.toggle('active', state.vh);
    });
  }

  // Support Mode Toggle
  const supportToggle = document.getElementById('supportToggle');
  if (supportToggle) {
    supportToggle.addEventListener('click', () => {
      state.support = !state.support;
      const supportBadge = document.getElementById('supportBadge');
      if (supportBadge) supportBadge.style.display = state.support ? 'inline-block' : 'none';
      
      // Update welcome message based on mode
      const welcomeCopy = document.getElementById('welcomeCopy');
      if (welcomeCopy) {
        welcomeCopy.textContent = state.support
          ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
          : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?";
      }
    });
  }

  // Chat Input Counter
  const chatInput = document.getElementById('chatInput');
  const count = document.getElementById('count');
  if (chatInput && count) {
    chatInput.addEventListener('input', () => {
      count.textContent = `${chatInput.value.length}/1000`;
    });
  }

  // Settings collapsible
  const settingsBox = document.getElementById('settingsBox');
  if (settingsBox) {
    const settingsHead = settingsBox.querySelector('.head');
    const settingsBody = settingsBox.querySelector('.body');
    
    settingsHead.addEventListener('click', () => {
      const isOpen = settingsBody.style.display === 'block';
      settingsBody.style.display = isOpen ? 'none' : 'block';
      settingsHead.querySelector('i.fas').className = isOpen ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
    });
  }

  // Language selector
  const langSelect = document.getElementById('lang');
  if (langSelect) {
    langSelect.value = state.lang;
    langSelect.addEventListener('change', function() {
      state.lang = this.value;
      localStorage.setItem('pmerit_lang', state.lang);
    });
  }

  // Mobile menu toggles
  const toggleLeft = document.getElementById('toggleLeft');
  const toggleRight = document.getElementById('toggleRight');
  if (toggleLeft) {
    toggleLeft.addEventListener('click', () => {
      const leftPanel = document.getElementById('left');
      if (leftPanel) leftPanel.style.display = leftPanel.style.display === 'none' ? 'block' : 'none';
    });
  }
  if (toggleRight) {
    toggleRight.addEventListener('click', () => {
      const rightPanel = document.getElementById('right');
      if (rightPanel) rightPanel.style.display = rightPanel.style.display === 'none' ? 'block' : 'none';
    });
  }
}

function updateDashboardVisual(state) {
  const dashBtn = document.getElementById('dashBtn');
  if (dashBtn) {
    dashBtn.classList.toggle('guest', !state.auth);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComponents);
} else {
  initComponents();
}
