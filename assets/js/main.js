function init() {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const supportBtn = document.getElementById('supportBtn');
  const langSelect = document.getElementById('lang');

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  if (supportBtn) {
    supportBtn.addEventListener('click', () => {
      setSupport(true);
      addMessage('PMERIT AI', "Support mode activated! I'm now ready to help you with any technical issues, account questions, or general platform inquiries. How can I assist you?");
    });
  }
  
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      state.lang = langSelect.value;
      save('pmerit_lang', state.lang);
      addMessage('PMERIT AI', `Language changed to ${langSelect.options[langSelect.selectedIndex].text}. In a full implementation, the entire interface would be translated.`);
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
