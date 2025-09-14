// chat.js — extracted helpers from blueprint script (globals on window)
// Source: addMessage() and sendMessage() logic from blueprint. :contentReference[oaicite:4]{index=4}
(function(){
  function addMessage(sender, text, isUser){
    const chatBody = document.getElementById('chatBody');
    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) welcomeMsg.remove();

    const el = document.createElement('article');
    el.className = 'bubble';
    el.innerHTML = `
      <div class="ava" style="${isUser ? 'background:#4f46e5' : ''}">
        <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
      </div>
      <div>
        <h3>${sender}</h3>
        <p>${text}</p>
      </div>
    `;
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;

    // TTS + VH captions (state is defined in main.js per blueprint)
    if (window.state && window.state.tts && !isUser && 'speechSynthesis' in window){
      const u = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(u);
    }
    if (window.state && window.state.vh && !isUser){
      const cap = document.getElementById('captions');
      if (cap) cap.textContent = text;
    }
  }

  function sendMessage(){
    const chatInput = document.getElementById('chatInput');
    const count = document.getElementById('count');
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('You', text, true);
    chatInput.value = '';
    count.textContent = '0/1000';

    setTimeout(() => {
      const reply = (window.state && window.state.support)
        ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, courses, technical issues, or platform features. What do you need assistance with?"
        : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to begin the assessment?";
      addMessage('PMERIT AI', reply, false);
    }, 1000);
  }

  // expose to main.js
  window.PMERIT_CHAT = { addMessage, sendMessage };
})();
