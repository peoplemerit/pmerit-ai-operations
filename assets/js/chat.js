/**
 * Handles all chat-related logic.
 */

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (message === '') return;

  addMessage('User', message);
  input.value = '';

  // Simulate AI response
  setTimeout(() => {
    if (state.isSupportMode) {
      addMessage('PMERIT AI', `I received your message: "${message}". A support agent will be with you shortly.`);
    } else {
      addMessage('PMERIT AI', 'Thank you for your message! How can I help you further today?');
    }
  }, 1000);
}
