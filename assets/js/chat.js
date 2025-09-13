/**
 * PMERIT AI PLATFORM: CHAT.JS
 * Handles chat logic, message rendering, and virtual human responses
 */

// Chat functionality
function initChat() {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatBody = document.getElementById('chatBody');
  const welcomeMsg = document.getElementById('welcomeMsg');

  if (!chatInput || !sendBtn || !chatBody) return;

  // Send message function
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Add user message
    addMessage('You', text, true);
    
    // Clear input
    chatInput.value = '';
    document.getElementById('count').textContent = '0/1000';
    
    // Simulate AI response
    setTimeout(() => {
      const isSupportMode = document.getElementById('supportBadge').style.display === 'inline-block';
      const reply = isSupportMode
        ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, courses, technical issues, or platform features. What do you need assistance with?"
        : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to begin the assessment?";
      
      addMessage('PMERIT AI', reply);
    }, 1000);
  }

  // Add message to chat
  function addMessage(sender, text, isUser = false) {
    // Remove welcome message if it exists
    if (welcomeMsg && chatBody.contains(welcomeMsg)) {
      welcomeMsg.remove();
    }

    const messageEl = document.createElement('article');
    messageEl.className = 'bubble';
    
    messageEl.innerHTML = `
      <div class="ava" style="${isUser ? 'background:#4f46e5' : ''}">
        <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
      </div>
      <div>
        <h3>${sender}</h3>
        <p>${text}</p>
      </div>
    `;
    
    chatBody.appendChild(messageEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', initChat);
