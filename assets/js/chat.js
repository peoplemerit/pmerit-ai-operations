// assets/js/chat.js
// Pure helpers; no DOM lookups during module eval.
(function () {
  function addMessage(sender, text, isUser) {
    const chatBody = document.getElementById("chatBody");
    if (!chatBody) return;

    const welcomeMsg = document.getElementById("welcomeMsg");
    if (welcomeMsg) welcomeMsg.remove();

    const el = document.createElement("article");
    el.className = "bubble";
    el.innerHTML = `
      <div class="ava" style="${isUser ? "background:#4f46e5" : ""}">
        <i class="fas ${isUser ? "fa-user" : "fa-user-circle"}"></i>
      </div>
      <div><h3>${sender}</h3><p>${text}</p></div>
    `;
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Optional TTS + VH captions (checked by main.js)
    try {
      if (window.state?.tts && !isUser && "speechSynthesis" in window) {
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      }
      if (window.state?.vh && !isUser) {
        const cap = document.getElementById("captions");
        if (cap) cap.textContent = text;
      }
    } catch {}
  }

  function sendMessage() {
    const input = document.getElementById("chatInput");
    const count = document.getElementById("count");
    if (!input || !count) return;

    const text = input.value.trim();
    if (!text) return;

    addMessage("You", text, true);
    input.value = "";
    count.textContent = "0/1000";

    setTimeout(() => {
      const reply = window.state?.support
        ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, courses, technical issues, or platform features. What do you need assistance with?"
        : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to take the assessment?";
      addMessage("PMERIT AI", reply, false);
    }, 1000);
  }

  // Export
  window.PMERIT_CHAT = { addMessage, sendMessage };
})();
