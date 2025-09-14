let isSupportMode = false;

function setSupport(mode) {
  isSupportMode = mode;
}

function addMessage(sender, message) {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
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

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  addMessage('User', message);
  input.value = '';

  setTimeout(() => {
    if (isSupportMode) {
      addMessage('PMERIT AI', `I received your message: "${message}". A support agent will be with you shortly.`);
    } else {
      addMessage('PMERIT AI', 'Thank you for your message! How can I help you further today?');
    }
  }, 1000);
}
