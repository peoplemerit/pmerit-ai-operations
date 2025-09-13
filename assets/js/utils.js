/**
 * Global state and utility functions.
 */

const state = {
  lang: 'en',
  isSupportMode: false
};

const insights = [
  "Tip: You can use the search bar to find specific courses!",
  "Insight: Our AI can provide personalized learning paths just for you.",
  "Did you know? PMERIT is committed to making education accessible globally."
];

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
}

function load(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Error loading from localStorage", e);
    return defaultValue;
  }
}

function setSupport(mode) {
  state.isSupportMode = mode;
  // This would trigger a UI update in a more complete app
}

function addMessage(sender, message) {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message-bubble');

  if (sender === 'PMERIT AI') {
    messageElement.classList.add('ai-message');
  } else {
    messageElement.classList.add('user-message');
  }
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
