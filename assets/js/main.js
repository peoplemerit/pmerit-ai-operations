/**
 * Main application logic and event listeners.
 */

function init() {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const supportBtn = document.getElementById('supportBtn');
  const pricingBtn = document.getElementById('pricingBtn');
  const partnershipBtn = document.getElementById('partnershipBtn');

  // Load partials (simulated)
  // In a real application, you'd use fetch() to load these
  document.getElementById('header-container').innerHTML = ``;
  document.getElementById('nav-container').innerHTML = ``;
  document.getElementById('footer-container').innerHTML = ``;
  document.getElementById('main-content').innerHTML = `
    <div class="hero-section">
      <h1 class="text-3xl font-bold">PMERIT AI</h1>
      <p class="text-xl text-text-secondary">Accessible Global Education</p>
      <button class="btn btn-primary">Discover Your Path (AI)</button>
    </div>

    <div class="right-panel">
      <div id="chatBox" class="chat-box"></div>
      <form id="chatForm" class="chat-input" onsubmit="event.preventDefault(); sendMessage();">
        <input type="text" id="chatInput" placeholder="Send a message..." autocomplete="off">
        <button type="submit" id="sendBtn" class="icon"><i class="fas fa-paper-plane"></i></button>
      </form>
    </div>
  `;

  // Attach event listeners
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  if (supportBtn) {
    supportBtn.addEventListener('click', () => {
      setSupport(true);
      addMessage('PMERIT AI', "Support mode activated! I'm now ready to help you with any technical issues, account questions, or general platform inquiries. How can I assist you?");
    });
  }

  if (pricingBtn) {
    pricingBtn.addEventListener('click', () => {
      addMessage('PMERIT AI', 'PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support. Would you like to learn more about our pricing options?');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
